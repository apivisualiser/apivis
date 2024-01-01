<script lang="ts">
  import _ from 'lodash';
  import DataGridCell from './DataGridCell.svelte';
  import InfoMessage from '../elements/InfoMessage.svelte';

  export let rows: any;

  // function extractTopmostRows(data) {
  //   if (_.isArray(data)) {
  //     return data;
  //   }
  //   if (_.isPlainObject(data)) {
  //     for (const key in data) {
  //       if (_.isArray(data[key])) {
  //         return data[key];
  //       }
  //     }
  //   }
  //   return [];
  // }

  // $: topmostRows = extractTopmostRows(data);
  $: columns = _.uniq(_.flatMap(rows, Object.keys));
</script>

{#if rows.length === 0}
  <div>
    <InfoMessage message="No rows" />
  </div>
{:else}
  <div class="wrapper">
    <table>
      <thead>
        <tr>
          <th></th>
          {#each columns as key}
            <th>{key}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each rows as row, index}
          <tr>
            <td>{index + 1}</td>
            {#each columns as key}
              <DataGridCell rowData={row} value={row[key]} />
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<style>
  .wrapper {
    overflow: scroll;
    flex: 1;
  }

  table {
    overflow: scroll;
    outline: none;

    border-collapse: separate; /* Don't collapse */
    border-spacing: 0;
  }

  table thead {
    position: sticky;
    top: 0;
    z-index: 100;
  }

  thead :global(tr:first-child) :global(th) {
    border-top: 1px solid var(--theme-border);
  }

  th,
  td {
    /* border: 1px solid var(--theme-border); */
    text-align: left;
    padding: 2px;
    margin: 0;
    background-color: var(--theme-bg-1);
    overflow: hidden;
    vertical-align: center;
    z-index: 100;

    border-bottom: 1px solid var(--theme-border);
    border-right: 1px solid var(--theme-border);
  }

  th {
    font-weight: bold;
  }
</style>
