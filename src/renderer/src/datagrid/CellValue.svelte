<script context="module">
  function makeBulletString(value) {
    return _.pad('', value.length, '•');
  }

  function highlightSpecialCharacters(value) {
    value = value.replace(/\n/g, '↲');
    value = value.replace(/\r/g, '');
    value = value.replace(/^(\s+)/, makeBulletString);
    value = value.replace(/(\s+)$/, makeBulletString);
    value = value.replace(/(\s\s+)/g, makeBulletString);
    return value;
  }

  // const dateTimeRegex = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d\d\d)?Z?$/;
  const dateTimeRegex =
    /^([0-9]+)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])[Tt]([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(([Zz])|()|([\+|\-]([01][0-9]|2[0-3]):[0-5][0-9]))$/;

  function formatNumber(value) {
    if (value >= 10000 || value <= -10000) {
      return value.toLocaleString();
    }

    return value.toString();
  }

  function formatDateTime(testedString) {
    const m = testedString.match(dateTimeRegex);
    return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]}`;
  }
</script>

<script lang="ts">
  import _ from 'lodash';
  import { arrayToHexString } from '../utility/stringTools';
  import JSONTree from '../jsontree/JSONTree.svelte'

  export let rowData;
  export let value;
  export let jsonParsedValue: any = undefined;
</script>

{#if rowData == null}
  <span class="null">(No row)</span>
{:else if value === null}
  <span class="null">(NULL)</span>
{:else if value === undefined}
  <span class="null">(No field)</span>
{:else if _.isDate(value)}
  {value.toString()}
{:else if value === true}
  <span class="value">true</span>
{:else if value === false}
  <span class="value">false</span>
{:else if _.isNumber(value)}
  <span class="value">{formatNumber(value)}</span>
{:else if _.isString(value) && !jsonParsedValue}
  {#if dateTimeRegex.test(value)}
    <span class="value">
      {formatDateTime(value)}
    </span>
  {:else}
    {highlightSpecialCharacters(value)}
  {/if}
{:else if value?.type == 'Buffer' && _.isArray(value.data)}
  {#if value.data.length <= 16}
    <span class="value">{'0x' + arrayToHexString(value.data)}</span>
  {:else}
    <span class="null">({value.data.length} bytes)</span>
  {/if}
{:else if value.$oid}
  <span class="value">ObjectId("{value.$oid}")</span>
{:else if _.isPlainObject(value)}
  <JSONTree {value} />
<!-- {@const svalue = JSON.stringify(value, undefined, 2)}
  <span class="null" title={svalue}
    >{#if svalue.length < 100}{JSON.stringify(value)}{:else}(JSON){/if}</span
  > -->
{:else if _.isArray(value)}
  <JSONTree {value} />
  <!-- <span class="null" title={value.map(x => JSON.stringify(x)).join('\n')}>[{value.length} items]</span> -->
{:else if _.isPlainObject(jsonParsedValue)}
  <JSONTree value={jsonParsedValue} />
<!-- {@const svalue = JSON.stringify(jsonParsedValue, undefined, 2)}
  <span class="null" title={svalue}
    >{#if svalue.length < 100}{JSON.stringify(jsonParsedValue)}{:else}(JSON){/if}</span
  > -->
{:else if _.isArray(jsonParsedValue)}
  <JSONTree value={jsonParsedValue} />
  <!-- <span class="null" title={jsonParsedValue.map(x => JSON.stringify(x)).join('\n')}
    >[{jsonParsedValue.length} items]</span
  > -->
{:else}
  {value.toString()}
{/if}

<style>
  .null {
    color: var(--theme-font-3);
    font-style: italic;
  }
  .value {
    color: var(--theme-icon-green);
  }
</style>
