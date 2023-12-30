import { type OpenAPIObject, OpenApiBuilder, type ReferenceObject, type ParameterObject } from 'openapi3-ts/oas30';
import { currentConnection } from '../stores';
import type { Readable } from 'svelte/store';
import { getConnection } from '../utility/localdb';

const apiDocCache = new Map<string, OpenAPIObject>();

export async function loadOpenApiDocument(url: string): Promise<OpenAPIObject> {
  const cached = apiDocCache.get(url);
  if (cached) {
    return cached;
  }
  const resp = await fetch(url);
  const json = await resp.json();
  apiDocCache.set(url, json);
  return json;

  // return fetch(url)
  //   .then(response => response.json())
  //   .then(json => json as OpenAPIObject);
}

export function useCurrentApiInfo(): Readable<OpenAPIObject> {
  return {
    subscribe: callback => {
      return currentConnection.subscribe(connection => {
        if (connection) {
          loadOpenApiDocument(connection.openApiUrl).then(callback);
        }
      });
    },
  };
}

export function useApiInfo(conid: string): Readable<OpenAPIObject> {
  return {
    subscribe: callback => {
      getConnection(conid).then(connection => {
        if (connection) {
          loadOpenApiDocument(connection.openApiUrl).then(callback);
        }
      });
      return () => {};
    },
  };
}

export function isParameterObject(obj: ReferenceObject | ParameterObject): obj is ParameterObject {
  return !!(obj as ParameterObject).name;
}

export function filterParameterObjects(parameters: Array<ReferenceObject | ParameterObject>): ParameterObject[] {
  return parameters.filter(isParameterObject);
}
