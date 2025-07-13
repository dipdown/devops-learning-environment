<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h4>Order Management</h4>
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" :disabled="!selectedOrders || !selectedOrders.length" @click="confirmDeleteSelected" />
                        </div>
                    </template>
                    <template v-slot:end>
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV" />
                    </template>
                </Toolbar>

                <DataTable :value="orders" v-model:selection="selectedOrders"
                        :paginator="true" :rows="10" dataKey="id"
                        :rowsPerPageOptions="[5, 10, 25]"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                        responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="id" header="ID" sortable style="min-width: 5rem"></Column>
                    <Column field="orderNumber" header="Order Number" sortable style="min-width: 12rem"></Column>
                    <Column field="customerName" header="Customer" sortable style="min-width: 14rem"></Column>
                    <Column field="orderDate" header="Date" sortable style="min-width: 10rem">
                        <template #body="slotProps">
                            {{ formatDate(slotProps.data.orderDate) }}
                        </template>
                    </Column>
                    <Column field="totalAmount" header="Amount" sortable style="min-width: 8rem">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.totalAmount) }}
                        </template>
                    </Column>
                    <Column field="status" header="Status" sortable style="min-width: 10rem">
                        <template #body="slotProps">
                            <Tag :value="getStatusLabel(slotProps.data.status)" :severity="getStatusSeverity(slotProps.data.status)" />
                        </template>
                    </Column>
                    <Column header="Actions" style="min-width: 10rem">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editOrder(slotProps.data)" />
                            <Button icon="pi pi-eye" class="p-button-rounded p-button-info mr-2" @click="viewOrderDetails(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteOrder(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="orderDialog" :style="{width: '500px'}" header="Order Details" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="customerName">Customer Name</label>
                        <InputText id="customerName" v-model="order.customerName" required autofocus :class="{'p-invalid': submitted && !order.customerName}" />
                        <small class="p-error" v-if="submitted && !order.customerName">Customer Name is required.</small>
                    </div>

                    <div class="field">
                        <label for="status">Order Status</label>
                        <Dropdown id="status" v-model="order.status" :options="statuses" optionLabel="label" optionValue="value" placeholder="Select Status" />
                    </div>

                    <div class="field">
                        <label>Order Items</label>
                        <div class="p-fluid formgrid grid" v-for="(item, index) in order.items" :key="index">
                            <div class="field col-6">
                                <Dropdown v-model="item.productId" :options="products" optionLabel="name" optionValue="id" placeholder="Select Product" @change="updateOrderItem(item)" />
                            </div>
                            <div class="field col-3">
                                <InputNumber v-model="item.quantity" placeholder="Qty" min="1" @input="updateOrderItem(item)" />
                            </div>
                            <div class="field col-2">
                                <InputText :value="formatCurrency(item.price * item.quantity)" disabled />
                            </div>
                            <div class="field col-1">
                                <Button icon="pi pi-times" class="p-button-danger p-button-text" @click="removeOrderItem(index)" />
                            </div>
                        </div>
                        <Button label="Add Item" icon="pi pi-plus" class="p-button-text" @click="addOrderItem" />
                    </div>

                    <div class="field">
                        <div class="flex justify-content-between align-items-center">
                            <label>Total Amount:</label>
                            <span class="text-2xl font-bold">{{ formatCurrency(calculateOrderTotal()) }}</span>
                        </div>
                    </div>

                    <div class="field">
                        <label for="notes">Notes</label>
                        <Textarea id="notes" v-model="order.notes" rows="3" />
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveOrder" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="orderDetailsDialog" :style="{width: '600px'}" header="Order Details" :modal="true">
                    <div class="order-details" v-if="order">
                        <div class="grid">
                            <div class="col-6">
                                <div class="text-lg font-bold mb-2">Order Information</div>
                                <div class="mb-2"><span class="font-semibold">Order Number:</span> {{ order.orderNumber }}</div>
                                <div class="mb-2"><span class="font-semibold">Date:</span> {{ formatDate(order.orderDate) }}</div>
                                <div class="mb-2"><span class="font-semibold">Status:</span> <Tag :value="getStatusLabel(order.status)" :severity="getStatusSeverity(order.status)" /></div>
                            </div>
                            <div class="col-6">
                                <div class="text-lg font-bold mb-2">Customer Information</div>
                                <div class="mb-2"><span class="font-semibold">Name:</span> {{ order.customerName }}</div>
                                <div class="mb-2"><span class="font-semibold">Email:</span> {{ order.customerEmail || 'N/A' }}</div>
                            </div>
                        </div>

                        <div class="mt-4">
                            <div class="text-lg font-bold mb-2">Order Items</div>
                            <DataTable :value="order.items" responsiveLayout="scroll">
                                <Column field="productName" header="Product"></Column>
                                <Column field="quantity" header="Quantity"></Column>
                                <Column field="price" header="Unit Price">
                                    <template #body="slotProps">
                                        {{ formatCurrency(slotProps.data.price) }}
                                    </template>
                                </Column>
                                <Column header="Subtotal">
                                    <template #body="slotProps">
                                        {{ formatCurrency(slotProps.data.price * slotProps.data.quantity) }}
                                    </template>
                                </Column>
                            </DataTable>
                        </div>

                        <div class="flex justify-content-end mt-3">
                            <div class="text-right">
                                <div class="text-lg"><span class="font-semibold">Total Amount:</span> {{ formatCurrency(calculateOrderTotal()) }}</div>
                            </div>
                        </div>

                        <div class="mt-4" v-if="order.notes">
                            <div class="text-lg font-bold mb-2">Notes</div>
                            <div>{{ order.notes }}</div>
                        </div>
                    </div>
                </Dialog>

                <Dialog v-model:visible="deleteOrderDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>Are you sure you want to delete Order #{{order.orderNumber}}?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteOrderDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteOrder" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteOrdersDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>Are you sure you want to delete the selected orders?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteOrdersDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedOrders" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import OrderService from '@/services/OrderService';
import ProductService from '@/services/ProductService';

export default {
    setup() {
        const toast = useToast();
        const orderService = new OrderService();
        const productService = new ProductService();
        const orders = ref([]);
        const products = ref([]);
        const orderDialog = ref(false);
        const orderDetailsDialog = ref(false);
        const deleteOrderDialog = ref(false);
        const deleteOrdersDialog = ref(false);
        const order = ref({});
        const selectedOrders = ref(null);
        const submitted = ref(false);
        const statuses = ref([
            { label: 'Pending', value: 'PENDING' },
            { label: 'Processing', value: 'PROCESSING' },
            { label: 'Shipped', value: 'SHIPPED' },
            { label: 'Delivered', value: 'DELIVERED' },
            { label: 'Cancelled', value: 'CANCELLED' }
        ]);

        onMounted(async () => {
            await loadOrders();
            await loadProducts();
        });

        const loadOrders = async () => {
            try {
                const response = await orderService.getAll();
                orders.value = response.data;
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load orders', life: 3000 });
            }
        };

        const loadProducts = async () => {
            try {
                const response = await productService.getAll();
                products.value = response.data;
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load products', life: 3000 });
            }
        };

        const formatDate = (value) => {
            if (!value) return '';
            return new Date(value).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        };

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        };

        const openNew = () => {
            const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
            order.value = {
                orderNumber: orderNumber,
                customerName: '',
                orderDate: new Date().toISOString(),
                status: 'PENDING',
                totalAmount: 0,
                items: [
                    { productId: null, productName: '', quantity: 1, price: 0 }
                ],
                notes: ''
            };
            submitted.value = false;
            orderDialog.value = true;
        };

        const hideDialog = () => {
            orderDialog.value = false;
            submitted.value = false;
        };

        const addOrderItem = () => {
            order.value.items.push({ productId: null, productName: '', quantity: 1, price: 0 });
        };

        const removeOrderItem = (index) => {
            order.value.items.splice(index, 1);
            if (order.value.items.length === 0) {
                addOrderItem();
            }
        };

        const updateOrderItem = (item) => {
            if (item.productId) {
                const product = products.value.find(p => p.id === item.productId);
                if (product) {
                    item.productName = product.name;
                    item.price = product.price;
                }
            }
            calculateOrderTotal();
        };

        const calculateOrderTotal = () => {
            if (!order.value || !order.value.items) return 0;
            
            const total = order.value.items.reduce((sum, item) => {
                return sum + (item.price * item.quantity);
            }, 0);
            
            order.value.totalAmount = total;
            return total;
        };

        const saveOrder = async () => {
            submitted.value = true;

            if (order.value.customerName) {
                try {
                    // Ensure all items have proper product names
                    order.value.items.forEach(item => {
                        if (item.productId) {
                            const product = products.value.find(p => p.id === item.productId);
                            if (product) {
                                item.productName = product.name;
                                item.price = product.price;
                            }
                        }
                    });

                    // Calculate final total
                    order.value.totalAmount = calculateOrderTotal();

                    if (order.value.id) {
                        // Update existing order
                        await orderService.update(order.value.id, order.value);
                        toast.add({ severity: 'success', summary: 'Success', detail: 'Order Updated', life: 3000 });
                    } else {
                        // Create new order
                        await orderService.create(order.value);
                        toast.add({ severity: 'success', summary: 'Success', detail: 'Order Created', life: 3000 });
                    }
                    
                    await loadOrders();
                    orderDialog.value = false;
                    order.value = {};
                } catch (error) {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save order', life: 3000 });
                }
            }
        };

        const editOrder = (editOrder) => {
            order.value = { ...editOrder };
            orderDialog.value = true;
        };

        const viewOrderDetails = (viewOrder) => {
            order.value = { ...viewOrder };
            orderDetailsDialog.value = true;
        };

        const confirmDeleteOrder = (deleteOrder) => {
            order.value = deleteOrder;
            deleteOrderDialog.value = true;
        };

        const deleteOrder = async () => {
            try {
                await orderService.delete(order.value.id);
                orders.value = orders.value.filter(val => val.id !== order.value.id);
                deleteOrderDialog.value = false;
                toast.add({ severity: 'success', summary: 'Success', detail: 'Order Deleted', life: 3000 });
                order.value = {};
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete order', life: 3000 });
            }
        };

        const confirmDeleteSelected = () => {
            deleteOrdersDialog.value = true;
        };

        const deleteSelectedOrders = async () => {
            try {
                const deletePromises = selectedOrders.value.map(o => orderService.delete(o.id));
                await Promise.all(deletePromises);
                
                orders.value = orders.value.filter(val => !selectedOrders.value.includes(val));
                deleteOrdersDialog.value = false;
                selectedOrders.value = null;
                toast.add({ severity: 'success', summary: 'Success', detail: 'Orders Deleted', life: 3000 });
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete selected orders', life: 3000 });
            }
        };

        const exportCSV = () => {
            import('xlsx').then(xlsx => {
                const exportData = orders.value.map(order => ({
                    id: order.id,
                    orderNumber: order.orderNumber,
                    customerName: order.customerName,
                    orderDate: formatDate(order.orderDate),
                    totalAmount: order.totalAmount,
                    status: getStatusLabel(order.status)
                }));
                
                const worksheet = xlsx.utils.json_to_sheet(exportData);
                const workbook = { Sheets: { 'Orders': worksheet }, SheetNames: ['Orders'] };
                const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
                saveAsExcelFile(excelBuffer, 'orders');
            });
        };

        const saveAsExcelFile = (buffer, fileName) => {
            import('file-saver').then(module => {
                const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                const EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], { type: EXCEL_TYPE });
                module.default.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
            });
        };

        const getStatusLabel = (status) => {
            switch (status) {
                case 'PENDING':
                    return 'Pending';
                case 'PROCESSING':
                    return 'Processing';
                case 'SHIPPED':
                    return 'Shipped';
                case 'DELIVERED':
                    return 'Delivered';
                case 'CANCELLED':
                    return 'Cancelled';
                default:
                    return status;
            }
        };

        const getStatusSeverity = (status) => {
            switch (status) {
                case 'PENDING':
                    return 'info';
                case 'PROCESSING':
                    return 'warning';
                case 'SHIPPED':
                    return 'primary';
                case 'DELIVERED':
                    return 'success';
                case 'CANCELLED':
                    return 'danger';
                default:
                    return null;
            }
        };

        return {
            orders,
            products,
            orderDialog,
            orderDetailsDialog,
            deleteOrderDialog,
            deleteOrdersDialog,
            order,
            selectedOrders,
            submitted,
            statuses,
            formatDate,
            formatCurrency,
            openNew,
            hideDialog,
            saveOrder,
            editOrder,
            viewOrderDetails,
            confirmDeleteOrder,
            deleteOrder,
            confirmDeleteSelected,
            deleteSelectedOrders,
            exportCSV,
            getStatusLabel,
            getStatusSeverity,
            addOrderItem,
            removeOrderItem,
            updateOrderItem,
            calculateOrderTotal
        };
    }
};
</script>

<style lang="scss" scoped>
.card {
    background-color: var(--surface-card);
    padding: 2rem;
    border-radius: 10px;
    margin-bottom: 1rem;
}

.order-details {
    .font-semibold {
        font-weight: 600;
    }
    
    .font-bold {
        font-weight: 700;
    }
}
</style>
