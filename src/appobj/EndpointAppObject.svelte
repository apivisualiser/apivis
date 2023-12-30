<script lang="ts">
  import type { OpenAPIObject, PathItemObject } from 'openapi3-ts/oas30';
  import AppObjectCore from './AppObjectCore.svelte';

  export let path: string;
  export let apiInfo: OpenAPIObject;
</script>

<AppObjectCore title={path} />
