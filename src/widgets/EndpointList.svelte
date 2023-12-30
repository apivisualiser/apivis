<script lang="ts">
  import _ from 'lodash';
  import { ApiDocProvider, useCurrentApiInfo } from '../openapi/openapidoc';
  import WidgetsInnerContainer from './WidgetsInnerContainer.svelte';
  import EndpointAppObject from '../appobj/EndpointAppObject.svelte';
  import { currentConnection } from '../stores';
  import AppObjectGroup from '../appobj/AppObjectGroup.svelte';

  const apiInfo = useCurrentApiInfo();
  // $: paths = $apiInfo?.paths || {};
  $: provider = new ApiDocProvider($apiInfo);
</script>

<WidgetsInnerContainer>
  {#each provider.tags as tag}
    <AppObjectGroup title={tag.name}>
      {#each tag.endPoints as endpoint}
        <EndpointAppObject endpoint={endpoint} apiInfo={$apiInfo} conid={$currentConnection?.id} />
      {/each}
    </AppObjectGroup>
  {/each}
</WidgetsInnerContainer>
