<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div class="card w-full p-8 text-center" style="max-width: 500px;">
                <div class="mb-5">
                    <i class="pi pi-exclamation-triangle text-6xl text-red-500 mb-3"></i>
                    <h1 class="text-900 text-6xl font-medium mb-2">{{ errorCode || '500' }}</h1>
                    <h2 class="text-900 text-2xl font-medium mb-2">{{ errorTitle || 'Something went wrong' }}</h2>
                    <p class="text-600 text-lg mb-5">{{ errorMessage || 'An unexpected error has occurred. Please try again later.' }}</p>
                </div>
                <div class="flex justify-content-center gap-3">
                    <Button label="Go to Dashboard" icon="pi pi-home" @click="goHome" class="p-button-outlined" />
                    <Button label="Try Again" icon="pi pi-refresh" @click="retry" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
    name: 'Error',
    setup() {
        const router = useRouter();
        const route = useRoute();
        
        const errorCode = ref(null);
        const errorTitle = ref(null);
        const errorMessage = ref(null);

        onMounted(() => {
            // Get error details from route query or default values
            errorCode.value = route.query.code || '500';
            errorTitle.value = route.query.title || 'Internal Server Error';
            errorMessage.value = route.query.message || 'An unexpected error has occurred. Please try again later.';
        });

        const goHome = () => {
            router.push('/');
        };

        const retry = () => {
            window.location.reload();
        };

        return {
            errorCode,
            errorTitle,
            errorMessage,
            goHome,
            retry
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
