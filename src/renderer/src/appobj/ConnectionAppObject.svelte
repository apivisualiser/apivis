<script lang="ts">
  import ConfirmModal from '../modals/ConfirmModal.svelte';
  import { showModal } from '../modals/modalTools';
  import getConnectionLabel from '../utility/getConnectionLabel';
  import { saveConnection, deleteConnection } from '../utility/localdb';
  import AppObjectCore from './AppObjectCore.svelte';
  import { v1 as uuidv1 } from 'uuid';
  import { currentConnection } from '../stores';
  import type { ConnectionInfo, OpenedConnection } from '../utility/types';

  export let data: ConnectionInfo;
  export let opened: OpenedConnection | undefined;

  const handleDelete = () => {
    showModal(ConfirmModal, {
      message: `Really delete connection ${getConnectionLabel(data)}?`,
      onConfirm: () => deleteConnection(data.id),
    });
  };
  const handleDuplicate = () => {
    saveConnection({
      ...data,
      id: uuidv1(),
      displayName: `${getConnectionLabel(data)} - copy`,
    });
  };

  function getContextMenu() {
    return [
      {
        text: 'Delete',
        onClick: handleDelete,
      },
      {
        text: 'Duplicate',
        onClick: handleDuplicate,
      },
    ];
  }
</script>

<AppObjectCore
  title={getConnectionLabel(data)}
  icon="img server"
  menu={getContextMenu}
  on:click={() => currentConnection.set(data)}
  isBold={$currentConnection?.id == data.id}
  statusIcon={opened?.status == 'error'
    ? 'img error'
    : opened?.status == 'pending'
      ? 'icon loading'
      : opened?.status == 'connected'
        ? 'img ok'
        : undefined}
  statusTitle={opened?.errorMessage}
/>
