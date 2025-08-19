<template>
  <q-page padding>
    <div class="page-header row items-center justify-between q-mb-lg">
      <h2 class="text-h5 text-weight-medium q-ma-none">Vehicle Type Management</h2>
      <div class="header-actions row items-center q-gutter-sm">
        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Add Vehicle Type"
          @click="navigateToAdd"
          class="add-btn"
        />
        <q-input
          outlined
          dense
          debounce="300"
          v-model="searchQuery"
          placeholder="Search vehicle types..."
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
        :rows="paginatedVehicleTypes"
        row-key="id"
        v-model:pagination="tablePagination"
        :rows-per-page-options="pageSizeOptions"
        @request="onTableRequest"
        :loading="isLoading"
        class="vehicle-types-table"
      >
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

        <template v-slot:body-cell-min_capacity="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              {{ props.row.min_capacity }} Kg
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-max_capacity="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              {{ props.row.max_capacity }} Kg
            </div>
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
                <q-tooltip>Edit Vehicle Type</q-tooltip>
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
                <q-tooltip>Delete Vehicle Type</q-tooltip>
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
const allVehicleTypes = ref<any[]>([]);
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
    label: 'Vehicle Type Name',
    field: 'name',
    sortable: true,
    align: 'left' as const
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
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
const filteredVehicleTypes = computed(() => {
  let filtered = allVehicleTypes.value;

  if (searchQuery.value.trim()) {
    const searchTerm = searchQuery.value.toLowerCase().trim();
    filtered = allVehicleTypes.value.filter((vehicleType: any) => {
      const searchableFields = [
        vehicleType.name,
        vehicleType.description
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

const paginatedVehicleTypes = computed(() => {
  const filtered = filteredVehicleTypes.value;
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

// Methods
const fetchVehicleTypes = async () => {
  try {
    isLoading.value = true;
    const response = await CommonService.GetAll('/v1/VehicleType/List');
    allVehicleTypes.value = response;
    tablePagination.rowsNumber = response.length;
    tablePagination.page = 1;
  } catch (error) {
    CommonHelper.ErrorToaster('Failed to load vehicle types');
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
  router.push('/vehicle_type/0');
};

const navigateToEdit = (vehicleTypeId: string) => {
  router.push(`/vehicle_type/${vehicleTypeId}`);
};

const confirmDelete = (vehicleType: any) => {
  $q.dialog({
    title: 'Are you sure?',
    message: `You want to ${vehicleType.status ? 'deactivate' : 'activate'} vehicle type "${vehicleType.name}"!`,
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
      const response = await CommonService.CommonDelete(`/v1/VehicleType/Delete/${vehicleType.id}`);

      if (response.Type === 'S') {
        CommonHelper.SuccessToaster(response.Message);
        await fetchVehicleTypes(); // Refresh the list
      } else {
        CommonHelper.ErrorToaster(response.Message);
      }
    } catch (error) {
      CommonHelper.ErrorToaster('Failed to update vehicle type status');
    } finally {
      CommonHelper.Hidespinner();
    }
  });
};

// Watchers
watch(searchQuery, () => {
  tablePagination.page = 1; // Reset to first page when searching
});

// Lifecycle
onMounted(() => {
  fetchVehicleTypes();
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
.vehicle-types-table {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
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