import Dexie, { type Table } from "dexie";
import { liveQuery } from "dexie";

export interface ConnectionInfo {
  id: string;
  url: string;
}

class ApiManDb extends Dexie {
  public connections!: Table<ConnectionInfo, string>;

  public constructor() {
    super("apiman");

    this.version(1).stores({
      connections: "id",
    });
  }
}

const localDb = new ApiManDb();

export function useConnectionList() {
  return liveQuery(() => localDb.connections.toArray());
}

export function useConnectionInfo({ conid }) {
  return liveQuery(() => localDb.connections.get(conid));
}

export async function saveConnection(conn: ConnectionInfo) {
  await localDb.connections.put(conn);
}
