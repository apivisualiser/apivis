import { type OpenAPIObject, OpenApiBuilder, type ReferenceObject, type ParameterObject } from 'openapi3-ts/oas30';
import { currentConnection } from '../stores';
import type { Readable } from 'svelte/store';
import { getConnection } from '../utility/localdb';
import SwaggerClient from 'swagger-client';
import { filterName } from '../utility/filterName';

const apiDocCache = new Map<string, OpenAPIObject>();

export async function loadOpenApiDocument(url: string): Promise<OpenAPIObject> {
  const cached = apiDocCache.get(url);
  if (cached) {
    return cached;
  }
  try {
    const resp = await fetch(url);
    const json = await resp.json();
    const resolved = (await SwaggerClient.resolve({ spec: json })).spec;
    apiDocCache.set(url, resolved);
    return resolved;
  } catch (e) {
    console.error(e);
    throw new Error(`Failed to load OpenAPI document from ${url}`);
  }

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

export async function getApiInfo(conid: string): Promise<OpenAPIObject> {
  const connection = await getConnection(conid);
  return loadOpenApiDocument(connection!.openApiUrl);
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
