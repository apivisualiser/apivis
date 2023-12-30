<script lang="ts">
  import { currentConnection, pinnedDatabases, pinnedTables } from "../stores";
  // import { useConfig, useConnectionInfo } from "../utility/metadataLoaders";

  import ConnectionList from "./ConnectionList.svelte";
  import PinnedObjectsList from "./PinnedObjectsList.svelte";
  import ErrorInfo from "../elements/ErrorInfo.svelte";
  import WidgetsInnerContainer from "./WidgetsInnerContainer.svelte";

  import WidgetColumnBar from "./WidgetColumnBar.svelte";
  import WidgetColumnBarItem from "./WidgetColumnBarItem.svelte";
  // import SqlObjectList from "./SqlObjectList.svelte";
  // import DbKeysTree from "./DbKeysTree.svelte";
  // import SingleConnectionDatabaseList from "./SingleConnectionDatabaseList.svelte";
  import _ from "lodash";
  import { useConnectionInfo } from "../utility/localdb";

  export let hidden = false;

  $: conid = $currentConnection?.id;
  $: connection = useConnectionInfo({ conid });
  $: database = $currentConnection?.name;
</script>

<WidgetColumnBar {hidden}>
  <WidgetColumnBarItem
    title="Connections"
    name="connections"
    height="35%"
    storageName="connectionsWidget"
  >
    <ConnectionList />
  </WidgetColumnBarItem>
  <WidgetColumnBarItem
    title="Pinned"
    name="pinned"
    height="15%"
    storageName="pinnedItemsWidget"
    <!-- skip={!_.compact($pinnedDatabases).length &&
      !$pinnedTables.some(
        (x) => x && x.conid == conid && x.database == $currentConnection?.name
      )} -->
  >
    <PinnedObjectsList />
  </WidgetColumnBarItem>

  <WidgetColumnBarItem
    title='Endpoints'
    name="dbObjects"
    storageName="dbObjectsWidget"
  >
    <!-- <SqlObjectList {conid} {database} /> -->
  </WidgetColumnBarItem>


</WidgetColumnBar>
