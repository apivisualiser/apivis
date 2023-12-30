<script lang="ts">
  import type { OpenAPIObject, PathItemObject } from 'openapi3-ts/oas30';
  import AppObjectCore from './AppObjectCore.svelte';
  import openNewTab from '../utility/openNewTab';

  export let path: string;
  export let apiInfo: OpenAPIObject;
  export let conid;

  function handleClick() {
    openNewTab({
      title: path,
      icon: 'img shell',
      tabComponent: 'ApiEndpointTab',
      props: {
        path,
        conid,
      }
    });
  }
</script>

<AppObjectCore title={path} on:click={handleClick} />
