<template>
    <div class="layout-config-button" @click="onConfigButtonClick">
        <Button type="button">
            <i class="pi pi-cog"></i>
        </Button>
    </div>
    <Sidebar v-model:visible="visible" position="right" :transitionOptions="'.3s'" class="layout-config-sidebar">
        <h5>Theme Customization</h5>
        <h6>Color Mode</h6>
        <div class="flex">
            <div class="field-radiobutton flex-1">
                <RadioButton v-model="colorScheme" name="colorScheme" value="light" inputId="mode-light" />
                <label for="mode-light">Light</label>
            </div>
            <div class="field-radiobutton flex-1">
                <RadioButton v-model="colorScheme" name="colorScheme" value="dark" inputId="mode-dark" />
                <label for="mode-dark">Dark</label>
            </div>
        </div>

        <h6>Primary Color</h6>
        <div class="flex">
            <div v-for="color in availableColors" :key="color.name" class="color-option" @click="onColorClick(color)">
                <div :class="['color-circle', { 'selected': color.code === selectedColor }]" :style="{ backgroundColor: color.code }"></div>
                <span class="color-name">{{ color.name }}</span>
            </div>
        </div>

        <h6>Menu Type</h6>
        <div class="flex">
            <div class="field-radiobutton flex-1">
                <RadioButton v-model="menuMode" name="menuMode" value="static" inputId="menu-static" />
                <label for="menu-static">Static</label>
            </div>
            <div class="field-radiobutton flex-1">
                <RadioButton v-model="menuMode" name="menuMode" value="overlay" inputId="menu-overlay" />
                <label for="menu-overlay">Overlay</label>
            </div>
        </div>

        <h6>Menu Theme</h6>
        <div class="flex">
            <div class="field-radiobutton flex-1">
                <RadioButton v-model="menuTheme" name="menuTheme" value="light" inputId="theme-light" />
                <label for="theme-light">Light</label>
            </div>
            <div class="field-radiobutton flex-1">
                <RadioButton v-model="menuTheme" name="menuTheme" value="dark" inputId="theme-dark" />
                <label for="theme-dark">Dark</label>
            </div>
        </div>

        <h6>Input Background</h6>
        <div class="flex">
            <div class="field-radiobutton flex-1">
                <RadioButton v-model="inputStyle" name="inputStyle" value="outlined" inputId="outlined" />
                <label for="outlined">Outlined</label>
            </div>
            <div class="field-radiobutton flex-1">
                <RadioButton v-model="inputStyle" name="inputStyle" value="filled" inputId="filled" />
                <label for="filled">Filled</label>
            </div>
        </div>

        <h6>Ripple Effect</h6>
        <InputSwitch v-model="ripple" />
    </Sidebar>
</template>

<script>
import { ref, watch } from 'vue';
import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';
import InputSwitch from 'primevue/inputswitch';

export default {
    components: {
        Sidebar,
        Button,
        RadioButton,
        InputSwitch
    },
    emits: ['update:theme'],
    setup(props, { emit }) {
        const visible = ref(false);
        const colorScheme = ref('light');
        const menuMode = ref('static');
        const menuTheme = ref('light');
        const inputStyle = ref('outlined');
        const ripple = ref(true);
        const selectedColor = ref('#3B82F6'); // Default PrimeVue blue

        const availableColors = [
            { name: 'Blue', code: '#3B82F6' },
            { name: 'Green', code: '#22C55E' },
            { name: 'Orange', code: '#F97316' },
            { name: 'Purple', code: '#A855F7' },
            { name: 'Teal', code: '#14B8A6' },
            { name: 'Red', code: '#EF4444' }
        ];

        const onConfigButtonClick = () => {
            visible.value = !visible.value;
        };

        const onColorClick = (color) => {
            selectedColor.value = color.code;
            applyThemeSettings();
        };

        const applyThemeSettings = () => {
            const theme = {
                colorScheme: colorScheme.value,
                menuMode: menuMode.value,
                menuTheme: menuTheme.value,
                inputStyle: inputStyle.value,
                ripple: ripple.value,
                primaryColor: selectedColor.value
            };

            // Apply color scheme (light/dark)
            document.documentElement.setAttribute('data-theme', theme.colorScheme);

            // Apply menu theme 
            document.documentElement.setAttribute('data-menu-theme', theme.menuTheme);

            // Apply input style
            document.documentElement.setAttribute('data-input-style', theme.inputStyle);

            // Emit event for parent components
            emit('update:theme', theme);

            // Save preferences to localStorage
            localStorage.setItem('theme-settings', JSON.stringify(theme));
        };

        // Initialize theme from localStorage if available
        const initTheme = () => {
            const savedTheme = localStorage.getItem('theme-settings');
            if (savedTheme) {
                try {
                    const theme = JSON.parse(savedTheme);
                    colorScheme.value = theme.colorScheme || 'light';
                    menuMode.value = theme.menuMode || 'static';
                    menuTheme.value = theme.menuTheme || 'light';
                    inputStyle.value = theme.inputStyle || 'outlined';
                    ripple.value = theme.ripple !== undefined ? theme.ripple : true;
                    selectedColor.value = theme.primaryColor || '#3B82F6';
                    applyThemeSettings();
                } catch (e) {
                    console.error("Error parsing saved theme:", e);
                }
            }
        };

        // Watch for changes to apply theme
        watch([colorScheme, menuMode, menuTheme, inputStyle, ripple], applyThemeSettings);

        // Initialize theme on component mount
        initTheme();

        return {
            visible,
            colorScheme,
            menuMode,
            menuTheme,
            inputStyle,
            ripple,
            selectedColor,
            availableColors,
            onConfigButtonClick,
            onColorClick
        };
    }
};
</script>

<style lang="scss" scoped>
.layout-config-button {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 999;
    
    button {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-radius: 3rem 0 0 3rem;
        width: 3rem;
        height: 3rem;
        box-shadow: 0 3px 5px rgba(0, 0, 0, .1);
    }
}

.layout-config-sidebar {
    :deep(.p-sidebar-content) {
        padding: 2rem;
    }

    h5 {
        margin-top: 0;
        margin-bottom: 1.5rem;
    }

    h6 {
        margin-bottom: 0.75rem;
    }

    .flex {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .color-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;

        .color-circle {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            border: 2px solid transparent;
            transition: all 0.2s;

            &.selected {
                transform: scale(1.2);
                border-color: var(--primary-color);
            }
        }

        .color-name {
            font-size: 0.75rem;
        }
    }
}
</style>
