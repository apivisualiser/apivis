<script lang="ts">
  import FontIcon from '../icons/FontIcon.svelte';
  import { chevronExpandIcon, plusExpandIcon } from '../icons/expandIcons';

  export let title: string;

  let isExpanded = true;
</script>

<div class="group" on:click={() => (isExpanded = !isExpanded)}>
  <span class="expand-icon">
    <FontIcon icon={chevronExpandIcon(isExpanded)} />
  </span>

  {title}
</div>

{#if isExpanded}
  <slot />
{/if}

<style>
  .group {
    user-select: none;
    padding: 5px;
    cursor: pointer;
    white-space: nowrap;
    font-weight: bold;
  }

  .group:hover {
    background-color: var(--theme-bg-hover);
  }
  .expand-icon {
    margin-right: 3px;
  }
</style>
