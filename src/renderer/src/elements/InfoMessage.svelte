<script lang="ts">
  import FontIcon from '../icons/FontIcon.svelte';

  export let message: string;
</script>

<div class="m-4 flex info-container">
  <span class="info-icon mr-2"><FontIcon icon="img info" /></span>
  {message}
</div>

<style>
  .info-icon {
    font-size: 34px;
  }

  .info-container {
    align-items: center;
  }
</style>
