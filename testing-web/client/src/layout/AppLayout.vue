<template>
    <div class="layout-wrapper">
        <AppTopbar @menu-toggle="onMenuToggle" />
        <div class="layout-sidebar" :class="{ 'layout-sidebar-active': sidebarVisible }">
            <AppMenu :model="menu" @menu-item-click="onMenuItemClick" />
        </div>
        <div class="layout-main-container">
            <div class="layout-main">
                <router-view />
            </div>
            <AppFooter />
        </div>
        <AppConfig :layoutState="layoutState" @layout-config-change="onLayoutConfigChange" />
        <Toast />
        <ConfirmDialog />
    </div>
</template>

<script>
import AppTopbar from './AppTopbar.vue';
import AppMenu from './AppMenu.vue';
import AppFooter from './AppFooter.vue';
import AppConfig from './AppConfig.vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import { useAuthStore } from '@/stores/auth';

export default {
    data() {
        return {
            layoutState: {
                staticMenuDesktopInactive: false,
                overlayMenuActive: false,
                profileSidebarVisible: false,
                configSidebarVisible: false,
                staticMenuMobileActive: false,
                menuHoverActive: false,
                darkTheme: false
            },
            sidebarVisible: true,
            menu: [
                {
                    label: 'Home',
                    items: [
                        {
                            label: 'Dashboard',
                            icon: 'pi pi-fw pi-home',
                            to: '/'
                        }
                    ]
                },
                {
                    label: 'Management',
                    items: [
                        {
                            label: 'Users',
                            icon: 'pi pi-fw pi-users',
                            to: '/users'
                        },
                        {
                            label: 'Products',
                            icon: 'pi pi-fw pi-shopping-bag',
                            to: '/products'
                        },
                        {
                            label: 'Orders',
                            icon: 'pi pi-fw pi-shopping-cart',
                            to: '/orders'
                        }
                    ]
                },
                {
                    label: 'User',
                    items: [
                        {
                            label: 'Profile',
                            icon: 'pi pi-fw pi-user',
                            to: '/profile'
                        },
                        {
                            label: 'Logout',
                            icon: 'pi pi-fw pi-sign-out',
                            command: () => this.logout()
                        }
                    ]
                }
            ]
        };
    },
    watch: {
        $route() {
            this.layoutState.overlayMenuActive = false;
            this.layoutState.staticMenuMobileActive = false;
            this.layoutState.menuHoverActive = false;
        }
    },
    mounted() {
        const authStore = useAuthStore();
        authStore.setupAxiosInterceptors();
    },
    methods: {
        onMenuToggle() {
            this.sidebarVisible = !this.sidebarVisible;
        },
        onMenuItemClick() {
            if (this.isOverlay()) {
                this.layoutState.overlayMenuActive = false;
            }

            if (this.isDesktop()) {
                this.layoutState.staticMenuDesktopInactive = true;
            } else {
                this.layoutState.staticMenuMobileActive = false;
            }
        },
        onLayoutConfigChange(config) {
            this.layoutState = config;
        },
        logout() {
            const authStore = useAuthStore();
            authStore.logout();
            this.$router.push('/auth/login');
            this.$toast.add({ severity: 'success', summary: 'Logged Out', detail: 'You have been logged out successfully', life: 3000 });
        },
        isOverlay() {
            return this.layoutState.overlayMenuActive;
        },
        isDesktop() {
            return window.innerWidth > 991;
        }
    },
    components: {
        AppTopbar,
        AppMenu,
        AppFooter,
        AppConfig,
        Toast,
        ConfirmDialog
    }
};
</script>

<style lang="scss">
@import '../assets/styles.scss';

.layout-wrapper {
    min-height: 100vh;
}

.layout-sidebar {
    position: fixed;
    width: 250px;
    height: 100%;
    top: 0;
    left: 0;
    overflow-y: auto;
    background-color: var(--surface-overlay);
    border-right: 1px solid var(--surface-border);
    padding: 0;
    transition: transform 0.3s, left 0.3s;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.02), 0 0 2px rgba(0, 0, 0, 0.05), 0 1px 4px rgba(0, 0, 0, 0.08);
    z-index: 999;
}

@media (max-width: 991px) {
    .layout-sidebar {
        transform: translateX(-100%);
        
        &.layout-sidebar-active {
            transform: translateX(0);
        }
    }

    .layout-main-container {
        margin-left: 0;
        padding-left: 1rem;
    }
}

@media (min-width: 992px) {
    .layout-sidebar {
        transform: none;
        left: 0;
    }

    .layout-main-container {
        margin-left: 250px;
        padding-left: 2rem;
    }
}
</style>
