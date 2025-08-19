<!-- src/pages/AccessDenied.vue -->
<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <q-icon name="error_outline" color="negative" size="80px" />
      <div class="text-h4 q-mt-md">Access Denied</div>
      <div class="text-subtitle1 q-mt-sm">You don't have permission to access this page.</div>
      <q-btn 
        color="primary" 
        label="Go to Dashboard" 
        class="q-mt-lg"
        @click="goToDashboard"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const goToDashboard = () => {
  router.push(authStore.landingPage)
}
</script>