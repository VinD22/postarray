# Deploying Post Array to a single Hetzner box

Audience: whoever is putting the first production deployment up, with a Hetzner
account already in hand.

This is the cheap launch posture on purpose: one server running everything
except the database and the media bucket, both of which are already hosted
(Neon and Cloudflare R2). It is about €4 a month, and it is enough for a
product with no users yet.

It is not the posture to keep forever. What to change and when is at the end.

---

## What lives where

| Piece | Where it runs | Why |
| --- | --- | --- |
| Postgres | Neon | already provisioned and migrated |
| Media | Cloudflare R2 | already provisioned |
| Temporal + Redis | Docker, on the box | infrastructure, from the repo's compose file |
| web, api, worker, mcp, links | Node, on the box | the applications themselves |
| TLS and routing | Caddy, on the box | certificates without a certbot cron |

The applications do **not** have Dockerfiles. They run directly under Node with
systemd supervising them, which is fewer moving parts to debug at three in the
morning than a container build you have never run before.

## Why Temporal has to be here

`apps/worker/src/fallback/inline-scheduler.ts` exists so the product works on a
laptop without Temporal, and it **refuses to start when `NODE_ENV` is
production**. That refusal is deliberate: it keeps no durable history, so a
restart loses every pending post, and it has no cross-process deduplication, so
two copies of it would publish the same post twice.

Self-hosted Temporal is the same software Temporal Cloud runs. The difference
is who restarts it, and at this size the answer can be you.

---

## 1. The server

Create a **CX22** (2 vCPU, 4 GB RAM, 40 GB disk) in a region near your users,
running **Ubuntu 24.04**. Add your SSH key during creation rather than using a
root password.

4 GB is enough to run everything, but it is not enough to be careless during
the Next.js build. Section 5 gives that build a memory ceiling.

```bash
ssh root@YOUR_SERVER_IP
apt update && apt upgrade -y
```

Create a user for the app, so nothing runs as root:

```bash
adduser --disabled-password --gecos "" postarray
usermod -aG sudo postarray
rsync --archive --chown=postarray:postarray ~/.ssh /home/postarray/
```

Close everything except SSH and the web ports:

```bash
ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw --force enable
```

Nothing else is exposed. Temporal, Redis and every application port stay bound
to localhost, and Caddy is the only thing the internet talks to.

## 2. Docker, Node and pnpm

```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker postarray

curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs git
corepack enable
```

Node 22 is required (`package.json` engines). `corepack` gives you the exact
pnpm version the repo pins, so you do not have to think about it.

## 3. The repository

As the `postarray` user:

```bash
su - postarray
git clone https://github.com/VinD22/postarray.git app
cd app
git checkout development
pnpm install --frozen-lockfile
```

## 4. Configuration

Copy the `.env` you already assembled during provisioning onto the box. From
your laptop:

```bash
scp .env postarray@YOUR_SERVER_IP:/home/postarray/app/.env
```

Then on the box, set the values that are specific to running in production:

```bash
cd /home/postarray/app
cat >> .env <<'EOF'
NODE_ENV=production
APP_URL=https://postarray.com
API_URL=https://api.postarray.com
TEMPORAL_ADDRESS=127.0.0.1:7233
REDIS_URL=redis://127.0.0.1:6379
EOF
chmod 600 .env
```

`NODE_ENV=production` is what makes the inline scheduler refuse to start. That
is the point: if Temporal is not actually reachable, you want the worker to
fail loudly at boot rather than quietly accept posts it cannot durably keep.

## 5. Build

```bash
NODE_OPTIONS=--max-old-space-size=3072 pnpm build
```

The ceiling matters on a 4 GB box. Without it the Next.js build can be killed
by the kernel's OOM killer, which reports itself as a build that simply stopped
with no error worth reading.

## 6. Temporal and Redis

The repo's compose file also defines a Postgres for the application. You do not
want that one: Neon is the application database. Start only what this box needs
to provide.

```bash
docker compose up -d redis temporal-postgres temporal
docker compose ps
```

Wait for `temporal` to report healthy, then confirm it is actually answering:

```bash
docker exec relay-temporal temporal operator cluster health --address 127.0.0.1:7233
```

`temporal-postgres` is Temporal's own bookkeeping database and has nothing to
do with customer data. It is small, local, and its loss costs you pending
workflow state rather than anything a customer wrote.

## 7. Run the applications

Five systemd units, one per app. They differ only in name, port and start
command, so create them from a loop rather than by hand:

```bash
sudo bash -c 'for svc in "web:3000:apps/web" "api:3001:apps/api" "worker:0:apps/worker" "mcp:3003:apps/mcp" "links:3004:apps/links"; do
  name="${svc%%:*}"; rest="${svc#*:}"; port="${rest%%:*}"; dir="${rest#*:}"
  cat > /etc/systemd/system/postarray-$name.service <<EOF
[Unit]
Description=Post Array $name
After=network-online.target docker.service
Wants=network-online.target

[Service]
Type=simple
User=postarray
WorkingDirectory=/home/postarray/app/$dir
EnvironmentFile=/home/postarray/app/.env
Environment=NODE_ENV=production
Environment=PORT=$port
ExecStart=/usr/bin/pnpm start
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF
done'

sudo systemctl daemon-reload
sudo systemctl enable --now postarray-web postarray-api postarray-worker postarray-mcp postarray-links
sudo systemctl status "postarray-*" --no-pager
```

`Restart=always` is what makes a crashed process come back. Combined with
Temporal holding the schedule durably, a restart loses nothing: the workflow
resumes where it was.

The worker has no port; it takes work from Temporal rather than answering
requests.

## 8. TLS and routing

```bash
sudo apt install -y caddy
sudo tee /etc/caddy/Caddyfile > /dev/null <<'EOF'
postarray.com, www.postarray.com {
    reverse_proxy 127.0.0.1:3000
}

api.postarray.com {
    reverse_proxy 127.0.0.1:3001
}

mcp.postarray.com {
    reverse_proxy 127.0.0.1:3003
}
EOF
sudo systemctl reload caddy
```

Point the DNS at the box before reloading, or the certificate request fails and
Caddy backs off for a while:

| Record | Name | Value |
| --- | --- | --- |
| A | `@` | your server IP |
| A | `www` | your server IP |
| A | `api` | your server IP |
| A | `mcp` | your server IP |

Caddy obtains and renews certificates on its own. There is no cron job to
forget about.

## 9. Check it

```bash
curl -sI https://postarray.com | head -1
curl -s https://api.postarray.com/v1/health | head -c 200
sudo journalctl -u postarray-worker -n 30 --no-pager
```

The worker log is the one that matters. If Temporal were unreachable you would
see the inline scheduler refusing to start, which is the failure you want to
see at boot rather than discover when a scheduled post does not go out.

Then confirm the two things that only exist in production:

- **Polar webhook.** Its deliveries list has been empty because the domain did
  not resolve. It should start succeeding now. A failing delivery here means
  customers can pay and receive nothing, so check it explicitly rather than
  assuming.
- **A real scheduled post**, five minutes out, on a connected account. This is
  the only test that exercises Temporal, the worker, the connector and the
  receipt together.

## 10. Deploying a change

```bash
cd /home/postarray/app
git pull
pnpm install --frozen-lockfile
NODE_OPTIONS=--max-old-space-size=3072 pnpm build
sudo systemctl restart postarray-web postarray-api postarray-worker postarray-mcp postarray-links
```

There is a rebuild gap of a few seconds where the site is down. At zero users
that is acceptable and worth naming rather than pretending otherwise.

Database migrations, when a release has one:

```bash
pnpm db:migrate
```

Run it before restarting the services. The migration runner refuses to reapply
a file whose checksum changed, so a re-run is safe.

---

## What this posture is not

Stated plainly, so nobody discovers it at a bad moment:

- **One box is one failure domain.** If it dies, the product is down until you
  rebuild it. Nothing is lost, because the data is in Neon and R2, but there is
  no automatic failover.
- **Deploys have a visible gap.** No blue/green, no rolling restart.
- **Temporal's own state is on local disk.** Losing the box loses pending
  workflow state. Published posts and their receipts are in Neon and survive;
  a post scheduled but not yet published would need rescheduling.
- **Nothing is backed up here.** Neon's point-in-time restore covers the
  database. Set it to seven days rather than one; at the current size the cost
  is pennies and one day is the whole window you get.

## When to change it

Move off this posture when one of these becomes true, not on a schedule:

- Paying customers exist and downtime costs money: split web onto a platform
  with zero-downtime deploys, keep the worker here.
- The box runs out of memory during builds: build elsewhere and ship the
  artifact, or take the next size up.
- Running Temporal yourself starts costing real attention: that is the moment
  Temporal Cloud's $100 a month is worth it, and not before.
