import Dexie, { type Table } from "dexie";
import { liveQuery } from "dexie";
import type { ConnectionInfo, TabDefinition } from "./types";

class ApiVisDb extends Dexie {
  public connections!: Table<ConnectionInfo, string>;
  // public tabs!: Table<TabDefinition, string>;

  public constructor() {
    super("apivis");

    this.version(1).stores({
      connections: "id",
      // tabs: "tabid",
    });
  }
}

const localDb = new ApiVisDb();

export function useConnectionList() {
  return liveQuery(() => localDb.connections.toArray());
}

export function useConnectionInfo({ conid }) {
  return liveQuery(() => localDb.connections.get(conid));
}

export function getConnection(conid: string) {
  return localDb.connections.get(conid);
}

export async function saveConnection(conn: ConnectionInfo) {
  await localDb.connections.put(conn);
}

export async function deleteConnection(conid: string) {
  await localDb.connections.delete(conid);
}

// export function useTabs() {
//   return liveQuery(() => localDb.tabs.toArray());
// }
