<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h4>User Profile</h4>
                <div class="p-grid">
                    <div class="p-col-12 p-md-6">
                        <div class="field">
                            <label for="name">Name</label>
                            <InputText id="name" v-model="user.name" type="text" class="w-full" />
                        </div>
                        <div class="field">
                            <label for="email">Email</label>
                            <InputText id="email" v-model="user.email" type="email" class="w-full" />
                        </div>
                        <div class="field">
                            <label for="phone">Phone</label>
                            <InputText id="phone" v-model="user.phone" type="tel" class="w-full" />
                        </div>
                        <div class="field">
                            <label for="role">Role</label>
                            <Dropdown id="role" v-model="user.role" :options="roles" optionLabel="name" optionValue="value" placeholder="Select a Role" class="w-full" />
                        </div>
                        <div class="field">
                            <label for="bio">Bio</label>
                            <Textarea id="bio" v-model="user.bio" rows="4" class="w-full" />
                        </div>
                        <Button label="Update Profile" @click="updateProfile" class="p-button-success" />
                    </div>
                    <div class="p-col-12 p-md-6">
                        <div class="card">
                            <h5>Profile Picture</h5>
                            <div class="flex align-items-center justify-content-center" style="height: 200px; border: 2px dashed #ccc;">
                                <span class="text-muted">Upload Profile Picture</span>
                            </div>
                        </div>
                        <div class="card">
                            <h5>Account Settings</h5>
                            <div class="field-checkbox">
                                <Checkbox id="notifications" v-model="user.notifications" binary />
                                <label for="notifications">Email Notifications</label>
                            </div>
                            <div class="field-checkbox">
                                <Checkbox id="newsletter" v-model="user.newsletter" binary />
                                <label for="newsletter">Newsletter Subscription</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'Profile',
    setup() {
        const user = ref({
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
            role: 'admin',
            bio: 'Software Developer with 5 years of experience.',
            notifications: true,
            newsletter: false
        });

        const roles = ref([
            { name: 'Administrator', value: 'admin' },
            { name: 'Manager', value: 'manager' },
            { name: 'User', value: 'user' }
        ]);

        const updateProfile = () => {
            // Simulate API call
            console.log('Profile updated:', user.value);
            // You can add actual API call here
        };

        return {
            user,
            roles,
            updateProfile
        };
    }
};
</script>

<style scoped>
.field {
    margin-bottom: 1rem;
}

.field-checkbox {
    margin-bottom: 0.5rem;
}

.card {
    margin-bottom: 1rem;
}
</style>
