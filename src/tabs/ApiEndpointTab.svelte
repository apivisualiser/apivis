<script lang="ts">
  import { writable } from 'svelte/store';
  import FormFieldTemplateLarge from '../forms/FormFieldTemplateLarge.svelte';
  import FormProviderCore from '../forms/FormProviderCore.svelte';

  export let path: string;
  export let conid: string;

  const values = writable({});

  
</script>

<FormProviderCore template={FormFieldTemplateLarge} {values}></FormProviderCore>
