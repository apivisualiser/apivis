<script lang="ts" context="module">
  export const matchingProps = ['conid', 'path', 'method'];
</script>

<script lang="ts">
  import { writable } from 'svelte/store';
  import FormFieldTemplateLarge from '../forms/FormFieldTemplateLarge.svelte';
  import FormProviderCore from '../forms/FormProviderCore.svelte';
  import { filterParameterObjects, isParameterObject, useApiInfo } from '../openapi/openapidoc';
  import FormTextField from '../forms/FormTextField.svelte';
  import { isReferenceObject } from 'openapi3-ts/oas30';
  import { getConnection } from '../utility/localdb';
  import FormButton from '../forms/FormButton.svelte';
  import JSONTree from '../jsontree/JSONTree.svelte';

  export let path: string;
  export let conid: string;
  export let method: string;

  let json;

  const values = writable<Record<string, string>>({});

  const apiInfo = useApiInfo(conid);
  const endpoint = $apiInfo?.paths?.[path]?.[method];

  async function handleSend() {
    const connection = await getConnection(conid);
    let url: URL;
    if (path.includes('://')) {
      url = new URL(path);
    } else {
      url = new URL(connection?.openApiUrl!);
      url.pathname = path;
    }
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries($values)) {
      params.append(key, value);
    }
    url.search = params.toString();
    const resp = await fetch(url.toString());
    json = await resp.json();
  }
</script>

<FormProviderCore template={FormFieldTemplateLarge} {values}>
  <div>
    <div>
      {#each filterParameterObjects($apiInfo?.paths[path]?.[method]?.parameters ?? []) as param}
        <FormTextField name={param.name} label={param.name} required={param.required} />
      {/each}
    </div>

    <div>
      <FormButton value="Send" on:click={handleSend} />
    </div>

    <div>
      {#if json}
        <JSONTree value={json} expanded />
      {/if}
    </div>
  </div>
</FormProviderCore>
