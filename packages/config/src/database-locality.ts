/**
 * Is this database on the developer's own machine?
 *
 * The question matters because the runtime is allowed to fall back to a
 * scheduler that only records intent in memory. That is correct on a laptop
 * with no Temporal running, and catastrophic anywhere else: every scheduled
 * post is accepted, shown as scheduled, and never published, with no error
 * on any surface.
 *
 * `NODE_ENV` alone cannot answer it. A staging box, a preview deploy and a
 * production container run with `NODE_ENV` unset or set to something other
 * than `production` far too often for that to be the only guard. The database
 * a process is pointed at is a much better signal of whether real customer
 * data is in play, so the fallback is gated on both.
 *
 * Local means the loopback host or the docker-compose service name, and no
 * TLS requirement. Everything else, including every Neon host, is remote.
 */
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]', 'postgres', 'db']);

export function isLocalDatabaseUrl(url: string | undefined): boolean {
  if (url === undefined || url.trim() === '') {
    // No database is not a remote database. A process with nothing configured
    // is being started by a developer or a test, not serving customers.
    return true;
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    // An unparseable URL is not evidence of locality. Refuse to vouch for it.
    return false;
  }

  const host = parsed.hostname.toLowerCase();
  if (!LOCAL_HOSTS.has(host)) {
    return false;
  }

  const sslMode = parsed.searchParams.get('sslmode')?.toLowerCase();
  if (sslMode !== null && sslMode !== undefined && sslMode !== 'disable' && sslMode !== 'prefer') {
    // A loopback host that insists on TLS is almost always a tunnel to
    // something that is not loopback.
    return false;
  }

  return true;
}
