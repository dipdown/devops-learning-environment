<template>
  <div>
    <div class="surface-card p-4 shadow-2 border-round">
      <div class="text-3xl font-medium text-900 mb-3">Welcome!</div>
      <div class="font-medium text-500 mb-3">Please sign in to continue</div>
      
      <div v-if="errorMessage" class="p-error mt-3 mb-3">{{ errorMessage }}</div>
      
      <div>
        <label for="email" class="block text-900 font-medium mb-2">Email</label>
        <InputText id="email" v-model="email" type="text" placeholder="Email address" class="w-full mb-3" :class="{'p-invalid': emailError}" />
        <small v-if="emailError" class="p-error">{{ emailError }}</small>
        
        <label for="password" class="block text-900 font-medium mb-2">Password</label>
        <InputText id="password" v-model="password" type="password" placeholder="Password" class="w-full mb-3" :class="{'p-invalid': passwordError}" />
        <small v-if="passwordError" class="p-error">{{ passwordError }}</small>
        
        <div class="flex align-items-center justify-content-between mb-6">
          <div class="flex align-items-center">
            <Checkbox id="rememberme" v-model="rememberMe" binary class="mr-2" />
            <label for="rememberme">Remember me</label>
          </div>
          <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Forgot password?</a>
        </div>
        
        <Button label="Sign In" icon="pi pi-user" class="w-full" :loading="loading" @click="login" />
        
        <div class="mt-6 text-center text-600">
          Don't have an account? 
          <router-link to="/auth/register" class="font-medium text-blue-500">Register</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';

export default {
  components: {
    Button,
    InputText,
    Checkbox
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    
    const email = ref('');
    const password = ref('');
    const rememberMe = ref(false);
    const loading = ref(false);
    const errorMessage = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    
    const validateForm = () => {
      let isValid = true;
      emailError.value = '';
      passwordError.value = '';
      
      if (!email.value) {
        emailError.value = 'Email is required';
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
        emailError.value = 'Email format is invalid';
        isValid = false;
      }
      
      if (!password.value) {
        passwordError.value = 'Password is required';
        isValid = false;
      }
      
      return isValid;
    };
    
    const login = async () => {
      if (!validateForm()) return;
      
      loading.value = true;
      errorMessage.value = '';
      
      try {
        const success = await authStore.login({
          email: email.value,
          password: password.value
        });
        
        if (success) {
          router.push('/');
        } else {
          errorMessage.value = authStore.error || 'Failed to login';
        }
      } catch (error) {
        errorMessage.value = error.message || 'An error occurred during login';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      email,
      password,
      rememberMe,
      loading,
      errorMessage,
      emailError,
      passwordError,
      login
    };
  }
};
</script>

<style scoped>
.surface-card {
  max-width: 30rem;
  margin: 2rem auto;
}
</style>
