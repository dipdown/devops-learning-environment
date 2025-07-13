<template>
    <div>
        <div class="card">
            <h5>DevOps Learning Environment</h5>
            <p>Welcome to the DevOps Learning Environment CRUD Application. This application demonstrates a full-stack solution with Vue.js, Express, and MySQL.</p>
            
            <div class="grid mt-5">
                <div class="col-12 md:col-6 lg:col-3">
                    <div class="card mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <span class="block text-500 font-medium mb-3">Users</span>
                                <div class="text-900 font-medium text-xl">{{ userCount }}</div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-users text-blue-500 text-xl"></i>
                            </div>
                        </div>
                        <span class="text-green-500 font-medium">{{ newUsers }} new </span>
                        <span class="text-500">since last login</span>
                    </div>
                </div>
                
                <div class="col-12 md:col-6 lg:col-3">
                    <div class="card mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <span class="block text-500 font-medium mb-3">Products</span>
                                <div class="text-900 font-medium text-xl">{{ productCount }}</div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-shopping-bag text-orange-500 text-xl"></i>
                            </div>
                        </div>
                        <span class="text-green-500 font-medium">{{ newProducts }} new </span>
                        <span class="text-500">since last week</span>
                    </div>
                </div>
                
                <div class="col-12 md:col-6 lg:col-3">
                    <div class="card mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <span class="block text-500 font-medium mb-3">Orders</span>
                                <div class="text-900 font-medium text-xl">{{ orderCount }}</div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-shopping-cart text-cyan-500 text-xl"></i>
                            </div>
                        </div>
                        <span class="text-green-500 font-medium">{{ newOrders }} new </span>
                        <span class="text-500">since yesterday</span>
                    </div>
                </div>
                
                <div class="col-12 md:col-6 lg:col-3">
                    <div class="card mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <span class="block text-500 font-medium mb-3">Revenue</span>
                                <div class="text-900 font-medium text-xl">${{ totalRevenue }}</div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-wallet text-purple-500 text-xl"></i>
                            </div>
                        </div>
                        <span class="text-green-500 font-medium">${{ newRevenue }} </span>
                        <span class="text-500">since last month</span>
                    </div>
                </div>
            </div>
            
            <div class="grid mt-5">
                <div class="col-12 xl:col-6">
                    <div class="card">
                        <h5>Recent Orders</h5>
                        <DataTable :value="recentOrders" :rows="5" :paginator="true" responsiveLayout="scroll">
                            <Column field="id" header="ID"></Column>
                            <Column field="user.name" header="Customer"></Column>
                            <Column field="product.name" header="Product"></Column>
                            <Column field="quantity" header="Quantity"></Column>
                            <Column field="total_price" header="Price" body="priceBodyTemplate"></Column>
                            <Column field="created_at" header="Date" body="dateBodyTemplate"></Column>
                        </DataTable>
                    </div>
                </div>
                
                <div class="col-12 xl:col-6">
                    <div class="card">
                        <h5>Sales Overview</h5>
                        <Chart type="bar" :data="chartData" :options="chartOptions" style="height: 300px"></Chart>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/users';
import { useProductStore } from '@/stores/products';
import { useOrderStore } from '@/stores/orders';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Chart from 'primevue/chart';

export default {
    components: {
        DataTable,
        Column,
        Chart
    },
    setup() {
        const userStore = useUserStore();
        const productStore = useProductStore();
        const orderStore = useOrderStore();
        
        const recentOrders = ref([]);
        
        const userCount = ref(0);
        const productCount = ref(0);
        const orderCount = ref(0);
        const totalRevenue = ref(0);
        
        const newUsers = ref(1);
        const newProducts = ref(2);
        const newOrders = ref(3);
        const newRevenue = ref(150);
        
        const chartData = ref({
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Sales',
                    backgroundColor: '#42A5F5',
                    data: [65, 59, 80, 81, 56, 55, 40]
                }
            ]
        });
        
        const chartOptions = ref({
            plugins: {
                legend: {
                    labels: {
                        fontColor: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        });
        
        onMounted(async () => {
            await Promise.all([
                userStore.fetchUsers(),
                productStore.fetchProducts(),
                orderStore.fetchOrders()
            ]);
            
            userCount.value = userStore.users.length;
            productCount.value = productStore.products.length;
            orderCount.value = orderStore.orders.length;
            
            // Calculate total revenue
            if (orderStore.orders.length > 0) {
                totalRevenue.value = orderStore.orders
                    .reduce((sum, order) => sum + Number(order.total_price), 0)
                    .toFixed(2);
                    
                // Sort orders by date and get most recent
                recentOrders.value = [...orderStore.orders]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 5);
            }
        });
        
        const priceBodyTemplate = (data) => {
            return '$' + data.total_price;
        };
        
        const dateBodyTemplate = (data) => {
            return new Date(data.created_at).toLocaleDateString();
        };
        
        return {
            userCount,
            productCount,
            orderCount,
            totalRevenue,
            newUsers,
            newProducts,
            newOrders,
            newRevenue,
            recentOrders,
            chartData,
            chartOptions,
            priceBodyTemplate,
            dateBodyTemplate
        };
    }
};
</script>
