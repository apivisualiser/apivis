<script lang="ts">
  import _ from 'lodash';

  export let data: any;

  function extractTopmostRows(data) {
    if (_.isArray(data)) {
      return data;
    }
    if (_.isPlainObject(data)) {
      for (const key in data) {
        if (_.isArray(data[key])) {
          return data[key];
        }
      }
    }
    return [];
  }

  $: topmostRows = extractTopmostRows(data);
</script>

<div class="wrapper">
  <table>
    <thead>
      <tr>
        {#each Object.keys(topmostRows[0]) as key}
          <th>{key}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each topmostRows as row}
        <tr>
          {#each Object.values(row) as value}
            <td>{value}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

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


  th {
    /* border: 1px solid var(--theme-border); */
    text-align: left;
    padding: 2px;
    margin: 0;
    background-color: var(--theme-bg-1);
    overflow: hidden;
    vertical-align: center;
    z-index: 100;
    font-weight: bold;

    border-bottom: 1px solid var(--theme-border);
    border-right: 1px solid var(--theme-border);
  }

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
