<script lang="ts">
  import _ from 'lodash';
  import { triggerConnectionLoad, useCurrentApiInfo } from '../openapi/openapidoc';
  import WidgetsInnerContainer from './WidgetsInnerContainer.svelte';
  import EndpointAppObject from '../appobj/EndpointAppObject.svelte';
  import { currentConnection } from '../stores';
  import AppObjectGroup from '../appobj/AppObjectGroup.svelte';
  import SearchBoxWrapper from '../elements/SearchBoxWrapper.svelte';
  import SearchInput from '../elements/SearchInput.svelte';
  import FontIcon from '../icons/FontIcon.svelte';
  import InlineButton from '../buttons/InlineButton.svelte';
  import CloseSearchButton from '../buttons/CloseSearchButton.svelte';
  import { ApiDocProvider } from '../openapi/apidocprovider';

  let filter = '';

  const apiInfo = useCurrentApiInfo();
  // $: paths = $apiInfo?.paths || {};
  $: provider = new ApiDocProvider($apiInfo).filter(filter);

  function handleRefreshConnection() {
    triggerConnectionLoad($currentConnection?.id!);
  }
</script>

<SearchBoxWrapper>
  <SearchInput placeholder="Search endpoint" bind:value={filter} />
  <CloseSearchButton bind:filter />
  <InlineButton on:click={handleRefreshConnection} title="Refresh endpoints">
    <FontIcon icon="icon refresh" />
  </InlineButton>
</SearchBoxWrapper>

<WidgetsInnerContainer>
  {#if $apiInfo}
    {#each provider.tags as tag}
      <AppObjectGroup title={tag.name}>
        {#each tag.endPoints as endpoint}
          <EndpointAppObject {endpoint} apiInfo={$apiInfo} conid={$currentConnection?.id} />
        {/each}
      </AppObjectGroup>
    {/each}
  {/if}
</WidgetsInnerContainer>
