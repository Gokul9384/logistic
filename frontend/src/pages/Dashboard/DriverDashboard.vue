<!-- src/pages/Dashboard/DriverDashboard.vue -->
<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="text-h4 q-mb-lg text-primary text-weight-bold">Driver Dashboard</div>

    <!-- Stats Cards - Matching Admin Style -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="text-center shadow-3 rounded-borders" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-sm">Assigned Bookings</div>
            <div class="text-h3 text-weight-bold text-orange">{{ stats.assigned_booking }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="text-center shadow-3 rounded-borders" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-sm">Pending Deliveries</div>
            <div class="text-h3 text-weight-bold text-primary">{{ stats.pending_delivery }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="text-center shadow-3 rounded-borders" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-sm">In Transit</div>
            <div class="text-h3 text-weight-bold text-negative">{{ stats.in_transit }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="text-center shadow-3 rounded-borders" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-sm">Completed Today</div>
            <div class="text-h3 text-weight-bold text-positive">{{ stats.complete }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    
    <!-- Today's Schedule - Keep Original Beautiful Design -->
    <q-card class="modern-card q-mb-xl shadow-3 rounded-borders" flat bordered>
      <q-card-section class="card-header">
        <div class="row items-center justify-between">
          <div class="row items-center q-gutter-md">
            <div class="header-icon">
              <q-icon name="schedule" size="1.5rem" color="primary" />
            </div>
            <div>
              <div class="text-h6 text-primary text-weight-bold">Today's Schedule</div>
              <div class="text-caption text-grey-6">Manage your active deliveries</div>
            </div>
          </div>
          <div class="row q-gutter-sm items-center">
            <q-input 
              v-model="selectedDate" 
              type="date" 
              label="Select Date" 
              dense 
              outlined
              bg-color="white"
              style="width: 150px;"
              @update:model-value="fetchDashboardData"
            />
            <q-btn 
              color="primary" 
              dense
              label="Refresh" 
              icon="refresh"
              @click="fetchDashboardData"
              :loading="loading"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-xl">
        <div v-if="todayDeliveries.length > 0">
          <q-timeline color="primary" class="modern-timeline">
            <q-timeline-entry
              v-for="delivery in todayDeliveries"
              :key="delivery.order_number"
              :color="getStatusColor(getMappedStatus(delivery))"
              :icon="getStatusIcon(getMappedStatus(delivery))"
              class="timeline-entry"
            >
              <template v-slot:title>
                <div class="row items-center q-gutter-md">
                  <div class="text-h6 text-weight-bold">{{ formatPickupDateTime(delivery.pickup_date, delivery.pickup_time) }}</div>
                  <q-chip 
                    :color="getStatusColor(getMappedStatus(delivery))" 
                    text-color="white" 
                    size="md"
                    class="text-weight-medium status-chip"
                  >
                    {{ getMappedStatus(delivery) }}
                  </q-chip>
                </div>
              </template>
              
              <template v-slot:subtitle>
                <div class="text-weight-medium text-grey-7">{{ delivery.booking_number }}</div>
              </template>

              <q-card class="delivery-card" flat bordered>
                <q-card-section class="q-pa-lg">
                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-md-6">
                      <div class="location-item">
                        <div class="location-icon pickup-icon">
                          <q-icon name="place" size="1.2rem" />
                        </div>
                        <div>
                          <div class="text-caption text-weight-medium text-grey-6">PICKUP LOCATION</div>
                          <div class="text-body1 text-weight-bold text-grey-8">{{ delivery.source_location }}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-12 col-md-6">
                      <div class="location-item">
                        <div class="location-icon destination-icon">
                          <q-icon name="flag" size="1.2rem" />
                        </div>
                        <div>
                          <div class="text-caption text-weight-medium text-grey-6">DESTINATION</div>
                          <div class="text-body1 text-weight-bold text-grey-8">{{ delivery.destination_location }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <q-separator class="q-my-lg" />
                  
                  <div class="row q-gutter-md justify-end">
                    <!-- Start Delivery Button -->
                    <q-btn 
                      v-if="getMappedStatus(delivery) === DeliveryStatusEnum.Assigned" 
                      color="primary" 
                      dense
                      label="Start Delivery" 
                      icon="play_arrow"
                      @click="updateDeliveryStatus(delivery.delivery_id, delivery.order_id, DeliveryStatusEnum.Started)"
                      :loading="updatingStatus === delivery.delivery_id"
                    />
                    
                    <!-- Mark In Transit Button -->
                    <q-btn 
                      v-if="getMappedStatus(delivery) === DeliveryStatusEnum.Started" 
                      color="orange" 
                      dense
                      label="Mark In Transit" 
                      icon="local_shipping"
                      @click="updateDeliveryStatus(delivery.delivery_id, delivery.order_id, DeliveryStatusEnum.InTransit)"
                      :loading="updatingStatus === delivery.delivery_id"
                    />
                    
                    <!-- Complete Delivery Button -->
                    <q-btn 
                      v-if="getMappedStatus(delivery) === DeliveryStatusEnum.InTransit" 
                      color="green" 
                      dense
                      label="Complete Delivery" 
                      icon="check_circle"
                      @click="updateDeliveryStatus(delivery.delivery_id, delivery.order_id, DeliveryStatusEnum.Delivered)"
                      :loading="updatingStatus === delivery.delivery_id"
                    />
                    
                    <!-- View Details Button -->
                    <q-btn 
                      color="grey-7" 
                      dense
                      label="Details" 
                      icon="visibility"
                      outline
                      @click="viewDeliveryDetails(delivery.order_number)"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </q-timeline-entry>
          </q-timeline>
        </div>
        
        <!-- Enhanced Empty State -->
        <div v-else class="empty-state">
          <div class="empty-state-icon">
            <q-icon name="local_shipping" size="4rem" color="grey-4" />
          </div>
          <div class="text-h5 text-weight-bold text-grey-6 q-mt-md">No deliveries scheduled</div>
          <div class="text-body1 text-grey-5 q-mt-sm">You have no deliveries for the selected date</div>
        </div>
      </q-card-section>
    </q-card>

    <!-- All Deliveries Section - Admin Dashboard Style -->
    <q-card flat bordered class="shadow-3 rounded-borders">
      <q-card-section class="q-pa-lg">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6 text-primary text-weight-bold">All Deliveries</div>
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
              @click="fetchAllDeliveries"
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
          :rows="allDeliveries"
          :columns="deliveryColumns"
          row-key="delivery_id"
          :loading="deliveriesLoading"
          flat
          bordered
          class="clean-table"
          :rows-per-page-options="[10, 25, 50]"
          rows-per-page-label="Rows per page:"
        >
          <template v-slot:body-cell-delivery_status="props">
            <q-td :props="props" class="text-center">
              <q-chip 
                :color="getStatusColor(getMappedStatus(props.row))" 
                text-color="white" 
                size="sm"
                class="text-weight-medium"
              >
                {{ getMappedStatus(props.row) }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <div class="q-gutter-xs">
                <!-- Start Delivery Button -->
                <q-btn 
                  v-if="getMappedStatus(props.row) === DeliveryStatusEnum.Assigned" 
                  flat 
                  round 
                  color="primary" 
                  icon="play_arrow" 
                  size="sm" 
                  @click="updateDeliveryStatus(props.row.delivery_id, props.row.order_id, DeliveryStatusEnum.Started)"
                  :loading="updatingStatus === props.row.delivery_id"
                >
                  <q-tooltip>Start Delivery</q-tooltip>
                </q-btn>
                
                <!-- Mark In Transit Button -->
                <q-btn 
                  v-if="getMappedStatus(props.row) === DeliveryStatusEnum.Started" 
                  flat 
                  round 
                  color="orange" 
                  icon="local_shipping" 
                  size="sm" 
                  @click="updateDeliveryStatus(props.row.delivery_id, props.row.order_id, DeliveryStatusEnum.InTransit)"
                  :loading="updatingStatus === props.row.delivery_id"
                >
                  <q-tooltip>Mark In Transit</q-tooltip>
                </q-btn>
                
                <!-- Complete Delivery Button -->
                <q-btn 
                  v-if="getMappedStatus(props.row) === DeliveryStatusEnum.InTransit" 
                  flat 
                  round 
                  color="green" 
                  icon="check_circle" 
                  size="sm" 
                  @click="updateDeliveryStatus(props.row.delivery_id, props.row.order_id, DeliveryStatusEnum.Delivered)"
                  :loading="updatingStatus === props.row.delivery_id"
                >
                  <q-tooltip>Complete Delivery</q-tooltip>
                </q-btn>
                
                <q-btn 
                  flat 
                  round 
                  color="primary" 
                  icon="visibility" 
                  size="sm" 
                  @click="viewDeliveryDetails(props.row.order_number)"
                >
                  <q-tooltip>View Details</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center text-grey q-gutter-sm q-pa-lg">
              <q-icon size="2em" name="sentiment_dissatisfied" />
              <span class="text-subtitle1">No deliveries found</span>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    
    <!-- Enhanced Delivery Details Dialog -->
    <q-dialog v-model="showDetailsDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="dialog-card">
        <q-card-section class="dialog-header">
          <div class="row items-center">
            <div class="dialog-icon">
              <q-icon name="local_shipping" size="1.5rem" color="primary" />
            </div>
            <div class="q-ml-md">
              <div class="text-h5 text-weight-bold">Delivery Details</div>
              <div class="text-caption text-grey-6">Complete delivery information</div>
            </div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup color="grey-7" />
          </div>
        </q-card-section>
        
        <q-separator />
        
        <q-card-section v-if="selectedDelivery" class="q-pa-xl">
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-6">
              <q-card flat bordered class="info-card">
                <q-card-section class="q-pa-lg">
                  <div class="text-h6 text-weight-bold text-primary q-mb-md">Order Information</div>
                  <q-list>
                    <q-item>
                      <q-item-section>
                        <q-item-label overline class="text-weight-medium">Order Number</q-item-label>
                        <q-item-label class="text-h6 text-weight-bold">{{ selectedDelivery.order_number }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    
                    <q-item>
                      <q-item-section>
                        <q-item-label overline class="text-weight-medium">Booking Number</q-item-label>
                        <q-item-label class="text-body1">{{ selectedDelivery.booking_number }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    
                    <q-item>
                      <q-item-section>
                        <q-item-label overline class="text-weight-medium">Pickup Date & Time</q-item-label>
                        <q-item-label class="text-body1">{{ formatPickupDateTime(selectedDelivery.pickup_date, selectedDelivery.pickup_time) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    
                    <q-item>
                      <q-item-section>
                        <q-item-label overline class="text-weight-medium">Status</q-item-label>
                        <q-item-label>
                          <q-chip 
                            :color="getStatusColor(getMappedStatus(selectedDelivery))" 
                            text-color="white" 
                            size="md"
                            class="text-weight-medium"
                          >
                            {{ getMappedStatus(selectedDelivery) }}
                          </q-chip>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
            
            <div class="col-12 col-md-6">
              <q-card flat bordered class="info-card">
                <q-card-section class="q-pa-lg">
                  <div class="text-h6 text-weight-bold text-primary q-mb-md">Location Details</div>
                  <q-list>
                    <q-item>
                      <q-item-section>
                        <q-item-label overline class="text-weight-medium">Pickup Location</q-item-label>
                        <q-item-label class="text-body1">{{ selectedDelivery.source_location }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    
                    <q-item>
                      <q-item-section>
                        <q-item-label overline class="text-weight-medium">Destination</q-item-label>
                        <q-item-label class="text-body1">{{ selectedDelivery.destination_location }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    
                    <q-item v-if="selectedDelivery.start_time">
                      <q-item-section>
                        <q-item-label overline class="text-weight-medium">Start Time</q-item-label>
                        <q-item-label class="text-body1">{{ formatDateTime(selectedDelivery.start_time) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    
                    <q-item v-if="selectedDelivery.end_time">
                      <q-item-section>
                        <q-item-label overline class="text-weight-medium">End Time</q-item-label>
                        <q-item-label class="text-body1">{{ formatDateTime(selectedDelivery.end_time) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
          
          <q-separator class="q-my-xl" />
          
          <div class="row q-gutter-md justify-center">
            <!-- Start Delivery Button -->
            <q-btn 
              v-if="getMappedStatus(selectedDelivery) === DeliveryStatusEnum.Assigned" 
              color="primary" 
              label="Start Delivery" 
              icon="play_arrow"
              size="lg" 
              @click="updateDeliveryStatus(selectedDelivery.delivery_id, selectedDelivery.order_id, DeliveryStatusEnum.Started)"
              :loading="updatingStatus === selectedDelivery.delivery_id"
            />
            
            <!-- Mark In Transit Button -->
            <q-btn 
              v-if="getMappedStatus(selectedDelivery) === DeliveryStatusEnum.Started" 
              color="orange" 
              label="Mark In Transit" 
              icon="local_shipping"
              size="lg" 
              @click="updateDeliveryStatus(selectedDelivery.delivery_id, selectedDelivery.order_id, DeliveryStatusEnum.InTransit)"
              :loading="updatingStatus === selectedDelivery.delivery_id"
            />
            
            <!-- Complete Delivery Button -->
            <q-btn 
              v-if="getMappedStatus(selectedDelivery) === DeliveryStatusEnum.InTransit" 
              color="green" 
              label="Complete Delivery" 
              icon="check_circle"
              size="lg" 
              @click="updateDeliveryStatus(selectedDelivery.delivery_id, selectedDelivery.order_id, DeliveryStatusEnum.Delivered)"
              :loading="updatingStatus === selectedDelivery.delivery_id"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { CommonService } from '@/services/CommonService';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();

// Delivery Status Enum
const DeliveryStatusEnum = {
  Assigned: 'Assigned',
  Started: 'Started',
  InTransit: 'In Transit',
  Delivered: 'Delivered'
};

const loading = ref(false);
const deliveriesLoading = ref(false);
const updatingStatus = ref(null);
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const showDetailsDialog = ref(false);
const selectedDelivery = ref(null);

const dateRange = ref({
  start: '',
  end: ''
});

const stats = ref({
  assigned_booking: 0,
  pending_delivery: 0,
  in_transit: 0,
  complete: 0
});

const todayDeliveries = ref([]);
const allDeliveries = ref([]);
const driverId = ref(null);

// Delivery table columns
const deliveryColumns = [
  { 
    name: 'order_number', 
    label: 'Order #', 
    field: 'order_number', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;'
  },
  { 
    name: 'booking_number', 
    label: 'Booking #', 
    field: 'booking_number', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;'
  },
  { 
    name: 'pickup_datetime', 
    label: 'Pickup Date & Time', 
    field: (row) => formatPickupDateTime(row.pickup_date, row.pickup_time), 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;'
  },
  { 
    name: 'start_time', 
    label: 'Start Time', 
    field: 'start_time', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;',
    format: (val) => val ? formatDateTime(val) : 'N/A'
  },
  { 
    name: 'end_time', 
    label: 'End Time', 
    field: 'end_time', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;',
    format: (val) => val ? formatDateTime(val) : 'N/A'
  },
  { 
    name: 'source_location', 
    label: 'Source', 
    field: 'source_location', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;'
  },
  { 
    name: 'destination_location', 
    label: 'Destination', 
    field: 'destination_location', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;'
  },
  { 
    name: 'start_time', 
    label: 'Start Time', 
    field: 'start_time', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;',
    format: (val) => val ? formatDateTime(val) : 'N/A'
  },
  { 
    name: 'end_time', 
    label: 'End Time', 
    field: 'end_time', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;',
    format: (val) => val ? formatDateTime(val) : 'N/A'
  },
  { 
    name: 'source_location', 
    label: 'Source', 
    field: 'source_location', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;'
  },
  { 
    name: 'destination_location', 
    label: 'Destination', 
    field: 'destination_location', 
    sortable: true, 
    align: 'left',
    headerStyle: 'font-weight: bold;'
  },
  { 
    name: 'delivery_status', 
    label: 'Status', 
    field: 'delivery_status', 
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

// Get driver ID from local storage, auth store, or API response
const getCurrentDriverId = () => {
  const storedDriverId = localStorage.getItem('driver_id');
  if (storedDriverId) {
    return storedDriverId;
  }
  
  if (todayDeliveries.value.length > 0) {
    return todayDeliveries.value[0].driver_id;
  }
  
  return null;
};

// Map API status to our enum
const getMappedStatus = (delivery) => {
  if (delivery.delivery_status) {
    const statusMapping = {
      'Assigned': DeliveryStatusEnum.Assigned,
      'Started': DeliveryStatusEnum.Started,
      'In Transit': DeliveryStatusEnum.InTransit,
      'InTransit': DeliveryStatusEnum.InTransit,
      'Delivered': DeliveryStatusEnum.Delivered
    };
    return statusMapping[delivery.delivery_status] || DeliveryStatusEnum.Assigned;
  }
  
  if (delivery.booking_status === 'Confirmed') {
    return DeliveryStatusEnum.Assigned;
  }
  
  return DeliveryStatusEnum.Assigned;
};

const getStatusColor = (status) => {
  const colors = {
    [DeliveryStatusEnum.Assigned]: 'orange',
    [DeliveryStatusEnum.Started]: 'blue',
    [DeliveryStatusEnum.InTransit]: 'amber',
    [DeliveryStatusEnum.Delivered]: 'green'
  };
  return colors[status] || 'grey';
};

const getStatusIcon = (status) => {
  const icons = {
    [DeliveryStatusEnum.Assigned]: 'assignment',
    [DeliveryStatusEnum.Started]: 'play_circle',
    [DeliveryStatusEnum.InTransit]: 'local_shipping',
    [DeliveryStatusEnum.Delivered]: 'check_circle'
  };
  return icons[status] || 'help';
};

const formatPickupDateTime = (pickupDate, pickupTime) => {
  if (!pickupDate || !pickupTime) return 'N/A';
  try {
    // Combine date and time
    const dateStr = new Date(pickupDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return `${dateStr} ${pickupTime}`;
  } catch (error) {
    return `${pickupDate} ${pickupTime}`;
  }
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return dateTimeString;
  }
};

const viewDeliveryDetails = (orderNumber) => {
  selectedDelivery.value = allDeliveries.value.find(d => d.order_number === orderNumber) || 
                           todayDeliveries.value.find(d => d.order_number === orderNumber);
  showDetailsDialog.value = true;
};

const updateDeliveryStatus = async (deliveryId, orderId, newStatus) => {
  updatingStatus.value = deliveryId;
  
  try {
    const currentDriverId = getCurrentDriverId();
    
    if (!currentDriverId) {
      throw new Error('Driver ID not found. Please login again.');
    }
    
    const delivery = allDeliveries.value.find(d => d.delivery_id === deliveryId) ||
                    todayDeliveries.value.find(d => d.delivery_id === deliveryId);
    
    if (!delivery) {
      throw new Error('Delivery not found.');
    }
    
    const payload = {
      order_id: orderId,
      driver_id: currentDriverId,
      delivery_status: newStatus,
      start_time: newStatus === DeliveryStatusEnum.Started ? new Date().toISOString() : delivery.start_time,
      end_time: newStatus === DeliveryStatusEnum.Delivered ? new Date().toISOString() : delivery.end_time,
      proof_image: delivery.proof_image || "",
      signature: delivery.signature || ""
    };
    
    await CommonService.CommonPut(payload, `/v1/Delivery/Update/${deliveryId}`);
    
    $q.notify({
      type: 'positive',
      message: `Delivery status updated to ${newStatus}`,
      position: 'top'
    });
    
    await fetchDashboardData();
    await fetchAllDeliveries();
    
    if (showDetailsDialog.value) {
      showDetailsDialog.value = false;
    }
  } catch (error) {
    console.error('Error updating delivery status:', error);
    
    $q.notify({
      type: 'negative',
      message: `Failed to update delivery status: ${error.message || 'Unknown error'}`,
      position: 'top'
    });
  } finally {
    updatingStatus.value = null;
  }
};

const fetchDashboardData = async () => {
  loading.value = true;
  
  try {
    const statsResponse = await CommonService.GetAll(`/v1/DriverDashboard/getDriverStats`);
    stats.value = statsResponse;
    
    const deliveriesResponse = await CommonService.GetAll(`/v1/DriverDashboard/getDriverOrders?date=${selectedDate.value}`);
    todayDeliveries.value = deliveriesResponse;
    
    if (!driverId.value && deliveriesResponse.length > 0) {
      driverId.value = deliveriesResponse[0].driver_id;
      localStorage.setItem('driver_id', driverId.value);
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    $q.notify({
      type: 'negative',
      message: `Failed to fetch dashboard data: ${error.message || 'Unknown error'}`,
      position: 'top'
    });
  } finally {
    loading.value = false;
  }
};

const fetchAllDeliveries = async () => {
  deliveriesLoading.value = true;
  try {
    let url = '/v1/DriverDashboard/GetAllDeliverys';
    if (dateRange.value.start && dateRange.value.end) {
      url += `?startDate=${dateRange.value.start}&endDate=${dateRange.value.end}`;
    }
    const deliveriesResponse = await CommonService.GetAll(url);
    allDeliveries.value = deliveriesResponse;
  } catch (error) {
    console.error('Error fetching all deliveries:', error);
    $q.notify({
      type: 'negative',
      message: `Failed to fetch deliveries: ${error.message || 'Unknown error'}`,
      position: 'top'
    });
  } finally {
    deliveriesLoading.value = false;
  }
};

const clearDateFilter = () => {
  dateRange.value.start = '';
  dateRange.value.end = '';
  fetchAllDeliveries();
};

onMounted(() => {
  driverId.value = getCurrentDriverId();
  fetchDashboardData();
  fetchAllDeliveries();
});
</script>

<style scoped>
/* Admin Dashboard Matching Styles */
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

/* Keep Original Beautiful Today's Schedule Styles */
.modern-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
}

.card-header {
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(25, 118, 210, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modern-timeline {
  padding-left: 0;
}

.timeline-entry {
  margin-bottom: 2rem;
}

.delivery-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  background: white;
}

.delivery-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.location-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.location-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pickup-icon {
  background: rgba(255, 149, 0, 0.1);
  color: #ff9500;
}

.destination-icon {
  background: rgba(52, 199, 89, 0.1);
  color: #34c759;
}

.status-chip {
  font-weight: 600;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state-icon {
  display: inline-block;
  padding: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.04);
  margin-bottom: 16px;
}

/* Dialog Enhancements */
.dialog-card {
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 24px;
}

.dialog-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(25, 118, 210, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(0, 0, 0, 0.01);
}

/* Timeline specific styles */
.q-timeline__entry {
  padding-bottom: 32px;
}

.q-timeline__entry--icon .q-timeline__dot {
  font-size: 28px;
  width: 56px;
  height: 56px;
}

.q-timeline__entry .q-timeline__subtitle {
  margin-bottom: 16px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .location-item {
    padding: 12px;
    margin-bottom: 12px;
  }
  
  .delivery-card {
    margin-bottom: 16px;
  }
}
</style>