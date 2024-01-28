<script lang="ts">
  import CellValue from './CellValue.svelte';

  export let rowData: any;
  export let value: any;

  let domCell;
</script>

<td
  bind:this={domCell}
  on:click={() => {
    // const range = document.createRange();
    // range.selectNode(domCell);
    // window.getSelection()?.removeAllRanges();
    // window.getSelection()?.addRange(range);
  }}
>
  <CellValue {rowData} {value} />
</td>

<style>
  td {
    font-weight: normal;
    /* border: 1px solid var(--theme-border); */
    background-color: var(--theme-bg-0);
    padding: 2px;
    position: relative;
    overflow: hidden;
    vertical-align: top;
    border-bottom: 1px solid var(--theme-border);
    border-right: 1px solid var(--theme-border);
  }
</style>
