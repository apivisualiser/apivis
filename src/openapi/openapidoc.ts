import { type OpenAPIObject, OpenApiBuilder } from 'openapi3-ts/oas30';
import { currentConnection } from '../stores';
import type { Readable } from 'svelte/store';

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
    subscribe: (callback) => {
      return currentConnection.subscribe(connection => {
        if (connection) {
          loadOpenApiDocument(connection.openApiUrl).then(callback);
        }
      });
    }
  }
  // currentConnection.
}
