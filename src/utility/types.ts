import type { OpenAPIObject } from "openapi3-ts/oas30";

export interface ConnectionInfo {
  id: string;
  openApiUrl: string;
  displayName?: string;
}

export interface TabDefinition {
  title: string;
  closedTime?: number;
  icon: string;
  props: any;
  selected: boolean;
  busy: boolean;
  tabid: string;
  tabComponent: string;
  tabOrder?: number;
  multiTabIndex?: number;
  unsaved?: boolean;
}

export interface OpenedConnection {
  connection: ConnectionInfo;
  apidoc: OpenAPIObject;
  apidocLoaded: Date;
}
