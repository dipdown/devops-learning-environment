<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div class="card w-full p-8 text-center" style="max-width: 500px;">
                <div class="mb-5">
                    <i class="pi pi-search text-6xl text-primary mb-3"></i>
                    <h1 class="text-900 text-6xl font-medium mb-2">404</h1>
                    <h2 class="text-900 text-2xl font-medium mb-2">Page Not Found</h2>
                    <p class="text-600 text-lg mb-5">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                </div>
                <div class="flex justify-content-center gap-3">
                    <Button label="Go to Dashboard" icon="pi pi-home" @click="goHome" class="p-button-outlined" />
                    <Button label="Go Back" icon="pi pi-arrow-left" @click="goBack" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
    name: 'NotFound',
    setup() {
        const router = useRouter();

        const goHome = () => {
            router.push('/');
        };

        const goBack = () => {
            router.go(-1);
        };

        return {
            goHome,
            goBack
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
