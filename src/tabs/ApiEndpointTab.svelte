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
  import TabControl from '../elements/TabControl.svelte';
  import DataGrid from '../datagrid/DataGrid.svelte';
  import _ from 'lodash';

  export let path: string;
  export let conid: string;
  export let method: string;

  let json;
  $: allArrays = extractAllArrays(json);

  const values = writable<Record<string, string>>({});

  const apiInfo = useApiInfo(conid);
  $: endpoint = $apiInfo?.paths?.[path]?.[method];

  async function handleSend() {
    const connection = await getConnection(conid);
    const params = new URLSearchParams();

    let pathReplaced = path;

    for (const param of endpoint?.parameters ?? []) {
      if (isParameterObject(param)) {
        if (param.in === 'query' && $values[param.name] != null) {
          params.append(param.name, $values[param.name]);
        }
        if (param.in === 'path') {
          pathReplaced = pathReplaced.replace(`{${param.name}}`, $values[param.name]);
        }
      }
    }

    let url: URL;
    if (path.includes('://')) {
      url = new URL(pathReplaced);
    } else {
      url = new URL(connection?.openApiUrl!);
      url.pathname = pathReplaced;
    }

    url.search = params.toString();
    const resp = await fetch(url.toString());
    json = await resp.json();
  }

  function extractAllArrays(data, parentKey?): Record<string, any[]> {
    if (_.isArray(data)) {
      return { [parentKey ?? 'Rows']: data };
    }
    if (_.isPlainObject(data)) {
      let result: Record<string, any[]> = {};
      for (const key in data) {
        result = { ...result, ...extractAllArrays(data[key], key) };
      }
      return result;
    }
    return {};
  }
</script>

<FormProviderCore template={FormFieldTemplateLarge} {values}>
  <div class="flex-container">
    <div>
      <div>
        {#each filterParameterObjects($apiInfo?.paths[path]?.[method]?.parameters ?? []) as param}
          <FormTextField name={param.name} label={param.name} required={param.required} />
        {/each}
      </div>

      <div class="buttons">
        <FormButton value="Send" on:click={handleSend} />
      </div>
    </div>

    <TabControl
      tabs={[
        { label: 'JSON', slot: 1 },
        ..._.keys(allArrays).map(key => ({ label: key, slot: 2, props: { rows: allArrays[key] } })),
        // { label: 'Data grid', slot: 2 },
      ]}
    >
      <svelte:fragment slot="1">
        {#if json}
          <div class="json-container">
            <JSONTree value={json} expanded />
          </div>
        {/if}
      </svelte:fragment>

      <svelte:fragment slot="2" let:rows>
        {#if json}
          <DataGrid {rows} />
        {/if}
      </svelte:fragment>
    </TabControl>
  </div>
</FormProviderCore>

<style>
  .buttons {
    flex-shrink: 0;
    margin: var(--dim-large-form-margin);
  }

  .json-container {
    overflow: scroll;
  }

  .flex-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
