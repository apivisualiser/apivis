<script lang="ts">
  import { getFormContext } from "./FormProviderCore.svelte";
  import FormCheckboxFieldRaw from "./FormCheckboxFieldRaw.svelte";
  import { createEventDispatcher } from "svelte";
  import { notypecheck } from "../utility/common";

  export let label;
  export let name;
  export let disabled = false;
  export let templateProps = {};

  const { template, setFieldValue, values } = getFormContext();
  const dispatch = createEventDispatcher();
</script>

<svelte:component
  this={template}
  type="checkbox"
  {label}
  {disabled}
  {...templateProps}
  labelProps={disabled
    ? { disabled: true }
    : {
        onClick: () => {
          setFieldValue(name, !$values[name]);
          dispatch("change");
        },
      }}
>
  <FormCheckboxFieldRaw
    {name}
    {...$$restProps}
    {disabled}
    on:change
    {...notypecheck}
  />
</svelte:component>
