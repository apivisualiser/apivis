<script lang="ts">
  import FormCheckboxField from '../forms/FormCheckboxField.svelte';
  // import FormElectronFileSelector from '../forms/FormElectronFileSelector.svelte';

  import FormPasswordField from '../forms/FormPasswordField.svelte';
  import _ from 'lodash';

  import { getFormContext } from '../forms/FormProviderCore.svelte';
  import FormRadioGroupField from '../forms/FormRadioGroupField.svelte';
  import FormSelectField from '../forms/FormSelectField.svelte';

  import FormTextField from '../forms/FormTextField.svelte';
  import {  getCurrentConfig, openedConnections, openedSingleDatabaseConnections } from '../stores';
  // import getElectron from '../utility/getElectron';
  // import { useAuthTypes } from '../utility/metadataLoaders';
  import FormColorField from '../forms/FormColorField.svelte';
  import FontIcon from '../icons/FontIcon.svelte';

  const { values } = getFormContext();
  // const electron = getElectron();

  $: authType = $values.authType;
  $: engine = $values.engine;
  $: useDatabaseUrl = $values.useDatabaseUrl;
  $: defaultDatabase = $values.defaultDatabase;
  $: isConnected = false;

  // $: showUser = driver?.showConnectionField('user', $values) && $values.passwordMode != 'askUser';
  // $: showPassword =
  //   driver?.showConnectionField('password', $values) &&
  //   $values.passwordMode != 'askPassword' &&
  //   $values.passwordMode != 'askUser';
  // $: showPasswordMode = driver?.showConnectionField('password', $values);
  // $: isConnected = $openedConnections.includes($values._id) || $openedSingleDatabaseConnections.includes($values._id);
</script>

<!-- <FormSelectField
  label="Connection type"
  name="engine"
  isNative
  disabled={isConnected}
  options={[
    { label: '(select connection type)', value: '' },
    ...$extensions.drivers
      .filter(driver => !driver.isElectronOnly || electron)
      .map(driver => ({
        value: driver.engine,
        label: driver.title,
      })),
  ]}
/>

{#if driver?.showConnectionField('databaseFile', $values)}
  <FormElectronFileSelector label="Database file" name="databaseFile" disabled={isConnected || !electron} />
{/if} -->

<!-- {#if driver?.showConnectionField('useDatabaseUrl', $values)}
  <div class="radio">
    <FormRadioGroupField
      disabled={isConnected}
      name="useDatabaseUrl"
      options={[
        { label: 'Fill database connection details', value: '', default: true },
        { label: 'Use database URL', value: '1' },
      ]}
    />
  </div>
{/if} -->

  <FormTextField
    label="OpenApi URL"
    name="openApiUrl"
    disabled={isConnected}
    />


  <div class="row">
    <div class="col-6 mr-1">
      <FormTextField
        label="Display name"
        name="displayName"
        templateProps={{ noMargin: true }}
        disabled={isConnected}
      />
    </div>
    <div class="col-6 mr-1">
      <FormColorField
        useSelector
        label="Color"
        name="connectionColor"
        emptyLabel="(not selected)"
        templateProps={{ noMargin: true }}
        disabled={isConnected}
      />
    </div>
  </div>

<style>
  .row {
    margin: var(--dim-large-form-margin);
    display: flex;
  }
  .radio {
    margin-left: var(--dim-large-form-margin);
    display: flex;
  }
  .radio :global(label) {
    margin-right: 10px;
  }
</style>
