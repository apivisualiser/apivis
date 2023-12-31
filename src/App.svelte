<script>
  import { onMount } from 'svelte';
  import Screen from './Screen.svelte';
  import { setAppLoaded } from './utility/appLoadManager';

  onMount(() => {
    setAppLoaded();
  });
</script>

<Screen />
