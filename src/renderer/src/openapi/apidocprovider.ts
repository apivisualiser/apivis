import { type OpenAPIObject } from 'openapi3-ts/oas30';
import { filterName } from '../utility/filterName';

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

  constructor(public apiDoc?: OpenAPIObject) {
    if (!this.apiDoc) {
      return;
    }
    this.parse();
  }

  parse() {
    if (!this.apiDoc) {
      return;
    }
    const paths = this.apiDoc.paths;
    for (const path in paths) {
      const methods = paths[path];
      for (const method in methods) {
        const endpoint = new ApiDocEndpoint(this.apiDoc, path, method);
        this.endPoints.push(endpoint);
        if (endpoint.tags.length === 0) {
          const tagObj = this.getTag('default');
          tagObj.endPoints.push(endpoint);
        } else {
          for (const tag of endpoint.tags) {
            const tagObj = this.getTag(tag);
            tagObj.endPoints.push(endpoint);
          }
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

  filter(filter: string): ApiDocProvider {
    const newProvider = new ApiDocProvider(this.apiDoc);
    newProvider.endPoints = this.endPoints.filter(endpoint => {
      return filterName(filter, endpoint.path);
    });
    newProvider.tags = this.tags.filter(tag => {
      return filterName(filter, tag.name, ...tag.endPoints.map(endpoint => endpoint.path));
    });
    for (const tag of newProvider.tags) {
      tag.endPoints = tag.endPoints.filter(endpoint => {
        return filterName(filter, endpoint.path);
      });
    }
    return newProvider;
  }
}
