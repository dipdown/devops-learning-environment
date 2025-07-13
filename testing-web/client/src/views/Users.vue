<template>
  <div class="card">
    <Toast />
    <div class="crud-container">
      <div class="crud-header">
        <h5>User Management</h5>
        <div class="crud-actions">
          <Button label="New User" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
        </div>
      </div>

      <DataTable :value="users" v-model:selection="selectedUsers" :paginator="true" :rows="10"
        :rowsPerPageOptions="[5, 10, 25]" dataKey="id" :filters="filters" filterDisplay="menu" 
        responsiveLayout="scroll" stripedRows :loading="loading" class="crud-table">
        
        <template #header>
          <div class="flex justify-content-between">
            <Button icon="pi pi-refresh" @click="refreshData" />
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Search..." />
            </span>
          </div>
        </template>
        
        <Column selectionMode="multiple" headerStyle="width: 3rem" />
        <Column field="id" header="ID" sortable style="min-width: 5rem" />
        <Column field="name" header="Name" sortable style="min-width: 12rem" />
        <Column field="email" header="Email" sortable style="min-width: 16rem" />
        <Column field="created_at" header="Created Date" sortable style="min-width: 10rem">
          <template #body="{data}">
            {{ formatDate(data.created_at) }}
          </template>
        </Column>
        <Column header="Actions" style="min-width: 10rem">
          <template #body="{data}">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editUser(data)" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteUser(data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="userDialog" :style="{width: '450px'}" header="User Details" :modal="true" class="p-fluid">
      <div class="field">
        <label for="name">Name</label>
        <InputText id="name" v-model.trim="user.name" required autofocus :class="{'p-invalid': submitted && !user.name}" />
        <small class="p-error" v-if="submitted && !user.name">Name is required.</small>
      </div>
      <div class="field">
        <label for="email">Email</label>
        <InputText id="email" v-model.trim="user.email" required :class="{'p-invalid': submitted && !user.email}" />
        <small class="p-error" v-if="submitted && !user.email">Email is required.</small>
      </div>
      <div class="field" v-if="!user.id">
        <label for="password">Password</label>
        <Password id="password" v-model="user.password" required :class="{'p-invalid': submitted && !user.password}" toggleMask />
        <small class="p-error" v-if="submitted && !user.password">Password is required.</small>
      </div>
      <div class="field" v-if="user.id">
        <label for="new-password">New Password (leave blank to keep current)</label>
        <Password id="new-password" v-model="user.password" toggleMask />
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveUser" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteUserDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="user">Are you sure you want to delete <b>{{user.name}}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUserDialog = false" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteUser" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteUsersDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="selectedUsers">Are you sure you want to delete the selected users?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUsersDialog = false" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedUsers" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue';
import { useUserStore } from '@/stores/users';
import { FilterMatchMode } from 'primevue/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

export default {
  components: {
    DataTable,
    Column,
    Button,
    Dialog,
    InputText,
    Password,
    Toast
  },
  setup() {
    const userStore = useUserStore();
    const toast = useToast();
    
    const users = ref([]);
    const userDialog = ref(false);
    const deleteUserDialog = ref(false);
    const deleteUsersDialog = ref(false);
    const user = ref({});
    const selectedUsers = ref(null);
    const submitted = ref(false);
    const loading = ref(false);
    
    const filters = reactive({
      'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    
    onMounted(() => {
      refreshData();
    });
    
    const refreshData = async () => {
      loading.value = true;
      await userStore.fetchUsers();
      users.value = userStore.users;
      loading.value = false;
    };
    
    const openNew = () => {
      user.value = {};
      submitted.value = false;
      userDialog.value = true;
    };
    
    const hideDialog = () => {
      userDialog.value = false;
      submitted.value = false;
    };
    
    const saveUser = async () => {
      submitted.value = true;
      
      if (user.value.name && user.value.email && (!user.value.id || user.value.password)) {
        try {
          loading.value = true;
          
          if (user.value.id) {
            // Update existing user
            const userData = {
              name: user.value.name,
              email: user.value.email
            };
            
            if (user.value.password) {
              userData.password = user.value.password;
            }
            
            await userStore.updateUser(user.value.id, userData);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
          } else {
            // Create new user
            await userStore.createUser(user.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
          }
          
          userDialog.value = false;
          user.value = {};
          await refreshData();
        } catch (error) {
          toast.add({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'An error occurred', life: 3000 });
        } finally {
          loading.value = false;
        }
      }
    };
    
    const editUser = (userData) => {
      user.value = { ...userData };
      user.value.password = ''; // Clear password field when editing
      userDialog.value = true;
    };
    
    const confirmDeleteUser = (userData) => {
      user.value = userData;
      deleteUserDialog.value = true;
    };
    
    const deleteUser = async () => {
      try {
        loading.value = true;
        await userStore.deleteUser(user.value.id);
        deleteUserDialog.value = false;
        user.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
        await refreshData();
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'An error occurred', life: 3000 });
      } finally {
        loading.value = false;
      }
    };
    
    const deleteSelectedUsers = async () => {
      try {
        loading.value = true;
        for (const user of selectedUsers.value) {
          await userStore.deleteUser(user.id);
        }
        deleteUsersDialog.value = false;
        selectedUsers.value = null;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
        await refreshData();
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'An error occurred', life: 3000 });
      } finally {
        loading.value = false;
      }
    };
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };
    
    return {
      users,
      userDialog,
      deleteUserDialog,
      deleteUsersDialog,
      user,
      selectedUsers,
      submitted,
      filters,
      loading,
      refreshData,
      openNew,
      hideDialog,
      saveUser,
      editUser,
      confirmDeleteUser,
      deleteUser,
      deleteSelectedUsers,
      formatDate
    };
  }
};
</script>

<style scoped>
.card {
  background: var(--surface-card);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}
</style>
