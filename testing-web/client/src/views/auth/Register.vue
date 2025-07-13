<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Sign Up</div>
                        <span class="text-600 font-medium">Sign up to get started</span>
                    </div>

                    <div>
                        <div class="field">
                            <label for="name" class="block text-900 text-xl font-medium mb-2">Name</label>
                            <InputText id="name" v-model="user.name" type="text" placeholder="Name" class="w-full md:w-30rem mb-5" style="padding: 1rem" />
                        </div>

                        <div class="field">
                            <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
                            <InputText id="email" v-model="user.email" type="email" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" />
                        </div>

                        <div class="field">
                            <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
                            <Password id="password" v-model="user.password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                        </div>

                        <div class="field">
                            <label for="confirmPassword" class="block text-900 font-medium text-xl mb-2">Confirm Password</label>
                            <Password id="confirmPassword" v-model="user.confirmPassword" placeholder="Confirm Password" :toggleMask="true" class="w-full mb-5" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                        </div>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="agreedToTerms" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">I agree to the terms and conditions</label>
                            </div>
                        </div>
                        <Button label="Sign Up" class="w-full p-3 text-xl" @click="register"></Button>
                    </div>

                    <div class="text-center mt-5">
                        <span class="text-600 font-medium">Already have an account? </span>
                        <router-link to="/login" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Sign In</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'Register',
    setup() {
        const router = useRouter();
        const user = ref({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        const agreedToTerms = ref(false);

        const register = () => {
            if (!agreedToTerms.value) {
                alert('Please agree to the terms and conditions');
                return;
            }

            if (user.value.password !== user.value.confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            // Simulate registration API call
            console.log('User registered:', user.value);
            alert('Registration successful!');
            router.push('/login');
        };

        return {
            user,
            agreedToTerms,
            register
        };
    }
};
</script>

<style scoped>
.min-h-screen {
    min-height: 100vh;
}

.min-w-screen {
    min-width: 100vw;
}
</style>
