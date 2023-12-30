<script lang="ts">
  import _ from 'lodash';
  import { useCurrentApiInfo } from '../openapi/openapidoc';
  import WidgetsInnerContainer from './WidgetsInnerContainer.svelte';
  import EndpointAppObject from '../appobj/EndpointAppObject.svelte';

  const apiInfo = useCurrentApiInfo();
  $: paths = $apiInfo?.paths || {};
</script>

<WidgetsInnerContainer>
  {#each _.keys(paths) as path}
    <EndpointAppObject path={path} apiInfo={$apiInfo} />
  {/each}
</WidgetsInnerContainer>
