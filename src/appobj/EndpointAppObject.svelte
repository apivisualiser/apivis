<script lang="ts">
  import type { OpenAPIObject, PathItemObject } from 'openapi3-ts/oas30';
  import AppObjectCore from './AppObjectCore.svelte';
  import openNewTab from '../utility/openNewTab';
  import type { ApiDocEndpoint } from '../openapi/openapidoc';
  import getConnectionLabel from '../utility/getConnectionLabel';
  import { getConnection } from '../utility/localdb';

  export let endpoint: ApiDocEndpoint;
  export let apiInfo: OpenAPIObject;
  export let conid;

  async function handleClick() {
    const connection = await getConnection(conid);
    openNewTab({
      title: endpoint.path,
      icon: 'mtd ' + endpoint.method,
      tabComponent: 'ApiEndpointTab',
      props: {
        path: endpoint.path,
        method: endpoint.method,
        conid,
      },
    });
  }
</script>

<AppObjectCore title={endpoint.path} on:click={handleClick} icon={'mtd ' + endpoint.method} />
