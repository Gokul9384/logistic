<!-- src/pages/Admin/User_Role/UserRoleList.vue -->
<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="page-header row items-center justify-between q-mb-lg">
      <h2 class="text-h5 text-weight-medium q-ma-none">User Role Management</h2>
      <div class="header-actions row items-center q-gutter-sm">
        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Add Role"
          @click="navigateToAdd"
          class="add-btn"
        />
        <q-input
          outlined
          dense
          debounce="300"
          v-model="searchQuery"
          placeholder="Search roles..."
          clearable
          class="search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- User Roles Table -->
    <q-card flat bordered>
      <q-table
        :columns="tableColumns"
        :rows="filteredRoles"
        row-key="id"
        :pagination="tablePagination"
        :rows-per-page-options="pageSizeOptions"
        @request="onTableRequest"
        :loading="isLoading"
        class="roles-table"
      >
        <!-- Role Details Column -->
        <template v-slot:body-cell-details="props">
          <q-td :props="props">
            <div class="role-info">
              <div class="text-weight-medium">{{ props.row.name }}</div>
              <div class="text-caption text-grey-6">
                Code: {{ props.row.code }}
              </div>
            </div>
          </q-td>
        </template>

        <!-- Permissions Column -->
        <template v-slot:body-cell-permissions="props">
          <q-td :props="props">
            <div class="permissions-container">
              <template v-if="Array.isArray(props.row.permissions) && props.row.permissions.length">
                <q-chip
                  v-for="permission in getVisiblePermissions(props.row.permissions)"
                  :key="permission"
                  color="primary"
                  text-color="white"
                  size="sm"
                  class="q-mr-xs q-mb-xs"
                >
                  {{ permission }}
                </q-chip>
                <q-chip
                  v-if="getHiddenPermissionsCount(props.row.permissions) > 0"
                  color="grey"
                  text-color="white"
                  size="sm"
                  clickable
                  @click="showAllPermissions(props.row.permissions)"
                >
                  +{{ getHiddenPermissionsCount(props.row.permissions) }}
                </q-chip>
              </template>
              <template v-else>
                <div class="text-subtitle2 text-grey">N/A</div>
              </template>
            </div>
          </q-td>
        </template>

        <!-- Status Column -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.status ? 'positive' : 'negative'"
              text-color="white"
              size="sm"
            >
              {{ props.row.status ? 'Active' : 'Inactive' }}
            </q-chip>
          </q-td>
        </template>

        <!-- Actions Column -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <div class="action-buttons q-gutter-xs">
              <q-btn
                flat
                dense
                round
                icon="edit"
                color="primary"
                size="sm"
                @click="navigateToEdit(props.row.id)"
              >
                <q-tooltip>Edit Role</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                size="sm"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip>Delete Role</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <!-- No Data Slot -->
        <template v-slot:no-data="{ message }">
          <div class="full-width row flex-center q-gutter-sm text-grey">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span>{{ message }}</span>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Permissions Dialog -->
    <q-dialog v-model="permissionsDialog" position="top">
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">All Permissions</div>
        </q-card-section>

        <q-card-section>
          <div class="row q-gutter-sm">
            <template v-if="Array.isArray(allPermissions) && allPermissions.length">
              <q-chip
                v-for="permission in allPermissions"
                :key="permission"
                color="primary"
                text-color="white"
                size="sm"
              >
                {{ permission }}
              </q-chip>
            </template>
            <template v-else>
              <div class="text-subtitle2 text-grey">N/A</div>
            </template>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Loading Overlay -->
    <q-inner-loading :showing="isLoading">
      <q-spinner
        color="primary"
        size="3em"
        :thickness="5"
      />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { CommonService } from '@/services/CommonService';
import { CommonHelper } from '@/helpers/CommonHelper';

// Router and Quasar setup
const router = useRouter();
const $q = useQuasar();

// Component state
const isLoading = ref(false);
const searchQuery = ref('');
const allRoles = ref<any[]>([]);
const pageSizeOptions = [10, 20, 50, 100];
const permissionsDialog = ref(false);
const allPermissions = ref<string[]>([]);

// Table configuration
const tablePagination = reactive({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const tableColumns = [
  {
    name: 'details',
    label: 'Role Details',
    field: 'name',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'permissions',
    label: 'Permissions',
    field: 'permissions',
    sortable: false,
    align: 'left' as const
  },
  {
    name: 'landing_page',
    label: 'Landing Page',
    field: 'landing_page',
    sortable: false,
    align: 'left' as const
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    sortable: false,
    align: 'center' as const
  }
];

// Computed properties
const filteredRoles = computed(() => {
  if (!searchQuery.value.trim()) {
    return allRoles.value;
  }
  const searchTerm = searchQuery.value.toLowerCase().trim();
  return allRoles.value.filter((role: any) => {
    const searchableFields = [
      role.name,
      role.code,
      role.landing_page
    ];
    return searchableFields.some(field => 
      field?.toLowerCase().includes(searchTerm)
    );
  });
});

// Methods
const fetchRoles = async () => {
  try {
    isLoading.value = true;
    const response = await CommonService.GetAll('/v1/UserRole/List');
    allRoles.value = response;
    tablePagination.rowsNumber = response.length;
    tablePagination.page = 1;
  } catch (error) {
    CommonHelper.ErrorToaster('Failed to load user roles');
  } finally {
    isLoading.value = false;
  }
};

const onTableRequest = (props: { 
  pagination: { 
    page: number; 
    rowsPerPage: number; 
    sortBy: string; 
    descending: boolean; 
  };
}) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  
  tablePagination.page = page;
  tablePagination.rowsPerPage = rowsPerPage;
  tablePagination.sortBy = sortBy;
  tablePagination.descending = descending;
};

const navigateToAdd = () => {
  router.push('/user_role/0');
};

const navigateToEdit = (roleId: number | string) => {
  router.push(`/user_role/${roleId}`);
};

const getVisiblePermissions = (permissions: string[] | null = []) => {
  if (!Array.isArray(permissions)) return [];
  return permissions.slice(0, 3); // Show only first 3 permissions
};

const getHiddenPermissionsCount = (permissions: string[] | null = []) => {
  if (!Array.isArray(permissions)) return 0;
  return Math.max(0, permissions.length - 3);
};

const showAllPermissions = (permissions: string[] | null = []) => {
  allPermissions.value = Array.isArray(permissions) ? permissions : [];
  permissionsDialog.value = true;
};

const confirmDelete = (role: any) => {
  $q.dialog({
    title: 'Are you sure?',
    message: `You want to delete the role "${role.name}"!`,
    persistent: true,
    color: 'warning',
    ok: {
      label: 'Delete',
      color: 'negative'
    },
    cancel: {
      label: 'Cancel',
      color: 'grey'
    }
  }).onOk(async () => {
    try {
      isLoading.value = true;
      const response = await CommonService.CommonDelete(`/v1/UserRole/Delete/${role.id}`);
      
      if (response.Type === 'S') {
        CommonHelper.SuccessToaster(response.Message);
        await fetchRoles(); // Refresh the list
      } else {
        CommonHelper.ErrorToaster(response.Message);
      }
    } catch (error) {
      CommonHelper.ErrorToaster('Failed to delete user role');
    } finally {
      isLoading.value = false;
    }
  });
};

// Lifecycle
onMounted(() => {
  fetchRoles();
});
</script>

<style scoped>
.page-header {
  margin-bottom: 24px;
}

.add-btn {
  text-transform: none;
  font-weight: 500;
}

.search-input {
  width: 300px;
}

.roles-table {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.role-info {
  line-height: 1.2;
}

.permissions-container {
  display: flex;
  flex-wrap: wrap;
  max-width: 300px;
}

.action-buttons {
  display: flex;
  justify-content: center;
}

:deep(.q-table th) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

:deep(.q-table tbody tr:hover) {
  background-color: #f8f9fa;
}

:deep(.q-btn) {
  text-transform: none;
}

:deep(.q-chip) {
  font-weight: 500;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .header-actions {
    justify-content: space-between;
  }
  
  .search-input {
    width: 100%;
    max-width: 300px;
  }
}
</style>