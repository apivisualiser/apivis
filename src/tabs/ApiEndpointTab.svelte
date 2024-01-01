<script lang="ts" context="module">
  export const matchingProps = ['conid', 'path', 'method'];

  const getCurrentEditor = () => getActiveComponent('ApiEndpointTab');

  registerCommand({
    id: 'endpoint.send',
    category: 'Endpoint',
    icon: 'icon send',
    name: 'Send',
    keyText: 'F5',
    toolbar: true,
    isRelatedToTab: true,
    testEnabled: () => getCurrentEditor() != null,
    onClick: () => getCurrentEditor().send(),
  });
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
  import useEditorData from '../utility/useEditorData';
  import ToolStripContainer from '../buttons/ToolStripContainer.svelte';
  import ToolStripCommandButton from '../buttons/ToolStripCommandButton.svelte';
  import createActivator, { getActiveComponent } from '../utility/createActivator';
  import registerCommand from '../commands/registerCommand';
  import { extractAllArrays } from '../utility/common';
  import { sendApiRequest, type ApiRequestResponse } from '../openapi/sendApiRequest';
  import FontIcon from '../icons/FontIcon.svelte';
  import LoadingInfo from '../elements/LoadingInfo.svelte';
  import TextAreaField from '../forms/TextAreaField.svelte';
  import AceEditor from '../elements/AceEditor.svelte';
  import Link from '../elements/Link.svelte';
  import Pager from '../elements/Pager.svelte';
  import InfoMessage from '../elements/InfoMessage.svelte';

  export let tabid;
  export let path: string;
  export let conid: string;
  export let method: string;

  let isSending = false;

  export const activator = createActivator('ApiEndpointTab', true);

  let resp: ApiRequestResponse | null = null;
  $: allArrays = extractAllArrays(resp?.json);

  const values = writable<Record<string, string>>({});

  const apiInfo = useApiInfo(conid);
  $: endpoint = $apiInfo?.paths?.[path]?.[method];

  const { setEditorData } = useEditorData({
    tabid,
    onInitialData: value => {
      $values = value;
    },
  });

  values.subscribe(value => {
    setEditorData(value);
  });

  export async function send() {
    resp = null;
    isSending = true;
    resp = await sendApiRequest(conid, path, $values, method);
    isSending = false;
  }

  function handleFillFromSpec() {
    const requestBody = $apiInfo?.paths[path]?.[method]?.requestBody;
    if (requestBody) {
      let sampleRequestBody = requestBody.content['application/json'].schema.example;
      if (!sampleRequestBody) {
        sampleRequestBody = {};
        const properties = requestBody.content['application/json'].schema.properties;
        for (const prop in properties) {
          switch (properties[prop].type) {
            case 'string':
              sampleRequestBody[prop] = 'string';
              break;
            case 'integer':
              sampleRequestBody[prop] = 0;
              break;
            case 'boolean':
              sampleRequestBody[prop] = false;
              break;
            case 'array':
              sampleRequestBody[prop] = [];
              break;
            case 'object':
              sampleRequestBody[prop] = {};
              break;
          }
        }
      }
      values.update(x => ({ ...x, $requestBody: JSON.stringify(sampleRequestBody, null, 2) }));
    }
  }

  $: console.log($apiInfo?.paths[path]?.[method]?.requestBody);
</script>

<ToolStripContainer>
  <FormProviderCore template={FormFieldTemplateLarge} {values}>
    <div class="flex-container">
      <div>
        {#each filterParameterObjects($apiInfo?.paths[path]?.[method]?.parameters ?? []) as param}
          <FormTextField name={param.name} label={param.name} required={param.required} />
        {/each}
        {#if $apiInfo?.paths[path]?.[method]?.requestBody}
          <div class="label">Request body (<Link onClick={handleFillFromSpec}>fill from spec</Link>)</div>
          <div class="editor">
            <AceEditor
              mode="json"
              value={$values.$requestBody}
              on:input={e => {
                values.update(x => ({ ...x, $requestBody: e.detail }));
              }}
            />
          </div>
        {/if}
      </div>

      {#if resp}
        <TabControl
          tabs={[
            resp?.json && { label: 'JSON', slot: 1 },
            ..._.keys(allArrays).map(key => ({
              label: `${key} (${allArrays[key].length})`,
              slot: 2,
              props: { rows: allArrays[key] },
            })),
            resp?.html && { label: 'HTML', slot: 3 },
            resp?.text && { label: 'Text', slot: 4 },
            resp?.error && { label: 'Error', slot: 5 },
          ]}
        >
          <svelte:fragment slot="1">
            <div class="scroll-container">
              <JSONTree value={resp?.json} expanded />
            </div>
          </svelte:fragment>

          <svelte:fragment slot="2" let:rows>
            <DataGrid {rows} />
          </svelte:fragment>

          <svelte:fragment slot="3">
            <div class="scroll-container">
              {@html resp?.html}
            </div>
          </svelte:fragment>

          <svelte:fragment slot="4">
            <div class="scroll-container">
              <pre>
{resp?.text}
</pre>
            </div>
          </svelte:fragment>

          <svelte:fragment slot="5">
            <div class="scroll-container">
              <pre>
{resp?.error}
</pre>
            </div>
          </svelte:fragment>
        </TabControl>
      {:else if isSending}
        <LoadingInfo message="Sending request..." />
      {:else}
        <InfoMessage message="Please use 'Send' button for sending request to API" />
      {/if}
    </div>
  </FormProviderCore>

  <svelte:fragment slot="toolstrip">
    <ToolStripCommandButton command="endpoint.send" />
  </svelte:fragment>
</ToolStripContainer>

<style>
  .scroll-container {
    overflow: scroll;
  }

  .flex-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .editor {
    height: 30vh;
    display: flex;
    position: relative;
    margin: var(--dim-large-form-margin);
    margin-top: 3px;
  }

  .label {
    margin-left: var(--dim-large-form-margin);
    color: var(--theme-font-3);
  }
</style>
