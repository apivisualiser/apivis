import {
  currentDatabase,
  currentTheme,
  emptyConnectionGroupNames,
  extensions,
  getExtensions,
  getVisibleToolbar,
  visibleToolbar,
  visibleWidgetSideBar,
} from '../stores';
import registerCommand from './registerCommand';
import { get } from 'svelte/store';
import AboutModal from '../modals/AboutModal.svelte';
import SettingsModal from '../settings/SettingsModal.svelte';
import ImportExportModal from '../modals/ImportExportModal.svelte';
import SqlGeneratorModal from '../modals/SqlGeneratorModal.svelte';
import { showModal } from '../modals/modalTools';
import newQuery, { newDiagram, newPerspective, newQueryDesign } from '../query/newQuery';
import saveTabFile from '../utility/saveTabFile';
import openNewTab from '../utility/openNewTab';
import getElectron from '../utility/getElectron';
import { openElectronFile } from '../utility/openElectronFile';
import { getDefaultFileFormat } from '../plugins/fileformats';
import { getCurrentConfig, getCurrentDatabase } from '../stores';
import './recentDatabaseSwitch';
import './changeDatabaseStatusCommand';
import hasPermission from '../utility/hasPermission';
import _ from 'lodash';
import { findEngineDriver } from 'dbgate-tools';
import { openArchiveFolder } from '../utility/openArchiveFolder';
import InputTextModal from '../modals/InputTextModal.svelte';
import { removeLocalStorage } from '../utility/storageCache';
import { showSnackbarSuccess } from '../utility/snackbar';
import { apiCall } from '../utility/api';
import runCommand from './runCommand';
import { openWebLink } from '../utility/exportFileTools';
import { getSettings } from '../utility/metadataLoaders';
import { isMac } from '../utility/common';
import { doLogout, internalRedirectTo } from '../clientAuth';
import { disconnectServerConnection } from '../appobj/ConnectionAppObject.svelte';

// function themeCommand(theme: ThemeDefinition) {
//   return {
//     text: theme.themeName,
//     onClick: () => currentTheme.set(theme.themeClassName),
//     // onPreview: () => {
//     //   const old = get(currentTheme);
//     //   currentTheme.set(css);
//     //   return ok => {
//     //     if (!ok) currentTheme.set(old);
//     //   };
//     // },
//   };
// }

registerCommand({
  id: 'theme.changeTheme',
  category: 'Theme',
  name: 'Change',
  toolbarName: 'Change theme',
  onClick: () => showModal(SettingsModal, { selectedTab: 2 }),
  // getSubCommands: () => get(extensions).themes.map(themeCommand),
});

registerCommand({
  id: 'toolbar.show',
  category: 'Toolbar',
  name: 'Show',
  onClick: () => visibleToolbar.set(true),
  testEnabled: () => !getVisibleToolbar(),
});

registerCommand({
  id: 'toolbar.hide',
  category: 'Toolbar',
  name: 'Hide',
  onClick: () => visibleToolbar.set(false),
  testEnabled: () => getVisibleToolbar(),
});

registerCommand({
  id: 'about.show',
  category: 'About',
  name: 'Show',
  toolbarName: 'About',
  onClick: () => showModal(AboutModal),
});

registerCommand({
  id: 'toggle.sidebar',
  category: 'Sidebar',
  name: 'Show',
  toolbarName: 'Toggle sidebar',
  keyText: 'CtrlOrCommand+B',
  onClick: () => visibleWidgetSideBar.update(x => !x),
});

registerCommand({
  id: 'new.connection',
  toolbar: true,
  icon: 'icon new-connection',
  toolbarName: 'Add connection',
  category: 'New',
  toolbarOrder: 1,
  name: 'Connection',
  onClick: () => {
    openNewTab({
      title: 'New Connection',
      icon: 'img connection',
      tabComponent: 'ConnectionTab',
    });
  },
});

// registerCommand({
//   id: 'new.connection.folder',
//   toolbar: true,
//   icon: 'icon add-folder',
//   toolbarName: 'Add connection folder',
//   category: 'New',
//   toolbarOrder: 1,
//   name: 'Connection',
//   onClick: () => {
//     showModal(InputTextModal, {
//       value: '',
//       label: 'New connection folder name',
//       header: 'Create connection folder',
//       onConfirm: async folder => {
//         emptyConnectionGroupNames.update(names => {
//           if (!folder) return names;
//           if (names.includes(folder)) return names;
//           return [...names, folder];
//         });
//       },
//     });
//   },
// });

registerCommand({
  id: 'new.query',
  category: 'New',
  icon: 'icon file',
  toolbar: true,
  toolbarOrder: 2,
  name: 'Query',
  toolbarName: 'New query',
  keyText: 'CtrlOrCommand+T',
  onClick: () => newQuery(),
});

registerCommand({
  id: 'new.shell',
  category: 'New',
  icon: 'img shell',
  name: 'JavaScript Shell',
  menuName: 'New JavaScript shell',
  onClick: () => {
    openNewTab({
      title: 'Shell #',
      icon: 'img shell',
      tabComponent: 'ShellTab',
    });
  },
});


registerCommand({
  id: 'new.perspective',
  category: 'New',
  icon: 'img perspective',
  name: 'Perspective',
  menuName: 'New perspective',
  onClick: () => newPerspective(),
});

registerCommand({
  id: 'new.modelCompare',
  category: 'New',
  icon: 'icon compare',
  name: 'Compare DB',
  toolbar: true,
  onClick: () => {
    openNewTab({
      title: 'Compare',
      icon: 'img compare',
      tabComponent: 'CompareModelTab',
    });
  },
});

registerCommand({
  id: 'new.jsonl',
  category: 'New',
  icon: 'img archive',
  name: 'JSON Lines',
  menuName: 'New JSON lines file',
  onClick: () => {
    openNewTab(
      {
        title: 'Lines #',
        icon: 'img archive',
        tabComponent: 'JsonLinesEditorTab',
      },
      {
        editor: '{"col1": "val1", "col2": "val2"}',
      }
    );
  },
});
