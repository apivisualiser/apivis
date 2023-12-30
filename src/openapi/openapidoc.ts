import { type OpenAPIObject, OpenApiBuilder, type ReferenceObject, type ParameterObject } from 'openapi3-ts/oas30';
import { currentConnection } from '../stores';
import type { Readable } from 'svelte/store';
import { getConnection } from '../utility/localdb';

const apiDocCache = new Map<string, OpenAPIObject>();

export class ApiDocEndpoint {
  constructor(public apiDoc: OpenAPIObject, public path: string, public method: string) {}

  get tags(): string[] {
    const tags = this.apiDoc.paths[this.path][this.method].tags;
    return tags || [];
  }
}

class ApiDocTag {
  endPoints: ApiDocEndpoint[] = [];
  constructor(public name: string) {}
}

export class ApiDocProvider {
  endPoints: ApiDocEndpoint[] = [];
  tags: ApiDocTag[] = [];

  constructor(public apiDoc: OpenAPIObject) {
    if (!this.apiDoc) {
      return;
    }
    this.parse();
  }

  parse() {
    const paths = this.apiDoc.paths;
    for (const path in paths) {
      const methods = paths[path];
      for (const method in methods) {
        const endpoint = new ApiDocEndpoint(this.apiDoc, path, method);
        this.endPoints.push(endpoint);
        for (const tag of endpoint.tags) {
          const tagObj = this.getTag(tag);
          tagObj.endPoints.push(endpoint);
        }
      }
    }
  }

  getTag(name: string): ApiDocTag {
    const tag = this.tags.find(tag => tag.name === name);
    if (tag) {
      return tag;
    }
    const newTag = new ApiDocTag(name);
    this.tags.push(newTag);
    return newTag;
  }
}

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
