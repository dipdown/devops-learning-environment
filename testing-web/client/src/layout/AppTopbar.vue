<template>
    <div class="layout-topbar">
        <button class="layout-topbar-button p-link" @click="onMenuToggle">
            <i class="pi pi-bars"></i>
        </button>
        <router-link to="/" class="layout-topbar-logo">
            <span>DevOps Learning</span>
        </router-link>

        <button class="layout-topbar-menu-button p-link" @click="onMenuButtonClick">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="{ 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible }">
            <button class="p-link layout-topbar-button" @click="navigateTo('/profile')">
                <i class="pi pi-user"></i>
                <span>Profile</span>
            </button>
            <button class="p-link layout-topbar-button" @click="navigateTo('/settings')">
                <i class="pi pi-cog"></i>
                <span>Settings</span>
            </button>
            <button class="p-link layout-topbar-button" @click="logout">
                <i class="pi pi-sign-out"></i>
                <span>Logout</span>
            </button>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

export default {
    emits: ['menu-toggle'],
    data() {
        return {
            layoutState: {
                profileSidebarVisible: false
            }
        };
    },
    methods: {
        onMenuToggle(event) {
            this.$emit('menu-toggle', event);
        },
        onMenuButtonClick() {
            this.layoutState.profileSidebarVisible = !this.layoutState.profileSidebarVisible;
        },
        navigateTo(path) {
            this.layoutState.profileSidebarVisible = false;
            this.$router.push(path);
        },
        logout() {
            const authStore = useAuthStore();
            authStore.logout();
            this.$router.push('/auth/login');
        }
    },
    watch: {
        '$route'() {
            this.layoutState.profileSidebarVisible = false;
        }
    },
    setup() {
        const router = useRouter();
        return { router };
    }
};
</script>

<style lang="scss" scoped>
.layout-topbar {
    position: fixed;
    height: 5rem;
    z-index: 997;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0 2rem;
    background-color: var(--surface-card);
    transition: left .3s;
    display: flex;
    align-items: center;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.08);

    .layout-topbar-logo {
        display: flex;
        align-items: center;
        color: var(--surface-900);
        font-size: 1.5rem;
        font-weight: 500;
        text-decoration: none;
        margin-right: 2rem;

        img {
            height: 2.5rem;
            margin-right: 0.5rem;
        }
    }

    .layout-topbar-button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: relative;
        color: var(--text-color-secondary);
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        cursor: pointer;
        transition: background-color .3s;

        &:hover {
            color: var(--text-color);
            background-color: var(--surface-hover);
        }

        i {
            font-size: 1.5rem;
        }

        span {
            font-size: 1rem;
            display: none;
        }
    }

    .layout-topbar-menu-button {
        display: none;
    }

    .layout-topbar-menu {
        margin: 0 0 0 auto;
        padding: 0;
        list-style: none;
        display: flex;

        .layout-topbar-button {
            margin-left: 1rem;
        }
    }
}

@media screen and (max-width: 991px) {
    .layout-topbar {
        justify-content: space-between;

        .layout-topbar-logo {
            width: auto;
        }

        .layout-topbar-menu-button {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            position: relative;
            color: var(--text-color-secondary);
            border-radius: 50%;
            width: 3rem;
            height: 3rem;
            cursor: pointer;
            transition: background-color .3s;

            &:hover {
                color: var(--text-color);
                background-color: var(--surface-hover);
            }

            i {
                font-size: 1.5rem;
            }
        }

        .layout-topbar-menu {
            margin-left: 0;
            position: absolute;
            flex-direction: column;
            background-color: var(--surface-overlay);
            box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.08);
            border-radius: 6px;
            padding: 1rem;
            right: 2rem;
            top: 5rem;
            min-width: 15rem;
            display: none;

            &.layout-topbar-menu-mobile-active {
                display: block;
            }

            .layout-topbar-button {
                margin-left: 0;
                display: flex;
                width: 100%;
                height: auto;
                justify-content: flex-start;
                border-radius: 6px;
                padding: 1rem;

                i {
                    font-size: 1rem;
                    margin-right: 0.5rem;
                }

                span {
                    font-weight: medium;
                    display: block;
                }
            }
        }
    }
}
</style>
