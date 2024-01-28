export function getDatabaseFileLabel(databaseFile) {
  if (!databaseFile) return databaseFile;
  const m = databaseFile.match(/[\/]([^\/]+)$/);
  if (m) return m[1];
  return databaseFile;
}

export default function getConnectionLabel(connection, { allowExplicitDatabase = true } = {}) {
  if (!connection) {
    return null;
  }
  if (connection.displayName) {
    return connection.displayName;
  }
  if (connection.openApiUrl) {
    const r = /\:\/\/([^/]+)/;

    const m = connection.openApiUrl.match(r);
    if (m) {
      return m[1];
    }
    return connection.openApiUrl;
  }

  return '';
}

export function getEndpointLabel(path: string) {
  if (!path) return path;
  const m = path.match(/\/([^\/\{\}]+)\/?$|\/([^\/]+\/\{[^\/]+\})\/?$/);
  if (m) return m[1] || m[2];
  return path;
}
