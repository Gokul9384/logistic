<template>
  <div class="login-form-section">
    <!-- Header Section -->
    <div class="auth-header">
      <div class="header-content">
        <h1 class="auth-title">{{ isLoginMode ? 'Welcome Back' : 'Create Account' }}</h1>
        <p class="auth-subtitle">
          {{ isLoginMode ? 'Sign in to access your dashboard' : 'Join our platform and get started today' }}
        </p>
      </div>
      <!-- Mode Switcher -->
      <div class="mode-switcher">
        <button class="mode-btn" :class="{ active: isLoginMode }" @click="switchToLogin">
          <q-icon name="login" class="btn-icon" />
          Sign In
        </button>
        <button class="mode-btn" :class="{ active: !isLoginMode }" @click="switchToSignup">
          <q-icon name="person_add" class="btn-icon" />
          Sign Up
        </button>
      </div>
    </div>
    <!-- Form Section -->
    <div class="form-section">
      <!-- Compact User Type Selection (for Signup) -->
      <transition name="slide-fade" mode="out-in">
        <div v-if="!isLoginMode" class="user-type-section" key="user-type">
          <div class="section-label">Choose Account Type</div>
          <div class="compact-user-type">
            <button class="compact-type-btn" :class="{ active: isCustomerSignup }" @click="selectUserType(true)">
              <q-icon name="person" size="1rem" />
              Customer
            </button>
            <button class="compact-type-btn" :class="{ active: !isCustomerSignup }" @click="selectUserType(false)">
              <q-icon name="business" size="1rem" />
              Vendor
            </button>
          </div>
        </div>
      </transition>
      <!-- Forms Container -->
      <div class="forms-container">
        <!-- Login Form -->
        <transition name="form-slide" mode="out-in">
          <form v-if="isLoginMode" @submit.prevent="submitForm" class="auth-form" key="login">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <div class="input-wrapper">
                  <q-icon name="email" class="input-icon" />
                  <input v-model="userData.email" type="email" class="form-input"
                    :class="{ error: validationErrors.email }" placeholder="Enter your email" />
                </div>
                <transition name="error-fade">
                  <div v-if="validationErrors.email" class="error-message">
                    {{ validationErrors.email }}
                  </div>
                </transition>
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <div class="input-wrapper">
                  <q-icon name="lock" class="input-icon" />
                  <input v-model="userData.password" :type="showPassword ? 'text' : 'password'" class="form-input"
                    :class="{ error: validationErrors.password }" placeholder="Enter your password" />
                  <button type="button" class="password-toggle" @click="togglePassword">
                    <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" />
                  </button>
                </div>
                <transition name="error-fade">
                  <div v-if="validationErrors.password" class="error-message">
                    {{ validationErrors.password }}
                  </div>
                </transition>
              </div>
            </div>
            <div class="form-footer">
              <a href="#" class="forgot-link" @click.prevent="handleForgotPassword">
                Forgot your password?
              </a>
            </div>
            <button type="submit" class="submit-btn" :disabled="isLoading">
              <q-icon v-if="isLoading" name="refresh" class="spinning" />
              <span>{{ isLoading ? 'Signing In...' : 'Sign In' }}</span>
            </button>
          </form>
          <!-- Customer Signup Form -->
          <form v-else-if="isCustomerSignup" @submit.prevent="submitCustomerSignup" class="auth-form" key="customer">
            <div class="form-grid">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <div class="input-wrapper">
                    <q-icon name="person" class="input-icon" />
                    <input v-model="customerData.name" type="text" class="form-input"
                      :class="{ error: customerValidationErrors.name }" placeholder="Enter your full name" />
                  </div>
                  <transition name="error-fade">
                    <div v-if="customerValidationErrors.name" class="error-message">
                      {{ customerValidationErrors.name }}
                    </div>
                  </transition>
                </div>
                <div class="form-group">
                  <label class="form-label">Mobile Number</label>
                  <div class="input-wrapper">
                    <q-icon name="phone" class="input-icon" />
                    <input v-model="customerData.mobile" type="tel" class="form-input"
                      :class="{ error: customerValidationErrors.mobile }" placeholder="Enter mobile number" />
                  </div>
                  <transition name="error-fade">
                    <div v-if="customerValidationErrors.mobile" class="error-message">
                      {{ customerValidationErrors.mobile }}
                    </div>
                  </transition>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <div class="input-wrapper">
                  <q-icon name="email" class="input-icon" />
                  <input v-model="customerData.email" type="email" class="form-input"
                    :class="{ error: customerValidationErrors.email }" placeholder="Enter your email" />
                </div>
                <transition name="error-fade">
                  <div v-if="customerValidationErrors.email" class="error-message">
                    {{ customerValidationErrors.email }}
                  </div>
                </transition>
              </div>
              <div class="form-group">
                <label class="form-label">Address</label>
                <div class="input-wrapper">
                  <q-icon name="location_on" class="input-icon" />
                  <input v-model="customerData.address" type="text" class="form-input"
                    :class="{ error: customerValidationErrors.address }" placeholder="Enter your address" />
                </div>
                <transition name="error-fade">
                  <div v-if="customerValidationErrors.address" class="error-message">
                    {{ customerValidationErrors.address }}
                  </div>
                </transition>
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <div class="input-wrapper">
                  <q-icon name="lock" class="input-icon" />
                  <input v-model="customerData.password" :type="showPassword ? 'text' : 'password'" class="form-input"
                    :class="{ error: customerValidationErrors.password }" placeholder="Create a password" />
                  <button type="button" class="password-toggle" @click="togglePassword">
                    <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" />
                  </button>
                </div>
                <transition name="error-fade">
                  <div v-if="customerValidationErrors.password" class="error-message">
                    {{ customerValidationErrors.password }}
                  </div>
                </transition>
              </div>
            </div>
            <button type="submit" class="submit-btn" :disabled="isCustomerLoading">
              <q-icon v-if="isCustomerLoading" name="refresh" class="spinning" />
              <span>{{ isCustomerLoading ? 'Creating Account...' : 'Create Customer Account' }}</span>
            </button>
          </form>
          <!-- Vendor Signup Form -->
          <form v-else @submit.prevent="submitVendorSignup" class="auth-form" key="vendor">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Company Name</label>
                <div class="input-wrapper">
                  <q-icon name="business" class="input-icon" />
                  <input v-model="vendorData.company_name" type="text" class="form-input"
                    :class="{ error: vendorValidationErrors.company_name }" placeholder="Enter company name" />
                </div>
                <transition name="error-fade">
                  <div v-if="vendorValidationErrors.company_name" class="error-message">
                    {{ vendorValidationErrors.company_name }}
                  </div>
                </transition>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <div class="input-wrapper">
                    <q-icon name="email" class="input-icon" />
                    <input v-model="vendorData.email" type="email" class="form-input"
                      :class="{ error: vendorValidationErrors.email }" placeholder="Enter email" />
                  </div>
                  <transition name="error-fade">
                    <div v-if="vendorValidationErrors.email" class="error-message">
                      {{ vendorValidationErrors.email }}
                    </div>
                  </transition>
                </div>
                <div class="form-group">
                  <label class="form-label">Mobile Number</label>
                  <div class="input-wrapper">
                    <q-icon name="phone" class="input-icon" />
                    <input v-model="vendorData.mobile" type="tel" class="form-input"
                      :class="{ error: vendorValidationErrors.mobile }" placeholder="Enter mobile" />
                  </div>
                  <transition name="error-fade">
                    <div v-if="vendorValidationErrors.mobile" class="error-message">
                      {{ vendorValidationErrors.mobile }}
                    </div>
                  </transition>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Address</label>
                <div class="input-wrapper">
                  <q-icon name="location_on" class="input-icon" />
                  <input v-model="vendorData.address" type="text" class="form-input"
                    :class="{ error: vendorValidationErrors.address }" placeholder="Enter address" />
                </div>
                <transition name="error-fade">
                  <div v-if="vendorValidationErrors.address" class="error-message">
                    {{ vendorValidationErrors.address }}
                  </div>
                </transition>
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <div class="input-wrapper">
                  <q-icon name="lock" class="input-icon" />
                  <input v-model="vendorData.password" :type="showPassword ? 'text' : 'password'" class="form-input"
                    :class="{ error: vendorValidationErrors.password }" placeholder="Create a password" />
                  <button type="button" class="password-toggle" @click="togglePassword">
                    <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" />
                  </button>
                </div>
                <transition name="error-fade">
                  <div v-if="vendorValidationErrors.password" class="error-message">
                    {{ vendorValidationErrors.password }}
                  </div>
                </transition>
              </div>
            </div>
            <button type="submit" class="submit-btn" :disabled="isVendorLoading">
              <q-icon v-if="isVendorLoading" name="refresh" class="spinning" />
              <span>{{ isVendorLoading ? 'Creating Account...' : 'Create Vendor Account' }}</span>
            </button>
          </form>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { CommonHelper } from '@/helpers/CommonHelper'
import { CommonService } from '@/services/CommonService'
import { jwtDecode } from 'jwt-decode'

const router = useRouter()
const authStore = useAuthStore()

// UI States
const showPassword = ref(false)
const isLoading = ref(false)
const isCustomerLoading = ref(false)
const isVendorLoading = ref(false)
const isLoginMode = ref(true)
const isCustomerSignup = ref(true)

// Login Form Data
const userData = reactive({
  email: '',
  password: ''
})

// Customer Signup Data
const customerData = reactive({
  id: '',
  status: true,
  name: '',
  address: '',
  email: '',
  password: '',
  mobile: ''
})

// Vendor Signup Data
const vendorData = reactive({
  id: '',
  status: true,
  company_name: '',
  address: '',
  email: '',
  password: '',
  mobile: ''
})

// Validation Errors
const validationErrors = ref<any>({})
const customerValidationErrors = ref<any>({})
const vendorValidationErrors = ref<any>({})

// Validation Rules
const loginValidationRules = [
  {
    name: 'email',
    validation: [
      { type: 'required', message: 'Please enter email' },
      { type: 'email', message: 'Please enter a valid email' }
    ]
  },
  {
    name: 'password',
    validation: [
      { type: 'required', message: 'Please enter password' }
    ]
  }
]

const customerValidationRules = [
  {
    name: 'name',
    validation: [
      { type: 'required', message: 'Please enter your full name' }
    ]
  },
  {
    name: 'email',
    validation: [
      { type: 'required', message: 'Please enter email' },
      { type: 'email', message: 'Please enter a valid email' }
    ]
  },
  {
    name: 'mobile',
    validation: [
      { type: 'required', message: 'Please enter mobile number' }
    ]
  },
  {
    name: 'address',
    validation: [
      { type: 'required', message: 'Please enter address' }
    ]
  },
  {
    name: 'password',
    validation: [
      { type: 'required', message: 'Please enter password' },
      { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' }
    ]
  }
]

const vendorValidationRules = [
  {
    name: 'company_name',
    validation: [
      { type: 'required', message: 'Please enter company name' }
    ]
  },
  {
    name: 'email',
    validation: [
      { type: 'required', message: 'Please enter email' },
      { type: 'email', message: 'Please enter a valid email' }
    ]
  },
  {
    name: 'mobile',
    validation: [
      { type: 'required', message: 'Please enter mobile number' }
    ]
  },
  {
    name: 'address',
    validation: [
      { type: 'required', message: 'Please enter address' }
    ]
  },
  {
    name: 'password',
    validation: [
      { type: 'required', message: 'Please enter password' },
      { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' }
    ]
  }
]

// Helper Methods
const switchToLogin = () => {
  isLoginMode.value = true
  clearErrors()
}

const switchToSignup = () => {
  isLoginMode.value = false
  clearErrors()
}

const selectUserType = (isCustomer: boolean) => {
  isCustomerSignup.value = isCustomer
  clearErrors()
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const clearErrors = () => {
  validationErrors.value = {}
  customerValidationErrors.value = {}
  vendorValidationErrors.value = {}
}

const handleForgotPassword = () => {
  // Handle forgot password logic
  console.log('Forgot password clicked')
}

// Login Form Submission
const submitForm = async () => {
  isLoading.value = true
  try {
    CommonHelper.Showspinner()
    const validation = CommonHelper.FormValidation(loginValidationRules, userData)
    validationErrors.value = validation.errors
    
    if (!validation.isValid) {
      isLoading.value = false
      CommonHelper.Hidespinner()
      return
    }

    const res = await CommonService.CommonPost(userData, '/v1/Auth/Login')
     console.log("Response Data:", res);
    if (res.Type === 'S') {
      CommonHelper.SuccessToaster('Login Successfully')
      
      const decodedToken: any = jwtDecode(res?.result?.api_token ?? '')
      const userSessionData = {
        ...decodedToken,
        ...res.result,
        Ip: res.Ip
      }
      
      // Set user data in store first
      authStore.setUser(userSessionData)
      
      const userType = userSessionData.user_role_code
      const isProfileUpdated = userSessionData.is_profile_updated
      
      // Handle different user types
      if (userType === 'C' || userType === 'V') {
        // For Customer and Vendor - check profile update status
        if (!isProfileUpdated) {
          let redirectId: number | null = null
          
          if (userType === 'C') {
            const customerResponse = await CommonService.GetAll('/v1/Customer/List')
            if (customerResponse) {
              const customerMatch = customerResponse.find((o: { user_id: number; id: number }) => 
                o.user_id === userSessionData.user_id
              )
              if (customerMatch) redirectId = customerMatch.id
            }
            
            if (redirectId) {
              await router.push(`/customers/${redirectId}`)
              return
            }
          } else if (userType === 'V') {
            const vendorResponse = await CommonService.GetAll('/v1/Vendor/List')
            if (vendorResponse) {
              const vendorMatch = vendorResponse.find((o: { user_id: number; id: number }) => 
                o.user_id === userSessionData.user_id
              )
              if (vendorMatch) redirectId = vendorMatch.id
            }
            
            if (redirectId) {
              await router.push(`/vendors/${redirectId}`)
              return
            }
          }
        }
      }
      
      // For all other cases (Admin, Driver, or profile already updated)
      const landingPage = userSessionData.user_role_landing_page || '/admin_dashboard'
      await router.push(landingPage)
      
    } else {
      CommonHelper.ErrorToaster(res.Message || 'Login failed')
    }
    
  } catch (err) {
    console.error('Login failed:', err)
    CommonHelper.ErrorToaster('Login failed. Please try again.')
  } finally {
    CommonHelper.Hidespinner()
    isLoading.value = false
  }
}

// Customer Signup Form Submission
const submitCustomerSignup = async () => {
  isCustomerLoading.value = true
  try {
    CommonHelper.Showspinner()
    const validation = CommonHelper.FormValidation(customerValidationRules, customerData)
    customerValidationErrors.value = validation.errors
    if (!validation.isValid) {
      isCustomerLoading.value = false
      CommonHelper.Hidespinner()
      return
    }
    const res = await CommonService.CommonPost(customerData, '/v1/Auth/CustomerSignUp')
    if (res.Type === 'S') {
      CommonHelper.SuccessToaster('Account created successfully')
      // Reset form with proper typing
      const customerKeysToReset: (keyof typeof customerData)[] = [
        'id', 'name', 'address', 'email', 'password', 'mobile'
      ]
      customerKeysToReset.forEach(key => {
        if (key !== 'status') {
          customerData[key] = ''
        }
      })
      // Switch to login mode
      switchToLogin()
    } else {
      CommonHelper.ErrorToaster(res.Message || 'Registration failed')
    }
  } catch (error) {
    console.error('Customer registration error:', error)
    CommonHelper.ErrorToaster('An error occurred during registration')
  } finally {
    isCustomerLoading.value = false
    CommonHelper.Hidespinner()
  }
}

// Vendor Signup Form Submission
const submitVendorSignup = async () => {
  isVendorLoading.value = true
  try {
    CommonHelper.Showspinner()
    const validation = CommonHelper.FormValidation(vendorValidationRules, vendorData)
    vendorValidationErrors.value = validation.errors
    if (!validation.isValid) {
      isVendorLoading.value = false
      CommonHelper.Hidespinner()
      return
    }
    const res = await CommonService.CommonPost(vendorData, '/v1/Auth/VendorSignUp')
    if (res.Type === 'S') {
      CommonHelper.SuccessToaster('Account created successfully')
      // Reset form with proper typing
      const vendorKeysToReset: (keyof typeof vendorData)[] = [
        'id', 'company_name', 'address', 'email', 'password', 'mobile'
      ]
      vendorKeysToReset.forEach(key => {
        if (key !== 'status') {
          vendorData[key] = ''
        }
      })
      // Switch to login mode
      switchToLogin()
    } else {
      CommonHelper.ErrorToaster(res.Message || 'Registration failed')
    }
  } catch (error) {
    console.error('Vendor registration error:', error)
    CommonHelper.ErrorToaster('An error occurred during registration')
  } finally {
    isVendorLoading.value = false
    CommonHelper.Hidespinner()
  }
}
</script>

<style scoped>
.login-form-section {
  max-width: 480px;
  margin: 0 auto;
  padding: 1.5rem;
  background: transparent;
  /* Remove fixed height to allow scrolling */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* Remove overflow hidden to allow page scrolling */
}

.auth-header {
  text-align: center;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.mode-switcher {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  max-width: 300px;
  margin: 0 auto;
}

.mode-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  background: #f5f5f5;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.mode-btn.active {
  background: #1976d2;
  color: white;
}

.btn-icon {
  font-size: 1.2rem;
}

.form-section {
  /* Remove flex: 1 and overflow: hidden to allow natural scrolling */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.section-label {
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #333;
  font-size: 0.9rem;
}

.compact-user-type {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.compact-type-btn {
  flex: 1;
  padding: 0.75rem;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.compact-type-btn:hover {
  border-color: #1976d2;
}

.compact-type-btn.active {
  background: rgba(25, 118, 210, 0.1);
  border-color: #1976d2;
  color: #1976d2;
}

.forms-container {
  /* Remove flex: 1 and overflow-y: auto to allow natural scrolling */
  flex-grow: 1;
}

.forms-container::-webkit-scrollbar {
  width: 4px;
}

.forms-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.forms-container::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 10px;
}

.forms-container::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

.auth-form {
  display: flex;
  flex-direction: column;
  /* Remove height: 100% to allow natural height */
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: #333;
  font-size: 0.9rem;
}

.optional {
  font-weight: normal;
  color: #666;
  font-size: 0.8rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  color: #666;
  font-size: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.2rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-input.error {
  border-color: #f44336;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
}

.error-message {
  color: #f44336;
  font-size: 0.75rem;
  margin-top: 0.2rem;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.3rem;
  margin-bottom: 1rem;
}

.forgot-link {
  color: #1976d2;
  text-decoration: none;
  font-size: 0.8rem;
}

.forgot-link:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 80%;
  padding: 0.75rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  margin: 1rem auto 0 auto;
}

.submit-btn:hover {
  background: #1565c0;
}

.submit-btn:disabled {
  background: #90caf9;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.form-slide-enter-active,
.form-slide-leave-active {
  transition: all 0.3s ease;
}

.form-slide-enter-from,
.form-slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.2s ease;
}

.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .compact-user-type {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .login-form-section {
    padding: 1rem;
    /* Remove height constraints */
    min-height: 100vh;
  }
  

}

/* Additional mobile improvements */
@media (max-width: 480px) {
  .login-form-section {
    padding: 0.75rem;
    max-width: 100%;
    min-height: 100vh;
  }
  
  .auth-title {
    font-size: 1.5rem;
  }
  
  .auth-subtitle {
    font-size: 0.85rem;
  }
  
  .mode-switcher {
    max-width: 100%;
  }
  
  .mode-btn {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }
  
  .btn-icon {
    font-size: 1rem;
  }
  
  .form-label {
    font-size: 0.85rem;
  }
  
  .form-input {
    padding: 0.65rem 1rem 0.65rem 2.2rem;
    font-size: 0.85rem;
  }
  
  .input-icon {
    left: 0.65rem;
    font-size: 0.9rem;
  }
  
  .password-toggle {
    right: 0.65rem;
  }
  
  .submit-btn {
    width: 100%;
    padding: 0.8rem;
    font-size: 0.9rem;
  }
  
  .forgot-link {
    font-size: 0.75rem;
  }
  
  .error-message {
    font-size: 0.7rem;
  }
}

@media (max-width: 360px) {
  .login-form-section {
    padding: 0.5rem;
    min-height: 100vh;
  }
  
  .auth-title {
    font-size: 1.3rem;
  }
  
  .auth-subtitle {
    font-size: 0.8rem;
    margin-bottom: 0.8rem;
  }
  
  .mode-btn {
    padding: 0.5rem 0.7rem;
    font-size: 0.8rem;
  }
  
  .btn-icon {
    font-size: 0.9rem;
  }
  
  .form-grid {
    gap: 0.8rem;
  }
  
  .form-label {
    font-size: 0.8rem;
    margin-bottom: 0.3rem;
  }
  
  .form-input {
    padding: 0.6rem 1rem 0.6rem 2rem;
    font-size: 0.8rem;
  }
  
  .input-icon {
    left: 0.6rem;
    font-size: 0.85rem;
  }
  
  .password-toggle {
    right: 0.6rem;
  }
  
  .submit-btn {
    padding: 0.7rem;
    font-size: 0.85rem;
  }
}
</style>