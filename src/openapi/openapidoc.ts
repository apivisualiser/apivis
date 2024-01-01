import { type OpenAPIObject, OpenApiBuilder, type ReferenceObject, type ParameterObject } from 'openapi3-ts/oas30';
import { currentConnection, getOpenedConnections, openedConnections } from '../stores';
import { derived, type Readable } from 'svelte/store';
import { getConnection, useConnectionList } from '../utility/localdb';
import SwaggerClient from 'swagger-client';
import { filterName } from '../utility/filterName';
import type { ConnectionInfo, OpenedConnection } from '../utility/types';
import { get } from 'lodash';

export async function loadOpenApiDocument(url: string): Promise<OpenAPIObject> {
  const resp = await fetch(url);
  const json = await resp.json();
  const resolved = (await SwaggerClient.resolve({ spec: json })).spec;
  return resolved;
}

function updateConnectionFields(conid: string, fields: Partial<OpenedConnection>) {
  openedConnections.update(connections => {
    const connection = connections[conid];
    if (!connection) {
      return connections;
    }
    return {
      ...connections,
      [conid]: {
        ...connection,
        ...fields,
      },
    };
  });
}

const loadingConnections = new Set<string>();

export async function triggerConnectionLoad(conid: string) {
  if (loadingConnections.has(conid)) {
    return;
  }
  loadingConnections.add(conid);
  updateConnectionFields(conid, {
    status: 'pending',
    errorMessage: undefined,
  });
  const connection = await getConnection(conid);
  try {
    const document = await loadOpenApiDocument(connection!.openApiUrl);
    updateConnectionFields(conid, {
      status: 'connected',
      apidoc: document,
      apidocLoaded: new Date(),
    });
  } catch (e: any) {
    updateConnectionFields(conid, {
      status: 'error',
      errorMessage: e.message,
    });
  }
  loadingConnections.delete(conid);
}

export function triggerAllConnectionsLoad() {
  for (const conid in getOpenedConnections()) {
    triggerConnectionLoad(conid);
  }
}

export function useApiInfo(conid: string): Readable<OpenAPIObject | undefined> {
  return derived(
    [openedConnections, useConnectionList() as any as Readable<ConnectionInfo[]>],
    ([$openedConnections, connectionList]) => {
      const openedConnection = $openedConnections[conid];
      if (!openedConnection) {
        const connection = connectionList.find(c => c.id === conid);
        if (connection) {
          openAndLoadConnection(conid, connection);
        }
      }
      return openedConnection?.apidoc;
      // if (connection) {
      //   return loadOpenApiDocument(connection.openApiUrl);
      // }
    }
  );
  // return {
  //   subscribe: callback => {
  //     getConnection(conid).then(connection => {
  //       if (connection) {
  //         loadOpenApiDocument(connection.openApiUrl).then(callback);
  //       }
  //     });
  //     return () => {};
  //   },
  // };
}

function openAndLoadConnection(conid: string, connection: ConnectionInfo) {
  openedConnections.update(connections => {
    setTimeout(() => {
      triggerConnectionLoad(conid);
    }, 0);
    return {
      ...connections,
      [conid]: {
        connection,
        status: 'pending',
      },
    };
  });
}

// export function useCurrentApiInfo(): Readable<OpenAPIObject> {
//   return {
//     subscribe: callback => {
//       return currentConnection.subscribe(connection => {
//         if (connection) {
//           loadOpenApiDocument(connection.openApiUrl).then(callback);
//         }
//       });
//     },
//   };
// }

export function useCurrentApiInfo(): Readable<OpenAPIObject | undefined> {
  return derived([currentConnection, openedConnections], ([$currentConnection, $openedConnections]) => {
    const opened = $openedConnections[$currentConnection?.id!];
    if (!opened) {
      openAndLoadConnection($currentConnection?.id!, $currentConnection!);
    }
    return opened?.apidoc;
  });
}

export async function getApiInfo(conid: string): Promise<OpenAPIObject | undefined> {
  const openedConnections = getOpenedConnections();
  const openedConnection = openedConnections[conid];
  return openedConnection.apidoc;
}

// export function useApiInfo(conid: string): Readable<OpenAPIObject> {
//   return {
//     subscribe: callback => {
//       getConnection(conid).then(connection => {
//         if (connection) {
//           loadOpenApiDocument(connection.openApiUrl).then(callback);
//         }
//       });
//       return () => {};
//     },
//   };
// }

export function isParameterObject(obj: ReferenceObject | ParameterObject): obj is ParameterObject {
  return !!(obj as ParameterObject).name;
}

export function filterParameterObjects(parameters: Array<ReferenceObject | ParameterObject>): ParameterObject[] {
  return parameters.filter(isParameterObject);
}
