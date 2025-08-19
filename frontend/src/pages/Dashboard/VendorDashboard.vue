<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="text-h4 q-mb-lg text-primary text-weight-bold">Vendor Dashboard</div>
    <!-- Stats Cards - Matching Admin Design -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="text-center shadow-3 rounded-borders" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-sm">Accepted Requirements</div>
            <div class="text-h3 text-weight-bold text-primary">{{ stats.accepted_requirements }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="text-center shadow-3 rounded-borders" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-sm">Pending Quotes</div>
            <div class="text-h3 text-weight-bold text-orange">{{ stats.pending_quotes }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="text-center shadow-3 rounded-borders" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-sm">Active Bookings</div>
            <div class="text-h3 text-weight-bold text-positive">{{ stats.active_bookings }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="text-center shadow-3 rounded-borders" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-sm">Pending Deliveries</div>
            <div class="text-h3 text-weight-bold text-negative">{{ stats.pending_deliveries }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Quick Actions Section -->
    <q-card flat bordered class="shadow-3 rounded-borders q-mb-xl">
      <q-card-section class="q-pa-lg">
        <div class="text-h6 text-primary text-weight-bold">Quick Actions</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-lg">
        <div class="row q-gutter-md">
          <q-btn color="primary" icon="list" label="Requirements" @click="viewRequirements" size="md" class="q-px-md" />
          <q-btn color="secondary" icon="description" label="My Quotes" @click="viewQuotes" size="md" class="q-px-md" />
          <q-btn color="accent" icon="event" label="Bookings" @click="viewBookings" size="md" class="q-px-md" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Requirements Section - Matching Admin Table Design -->
    <q-card flat bordered class="shadow-3 rounded-borders">
      <q-card-section class="q-pa-lg">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6 text-primary text-weight-bold">Recent Requirements</div>
          <div class="row q-gutter-sm items-center">
            <q-input 
              v-model="dateRange.start" 
              type="date" 
              label="Start Date" 
              dense 
              outlined 
              style="width: 150px;"
              class="q-mr-sm"
            />
            <q-input 
              v-model="dateRange.end" 
              type="date" 
              label="End Date" 
              dense 
              outlined 
              style="width: 150px;"
              class="q-mr-sm"
            />
            <q-btn 
              color="primary" 
              dense 
              label="Filter" 
              @click="fetchRequirements"
              class="q-mr-sm"
            />
            <q-btn 
              flat 
              dense 
              label="Clear" 
              @click="clearDateFilter"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-lg">
        <q-table
          :rows="recentRequirements"
          :columns="requirementColumns"
          row-key="id"
          :loading="loading"
          flat
          bordered
          class="clean-table"
          :rows-per-page-options="[10, 25, 50]"
          rows-per-page-label="Rows per page:"
        >
          <template v-slot:body-cell-requirement_status="props">
            <q-td :props="props" class="text-center">
              <q-chip 
                :color="getStatusColor(props.row.requirement_status)" 
                text-color="white" 
                size="sm"
                class="text-weight-medium"
              >
                {{ props.row.requirement_status }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <q-btn 
                flat 
                round 
                color="primary" 
                icon="visibility" 
                size="sm" 
                @click="viewRequirement(props.row.id)"
              >
                <q-tooltip>View Requirement</q-tooltip>
              </q-btn>
              <q-btn 
                v-if="props.row.requirement_status === 'ASSIGNED_TO_VENDOR'" 
                flat 
                round 
                color="green" 
                icon="edit" 
                size="sm" 
                @click="submitQuote(props.row.id)"
                class="q-ml-xs"
              >
                <q-tooltip>Submit Quote</q-tooltip>
              </q-btn>
            </q-td>
          </template>
          <template v-slot:no-data>
            <div class="full-width row flex-center text-grey q-gutter-sm q-pa-lg">
              <q-icon size="2em" name="sentiment_dissatisfied" />
              <span class="text-subtitle1">No requirements found</span>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { CommonService } from '@/services/CommonService';

const router = useRouter();
const loading = ref(false);
const dateRange = ref({
  start: '',
  end: ''
});

// Default stats
const stats = ref({
  accepted_requirements: 0,
  pending_quotes: 0,
  active_bookings: 0,
  pending_deliveries: 0
});

const recentRequirements = ref([]);

// Table columns matching admin design
const requirementColumns = [
  { 
    name: 'requirement_number', 
    label: 'Req #', 
    field: 'requirement_number', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;'
  },
  { 
    name: 'order_number', 
    label: 'Order #', 
    field: 'order_number', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;'
  },
  { 
    name: 'created_on', 
    label: 'Date', 
    field: 'created_on', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;'
  },
  { 
    name: 'requirement_status', 
    label: 'Status', 
    field: 'requirement_status', 
    align: 'center',
    headerStyle: 'font-weight: bold;'
  },
  { 
    name: 'actions', 
    label: 'Actions', 
    field: 'actions', 
    align: 'center',
    headerStyle: 'font-weight: bold;'
  }
];

// Status chip colors
const getStatusColor = (status) => {
  const colors = {
    'ASSIGNED_TO_VENDOR': 'orange',
    'QUOTED': 'blue',
    'CUSTOMER_QUOTE_CREATED': 'purple',
    'QUOTE_ACCEPTED': 'green',
    'BOOKING_CREATED': 'teal'
  };
  return colors[status] || 'grey';
};

// Navigation
const viewRequirements = () => router.push('/requirements');
const viewQuotes = () => router.push('/quotes');
const viewBookings = () => router.push('/bookings');
const viewRequirement = (id) => router.push(`/requirements/${id}`);
const submitQuote = (id) => router.push(`/quotes/create/${id}`);

// Clear date filter
const clearDateFilter = () => {
  dateRange.value.start = '';
  dateRange.value.end = '';
  fetchRequirements();
};

// Fetch data from backend
const fetchDashboardData = async () => {
  loading.value = true;
  try {
    // Fetch stats
    const statsResponse = await CommonService.GetAll('/v1/VendorDashboard/stats');
    stats.value = statsResponse;
    
    // Fetch recent requirements
    fetchRequirements();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

// Fetch requirements with optional date filtering
const fetchRequirements = async () => {
  loading.value = true;
  try {
    let url = '/v1/VendorDashboard/recent-requirements';
    if (dateRange.value.start && dateRange.value.end) {
      url += `?startDate=${dateRange.value.start}&endDate=${dateRange.value.end}`;
    }
    const requirementsResponse = await CommonService.GetAll(url);
    recentRequirements.value = requirementsResponse;
  } catch (error) {
    console.error('Error fetching requirements:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDashboardData);
</script>

<style scoped>
.clean-table {
  border-radius: 8px;
  overflow: hidden;
}
.clean-table .q-table__top,
.clean-table .q-table__bottom {
  padding: 12px 16px;
}
.clean-table th {
  background-color: #f5f5f5;
  color: #1976d2;
  font-weight: bold;
}
.clean-table td {
  padding: 12px 16px;
}
.clean-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}
.clean-table tbody tr:hover {
  background-color: #e3f2fd;
}
.rounded-borders {
  border-radius: 8px;
}
.shadow-3 {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>