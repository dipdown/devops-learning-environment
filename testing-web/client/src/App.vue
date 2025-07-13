<template>
    <router-view />
</template>

<script>
import { useAuthStore } from './stores/auth';

export default {
    setup() {
        const authStore = useAuthStore();

        // Set up axios interceptors when the app initializes
        authStore.setupAxiosInterceptors();
    }
};
</script>

<style>
@import 'primevue/resources/themes/lara-light-indigo/theme.css';

html {
    font-size: 14px;
}

body {
    font-family: var(--font-family);
    margin: 0;
    padding: 0;
    background-color: var(--surface-ground);
    color: var(--text-color);
}

.card {
    background: var(--surface-card);
    padding: 2rem;
    border-radius: 10px;
    margin-bottom: 2rem;
}

.p-toast {
    z-index: 1000;
}
</style>
