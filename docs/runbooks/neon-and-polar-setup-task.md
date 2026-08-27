# Task: provision Neon and Polar for production

Audience: the operations agent, working with repository access and a signed-in
Chrome profile belonging to the founder (Vinayak).

Scope: **external service configuration only.** Do not change application code,
do not run migrations, do not deploy anything.

The broader reference for every variable this product consumes is
[`ops-secrets-and-keys-handoff.md`](./ops-secrets-and-keys-handoff.md). This
file is narrower: it is the specific list of things to do now, in order.

---

## Before you start: how to behave in a borrowed session

You are operating a browser signed in as the founder. Two consequences follow,
and neither is a formality.

**Everything you click is attributable to him, and some of it is financially
binding.** A payout account, a tax form and an identity submission are legal
acts. So is anything that agrees to fees.

**He has other projects in these consoles.** Post Array is new. Any existing
organization, project or product you find belongs to something else, and
editing one because it looked close enough is the single worst outcome
available here.

Therefore:

- Steps marked **STOP** must not be completed by you. Prepare everything up to
  that point, then ask him to do the final action while you watch. Do not
  submit on his behalf, even when the form is already filled and the button is
  right there.
- Never delete anything. Never edit an existing organization, project or
  product. Create new.
- If a console does not look like this document describes, stop and ask. The
  consoles change; this document does not update itself. Do not improvise a
  path that looks equivalent.
- Never invent a value. A guessed URL or a placeholder secret fails in a way
  that looks like a code bug and costs a day to trace back to here.

## Where the secrets go

You have repository access, so nothing needs to travel through chat.

Write the values into `.env` in the repository root as you collect them:

```bash
cp .env.example .env   # only if .env does not exist yet; never overwrite it
```

`.env` is git-ignored (`.gitignore` line 15) and `.env.example` is the only
env file that is committed. Fill in the real values in `.env`, and leave
`.env.example` exactly as it is: it is the documented template, and putting a
real secret in it publishes that secret.

Before you finish, confirm you have not staged it:

```bash
git status --porcelain | grep -E '(^|\s)\.env$' && echo "STOP: .env is staged"
```

That command should print nothing.

---

## Part 1: Neon

The project already exists and its schema is already migrated through
`0078_channel_allowance_by_entitlement.sql`. You are promoting it to a
production posture and switching on two Neon features the application is
already written against.

Project console: <https://console.neon.tech/app/projects/bitter-resonance-28128022>

### 1.1 A production branch

Create a branch named `production` from the current default branch, and enable
history retention (point-in-time restore) on it. Seven days is enough.

The reason for a separate branch is that development work will keep churning
the default branch, and customer data must not live where somebody resets a
table to try something.

Collect **both** connection strings for the `production` branch:

| Variable | Which string |
| --- | --- |
| `DATABASE_URL` | the **pooled** connection string |
| `DIRECT_DATABASE_URL` | the **direct**, non-pooled string |

These are different URLs and both are required. Migrations run over the direct
connection because a pooler cannot hold the advisory locks the capacity guards
take; the application runs over the pooled one. Swapping them produces
migration failures that read like database corruption.

### 1.2 Neon Auth

Enable Neon Auth on the `production` branch.

Do not substitute Clerk, Auth0 or Supabase Auth. The application's identity
provider is already implemented against Neon Auth
(`apps/api/src/modules/auth/neon-identity.provider.ts`), and swapping providers
is engineering work, not configuration.

Collect:

| Variable | Where it comes from |
| --- | --- |
| `NEON_AUTH_BASE_URL` | the auth API base URL Neon displays |
| `NEON_AUTH_JWKS_URL` | the JWKS endpoint URL Neon displays |

Generate the third yourself, and do not reuse a secret from anywhere else:

```bash
openssl rand -base64 32
```

That value is `NEON_AUTH_COOKIE_SECRET`. It signs session cookies, so a value
shared with another system means a compromise there is a compromise here.

### 1.3 Google sign-in

We want "Continue with Google" beside email sign-in.

1. In Neon Auth, enable Google as a social provider. Copy the **exact redirect
   URI** Neon displays. Do not construct one that looks right.
2. In Google Cloud Console, under the founder's account:
   - APIs & Services → Credentials → Create credentials → OAuth client ID
   - Application type: **Web application**, name: `Post Array`
   - Authorized redirect URI: the URI you copied from Neon, character for
     character
   - Configure the OAuth consent screen: app name `Post Array`, support email,
     and the `postarray.com` homepage and privacy policy links
3. Paste the resulting client ID and client secret back into Neon Auth.

**STOP** before submitting the consent screen for Google verification. That
submission is reviewed by Google against a real business identity and is the
founder's to make.

Report the redirect URI you used. It is the value most likely to be subtly
wrong, and the failure it produces (`redirect_uri_mismatch`) says nothing
useful about which side is wrong.

### 1.4 Media storage

Any S3-compatible bucket works. Prefer **Cloudflare R2**: this product serves
user-uploaded images and video, and R2 charges no egress.

Create the bucket and an access key scoped to that one bucket. Collect:

| Variable | Value |
| --- | --- |
| `NEON_STORAGE_ENDPOINT` | the S3 API endpoint URL |
| `NEON_STORAGE_REGION` | `auto` for R2 |
| `NEON_STORAGE_BUCKET` | the bucket name |
| `NEON_STORAGE_ACCESS_KEY_ID` | |
| `NEON_STORAGE_SECRET_ACCESS_KEY` | |

The variable names say `NEON_` for historical reasons and any S3-compatible
provider satisfies them. Do not rename them; the configuration schema in
`packages/config/src/schema.ts` reads these exact names.

Do **not** configure a provider-side lifecycle rule. The application deletes
media thirty days after upload and tells users so; a bucket rule deleting
sooner would break scheduled posts whose media vanished early, and the app
would have no idea why.

---

## Part 2: Polar

Polar is the merchant of record: it takes the money, handles tax, and tells us
who is entitled to what.

**Create a new organization.** The founder has other projects in Polar. Do not
add products to an existing organization.

**Production only.** Do not create sandbox products, and ignore any default
that points at sandbox.

### 2.1 The organization

Name: `Post Array`. Website: `https://postarray.com`.

**STOP.** Creating the organization requires identity verification, tax
details and payout bank details. Prepare the form, then hand it to the founder.
Ask him to either complete it and add you as a member afterwards, or to
complete the identity and payout steps while you drive the rest.

### 2.2 Six products

Three tiers, each sold monthly and annually. All prices USD, recurring.

| Product | Price | What the tier buys |
| --- | --- | --- |
| Standard, monthly | $25 | 3 active projects |
| Standard, annual | $250 | 3 active projects |
| Growth, monthly | $50 | 10 active projects |
| Growth, annual | $500 | 10 active projects |
| Studio, monthly | $100 | 25 active projects |
| Studio, annual | $1,000 | 25 active projects |

Every annual price is exactly ten times the monthly one. That is deliberate:
a year costs ten months, so the saving is exactly two months on every tier,
and the offer is one sentence rather than three different discounts. It is not
a typo to correct.

A tier buys active project capacity and nothing else. Every feature is included
on every tier, so product descriptions must not imply a feature gate.

> **Configure no trial period on any product. Zero days.**
>
> If Polar offers a trial field, leave it off. This product does not sell a
> trial: signing up is free, collects no card, and includes a small number of
> published posts. A checkout that announces a trial would contradict every
> page on the site, and the app would then be describing terms the customer was
> not actually given.
>
> If you cannot find a way to disable it, **STOP** and ask before creating the
> product.

Collect all six ids, labelled unambiguously:

```
POLAR_MONTHLY_PRODUCT_ID          = Standard monthly
POLAR_ANNUAL_PRODUCT_ID           = Standard annual
POLAR_GROWTH_MONTHLY_PRODUCT_ID   = Growth monthly
POLAR_GROWTH_ANNUAL_PRODUCT_ID    = Growth annual
POLAR_STUDIO_MONTHLY_PRODUCT_ID   = Studio monthly
POLAR_STUDIO_ANNUAL_PRODUCT_ID    = Studio annual
```

Nothing downstream can tell a monthly id from an annual one by looking at it.
If two are swapped, customers are charged the wrong amount and the first person
to notice is the one who was overcharged.

A tier's buy button appears only once both of its ids are configured, so a tier
you cannot finish today simply stays unbuyable rather than breaking the page.

### 2.3 Access token

Create an organization access token that can create checkouts and read
subscriptions. Collect it as `POLAR_ACCESS_TOKEN`, and set
`POLAR_SERVER=production`.

### 2.4 Webhook

Add a webhook endpoint:

```
https://api.postarray.com/v1/webhooks/polar
```

That exact path (`apps/api/src/modules/billing/billing.controller.ts`). If the
API domain is not live yet, create the webhook anyway with this URL and say so
in your report; delivery gets confirmed after the first deploy.

Subscribe to every subscription event (created, updated, active, canceled,
revoked, uncanceled) and to checkout events if they are offered.

Collect the signing secret as `POLAR_WEBHOOK_SECRET`.

This secret is the whole of our trust in Polar's messages. Entitlements are
granted **only** from a verified webhook and never from the browser redirect
that follows checkout, which means a wrong secret produces the worst failure
mode available: customers pay and receive nothing.

### 2.5 Leave checkout switched off

Leave `BILLING_CHECKOUT_ENABLED=false`.

Engineering flips it after verifying the products and a test webhook delivery.
`scripts/release-check.js` fails the release if it is true before the rest is
verified, so setting it early does not help anybody.

---

## Report back

Confirm in writing:

1. `.env` is filled in and **not** staged for commit.
2. Google sign-in shows as enabled in Neon Auth, and the exact redirect URI you
   used.
3. Which storage provider you chose.
4. That all six Polar products carry **no trial period**.
5. Whether the Polar webhook shows as active or is waiting on the API domain.
6. Anything you could not finish, and what stopped you. A step honestly
   reported as incomplete costs an hour. A step reported as done that was
   guessed at costs a day, and gets found on launch day.
