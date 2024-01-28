<script>
  import { onMount } from 'svelte';
  import Screen from './Screen.svelte';
  import { setAppLoaded } from './utility/appLoadManager';
  import CommandListener from './commands/CommandListener.svelte';

  onMount(() => {
    setAppLoaded();
  });
</script>

<CommandListener />
<Screen />
