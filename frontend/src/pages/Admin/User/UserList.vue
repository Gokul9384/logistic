<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="page-header row items-center justify-between q-mb-lg">
      <h2 class="text-h5 text-weight-medium q-ma-none">User Management</h2>
      <div class="header-actions row items-center q-gutter-sm">
        <q-btn
          unelevated
          color="primary"
          icon="person_add"
          label="Add User"
          @click="navigateToAdd"
          class="add-btn"
        />
        <q-input
          outlined
          dense
          debounce="300"
          v-model="searchQuery"
          placeholder="Search users..."
          clearable
          class="search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Users Table -->
    <q-card flat bordered>
      <q-table
        :columns="tableColumns"
        :rows="filteredUsers"
        row-key="id"
        :pagination="tablePagination"
        :rows-per-page-options="pageSizeOptions"
        @request="onTableRequest"
        :loading="isLoading"
        class="users-table"
      >
        <!-- Role Column -->
        <template v-slot:body-cell-role="props">
          <q-td :props="props">
            <div class="col-12 col-md-4">
              <q-chip
                :color="getRoleColor(props.row.user_role?.name)"
                text-color="white"
                size="sm"
              >
                {{ props.row.user_role?.name || 'N/A' }}
              </q-chip>
            </div>
          </q-td>
        </template>

        <!-- Full Name Column -->
        <template v-slot:body-cell-full_name="props">
          <q-td :props="props">
            <div class="user-info">
              <div class="text-weight-medium">
                {{ getFullName(props.row) }}
              </div>
              <div class="text-caption text-grey-6">
                {{ props.row.email }}
              </div>
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
                <q-tooltip>Edit User</q-tooltip>
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
                <q-tooltip>Delete User</q-tooltip>
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

// Import your actual services
import { CommonService } from '@/services/CommonService';
import { CommonHelper } from '@/helpers/CommonHelper';

// Router and Quasar setup
const router = useRouter();
const $q = useQuasar();

// Component state
const isLoading = ref(false);
const searchQuery = ref('');
const allUsers = ref<any[]>([]);
const pageSizeOptions = [10, 20, 50, 100];

// Table configuration
const tablePagination = reactive({
  sortBy: 'role',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const tableColumns = [
  {
    name: 'role',
    label: 'Role',
    field: (row: any) => row.user_role?.name,
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'full_name',
    label: 'User Details',
    field: 'first_name',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'mobile',
    label: 'Mobile',
    field: 'mobile',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    sortable: true,
    align: 'center' as const
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
const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) {
    return allUsers.value;
  }

  const searchTerm = searchQuery.value.toLowerCase().trim();
  return allUsers.value.filter((user: any) => {
    const searchableFields = [
      user.first_name,
      user.last_name,
      user.email,
      user.mobile,
      user.user_role?.name
    ];

    return searchableFields.some(field => 
      field?.toLowerCase().includes(searchTerm)
    );
  });
});

// Methods
const fetchUsers = async () => {
  isLoading.value = true;

  const response = await CommonService.GetAll('/v1/User/List');
  if(response){}
  allUsers.value = response;
  tablePagination.rowsNumber = response.length;
  tablePagination.page = 1;
  isLoading.value = false;

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
  router.push('/users/0');
};

// Fixed: Ensure userId parameter is handled correctly for navigation
const navigateToEdit = (userId: number | string) => {
  router.push(`/users/${userId}`);
};

const getFullName = (user: any): string => {
  const parts = [user.first_name, user.last_name]
    .filter(part => part && part.trim());
  return parts.join(' ');
};

const getRoleColor = (roleName: string): string => {
  const roleColors: { [key: string]: string } = {
    'Admin': 'deep-purple',
    'Manager': 'blue',
    'User': 'teal',
    'default': 'grey'
  };
  return roleColors[roleName] || roleColors.default;
};

const confirmDelete = (user: any) => {
  $q.dialog({
    title: 'Are you sure?',
    message: `You want to suspend/activate ${getFullName(user)}!`,
    persistent: true,
    color: 'warning',
    ok: {
      label: 'Confirm',
      color: 'negative'
    },
    cancel: {
      label: 'Cancel',
      color: 'grey'
    }
  }).onOk(async () => {
    isLoading.value = true;
    const response = await CommonService.CommonPatch(`/v1/User/SuspendOrActivate/${user.id}`);
    
    if (response.Type === 'S') {
      CommonHelper.SuccessToaster(response.Message);
      await fetchUsers(); // Refresh the list
    } else {
      CommonHelper.ErrorToaster(response.Message);
    }
        isLoading.value = false;
  });
};

// Lifecycle
onMounted(() => {
  fetchUsers();
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

.users-table {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.user-info {
  line-height: 1.2;
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