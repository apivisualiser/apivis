import _ from 'lodash';
import { currentConnection, getCurrentConnection, getLockedDatabaseMode, getOpenedConnections, openedTabs } from '../stores';
import { shouldShowTab } from '../tabpanel/TabsPanel.svelte';
import { callWhenAppLoaded, getAppLoaded } from './appLoadManager';
import { getConnection } from './localdb';
import { openAndLoadConnection } from '../openapi/openapidoc';
// import { getConnectionInfo } from './metadataLoaders';

let lastCurrentTab: any = null;

openedTabs.subscribe(value => {
  const newCurrentTab = (value || []).find(x => x.selected);
  if (newCurrentTab == lastCurrentTab) return;
  if (getLockedDatabaseMode() && getCurrentConnection()) return;

  const lastTab = lastCurrentTab;
  lastCurrentTab = newCurrentTab;
  // if (lastTab?.tabComponent == 'ConnectionTab') return;

  if (newCurrentTab) {
    const { conid } = newCurrentTab.props || {};
    if (conid && conid != lastTab?.props?.conid) {
      const doWork = async () => {
        const connection = await getConnection(conid);
        currentConnection.set(connection!);
        if (!getOpenedConnections()[conid]) {
          openAndLoadConnection(conid, connection!);
        }
      };
      callWhenAppLoaded(doWork);
    }
  }
});

currentConnection.subscribe(currentDb => {
  if (!getLockedDatabaseMode()) return;
  if (!currentDb && !getAppLoaded()) return;
  openedTabs.update(tabs => {
    const newTabs = tabs.map(tab => ({
      ...tab,
      selected: tab.selected && shouldShowTab(tab, true, currentDb),
    }));

    if (newTabs.find(x => x.selected)) return newTabs;

    const selectedIndex = _.findLastIndex(newTabs, x => shouldShowTab(x));

    return newTabs.map((x, index) => ({
      ...x,
      selected: index == selectedIndex,
    }));
  });
});
