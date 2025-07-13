<template>
    <div class="layout-menu-container">
        <ul class="layout-menu" role="menu" ref="menuElement">
            <template v-for="(item, i) in model" :key="item">
                <li :class="{ 'layout-menuitem-category': i === 0 }" role="none">
                    <div class="layout-menuitem-root-text" v-if="item.label">{{ item.label }}</div>
                    <ul role="menu">
                        <li v-for="(child, j) in item.items" :key="child.label" :class="{ 'active-menuitem': activeIndex === i + '_' + j && !child.disabled }" role="none">
                            <div v-if="child.visible === false"></div>
                            <router-link v-else-if="child.to" :to="child.to" :class="{ 'p-disabled': child.disabled }" @click="itemClick($event, child, i + '_' + j)" role="menuitem">
                                <i :class="child.icon" class="layout-menuitem-icon"></i>
                                <span class="layout-menuitem-text">{{ child.label }}</span>
                                <i v-if="child.items" class="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
                            </router-link>
                            <a v-else :href="child.url" :class="{ 'p-disabled': child.disabled }" @click="itemClick($event, child, i + '_' + j)" role="menuitem">
                                <i :class="child.icon" class="layout-menuitem-icon"></i>
                                <span class="layout-menuitem-text">{{ child.label }}</span>
                                <i v-if="child.items" class="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
                            </a>
                            <div v-if="child.items" class="layout-submenu" :class="{ 'p-ripple': !child.disabled || !$slots['item'] }">
                                <ul role="menu">
                                    <li v-for="submenu in child.items" :key="submenu.label" role="none">
                                        <router-link v-if="submenu.to" :to="submenu.to" :class="{ 'p-disabled': submenu.disabled }" role="menuitem">
                                            <i :class="submenu.icon" class="layout-menuitem-icon"></i>
                                            <span class="layout-menuitem-text">{{ submenu.label }}</span>
                                        </router-link>
                                        <a v-else :href="submenu.url" :class="{ 'p-disabled': submenu.disabled }" role="menuitem">
                                            <i :class="submenu.icon" class="layout-menuitem-icon"></i>
                                            <span class="layout-menuitem-text">{{ submenu.label }}</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    props: {
        model: Array
    },
    emits: ['menu-item-click'],
    setup(props, { emit }) {
        const activeIndex = ref(null);
        const menuElement = ref(null);
        const router = useRouter();

        const itemClick = (event, item, index) => {
            // Avoid processing disabled items
            if (item.disabled) {
                event.preventDefault();
                return;
            }

            // Execute command
            if (item.command) {
                item.command({ originalEvent: event, item: item });
            }

            activeIndex.value = index;

            emit('menu-item-click', {
                originalEvent: event,
                item: item
            });
        };

        return { activeIndex, menuElement, itemClick };
    }
};
</script>

<style lang="scss" scoped>
.layout-menu-container {
    padding: 2rem 0;
    overflow-y: auto;

    .layout-menu {
        margin: 0;
        padding: 0;
        list-style-type: none;

        .layout-menuitem-category {
            margin-top: 0.75rem;

            &:first-child {
                margin-top: 0;
            }
        }

        .layout-menuitem-root-text {
            text-transform: uppercase;
            color: var(--surface-900);
            font-weight: 600;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
            padding: 0 1rem;
        }

        a {
            display: flex;
            align-items: center;
            position: relative;
            outline: 0 none;
            color: var(--text-color);
            cursor: pointer;
            padding: 1rem;
            border-radius: 6px;
            transition: background-color 0.2s, box-shadow 0.2s;
            text-decoration: none;

            .layout-menuitem-icon {
                margin-right: 0.5rem;
            }

            .layout-submenu-toggler {
                font-size: 0.75rem;
                margin-left: auto;
                transition: transform 0.2s;
            }

            &.active-route {
                font-weight: 700;
                color: var(--primary-color);
            }

            &:hover {
                background-color: var(--surface-hover);
            }

            &:focus {
                box-shadow: inset 0 0 0 0.15rem var(--primary-color-transparent);
            }
        }

        li.active-menuitem {
            > a {
                .layout-submenu-toggler {
                    transform: rotate(-180deg);
                }
            }

            > .layout-submenu {
                max-height: 1000px;
            }
        }

        ul {
            margin: 0;
            padding: 0;
            list-style-type: none;

            a {
                padding-left: 2.5rem;
            }

            ul {
                a {
                    padding-left: 3.5rem;
                }

                ul {
                    a {
                        padding-left: 4.5rem;
                    }

                    ul {
                        a {
                            padding-left: 5.5rem;
                        }
                    }
                }
            }
        }
    }
}
</style>
