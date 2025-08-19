<template>
  <q-page padding>
    <div class="page-header row items-center justify-between q-mb-lg">
      <h2 class="text-h5 text-weight-medium q-ma-none">Customer Management</h2>
      <div class="header-actions row items-center q-gutter-sm">
        <q-btn
          unelevated
          color="primary"
          icon="person_add"
          label="Add Customer"
          @click="navigateToAdd"
          class="add-btn"
        />
        <q-input
          outlined
          dense
          debounce="300"
          v-model="searchQuery"
          placeholder="Search customers..."
          clearable
          class="search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-card flat bordered>
      <q-table
        :columns="tableColumns"
        :rows="paginatedCustomers"
        row-key="id"
        v-model:pagination="tablePagination"
        :rows-per-page-options="pageSizeOptions"
        @request="onTableRequest"
        :loading="isLoading"
        class="customers-table"
      >
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div class="customer-info">
              <div class="text-weight-medium">
                {{ props.row.name }}
              </div>
              <div class="text-caption text-grey-6">
                {{ props.row.email }}
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-address="props">
          <q-td :props="props">
            <div class="address-info">
              <div v-if="props.row.formatted_address" class="text-body2">
                {{ props.row.formatted_address }}
              </div>
              <div v-else class="text-caption text-grey-5 italic">
                No address provided
              </div>
              <div v-if="props.row.latitude && props.row.longitude" class="text-caption text-grey-6 q-mt-xs">
                <q-icon name="location_on" size="xs" class="q-mr-xs" />
                {{ parseFloat(props.row.latitude).toFixed(4) }}, {{ parseFloat(props.row.longitude).toFixed(4) }}
              </div>
            </div>
          </q-td>
        </template>

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
                <q-tooltip>Edit Customer</q-tooltip>
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
                <q-tooltip>Delete Customer</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <template v-slot:no-data="{ message }">
          <div class="full-width row flex-center q-gutter-sm text-grey">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span>{{ message }}</span>
          </div>
        </template>

        <!-- Bottom Pagination -->
        <template v-slot:bottom>
          <div class="row full-width justify-between items-center">
            <div class="text-caption text-grey-7">
              {{ paginationInfo }}
            </div>
            <q-pagination
              v-model="tablePagination.page"
              :max="totalPages"
              :max-pages="6"
              direction-links
              boundary-links
              @update:model-value="onPageChange"
            />
          </div>
        </template>
      </q-table>
    </q-card>

    <q-inner-loading :showing="isLoading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue';
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
const allCustomers = ref<any[]>([]);
const pageSizeOptions = [10, 20, 50, 100];

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
    name: 'name',
    label: 'Customer Details',
    field: 'name',
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
    name: 'gst_number',
    label: 'GST Number',
    field: 'gst_number',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'address',
    label: 'Address',
    field: 'formatted_address', // Fixed: Changed from 'address' to 'formatted_address'
    sortable: true,
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
const filteredCustomers = computed(() => {
  let filtered = allCustomers.value;

  if (searchQuery.value.trim()) {
    const searchTerm = searchQuery.value.toLowerCase().trim();
    filtered = allCustomers.value.filter((customer: any) => {
      const searchableFields = [
        customer.name,
        customer.email,
        customer.mobile,
        customer.gst_number,
        customer.formatted_address // Fixed: Changed from 'address' to 'formatted_address'
      ];

      return searchableFields.some(field =>
        field?.toLowerCase().includes(searchTerm)
      );
    });
  }

  // Update pagination when filtering
  tablePagination.rowsNumber = filtered.length;
  
  return filtered;
});

const paginatedCustomers = computed(() => {
  const filtered = filteredCustomers.value;
  const { page, rowsPerPage } = tablePagination;
  
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  
  return filtered.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.ceil(tablePagination.rowsNumber / tablePagination.rowsPerPage);
});

const paginationInfo = computed(() => {
  const { page, rowsPerPage, rowsNumber } = tablePagination;
  
  if (rowsNumber === 0) {
    return '0 records';
  }
  
  const startRecord = (page - 1) * rowsPerPage + 1;
  const endRecord = Math.min(page * rowsPerPage, rowsNumber);
  
  return `${startRecord}-${endRecord} of ${rowsNumber} records`;
});

// Watchers
watch(searchQuery, () => {
  tablePagination.page = 1; // Reset to first page when searching
});

// Methods
const fetchCustomers = async () => {
  try {
    isLoading.value = true;
    const response = await CommonService.GetAll('/v1/Customer/List');
    allCustomers.value = response;
    tablePagination.rowsNumber = response.length;
    tablePagination.page = 1;
  } catch (error) {
    CommonHelper.ErrorToaster('Failed to load customers');
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

const onPageChange = (newPage: number) => {
  tablePagination.page = newPage;
};

const navigateToAdd = () => {
  router.push('/customers/0');
};

const navigateToEdit = (customerId: string) => {
  router.push(`/customers/${customerId}`);
};

const confirmDelete = (customer: any) => {
  $q.dialog({
    title: 'Are you sure?',
    message: `You want to suspend/activate ${customer.name}!`,
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
    try {
      CommonHelper.Showspinner();
      const response = await CommonService.CommonDelete(`/v1/Customer/Delete/${customer.id}`);

      if (response.Type === 'S') {
        CommonHelper.SuccessToaster(response.Message);
        await fetchCustomers(); // Refresh the list
      } else {
        CommonHelper.ErrorToaster(response.Message);
      }
    } catch (error) {
      CommonHelper.ErrorToaster('Failed to delete customer');
    } finally {
      CommonHelper.Hidespinner();
    }
  });
};

// Lifecycle
onMounted(() => {
  fetchCustomers();
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
.customers-table {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}
.customer-info {
  line-height: 1.2;
}
.address-info {
  max-width: 250px;
  line-height: 1.3;
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
:deep(.q-pagination) {
  color: #1976d2;
}
:deep(.q-pagination .q-btn) {
  min-height: 32px;
  min-width: 32px;
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
  :deep(.q-table .q-table__bottom) {
    flex-direction: column;
    gap: 12px;
  }
  :deep(.q-pagination) {
    justify-content: center;
  }
}
</style>