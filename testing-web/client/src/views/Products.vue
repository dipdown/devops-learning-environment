<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h4>Product Management</h4>
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" :disabled="!selectedProducts || !selectedProducts.length" @click="confirmDeleteSelected" />
                        </div>
                    </template>
                    <template v-slot:end>
                        <FileUpload mode="basic" accept=".csv" chooseLabel="Import CSV" class="mr-2 inline-block" :maxFileSize="1000000" @upload="importCSV" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV" />
                    </template>
                </Toolbar>

                <DataTable :value="products" v-model:selection="selectedProducts" 
                        :paginator="true" :rows="10" dataKey="id" 
                        :rowsPerPageOptions="[5, 10, 25]" 
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" 
                        responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="id" header="ID" sortable style="min-width: 5rem"></Column>
                    <Column field="name" header="Name" sortable style="min-width: 14rem"></Column>
                    <Column field="price" header="Price" sortable style="min-width: 8rem">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.price) }}
                        </template>
                    </Column>
                    <Column field="category" header="Category" sortable style="min-width: 10rem"></Column>
                    <Column field="status" header="Status" sortable style="min-width: 10rem">
                        <template #body="slotProps">
                            <Tag :value="getStatusLabel(slotProps.data.status)" :severity="getStatusSeverity(slotProps.data.status)" />
                        </template>
                    </Column>
                    <Column field="inventory" header="Inventory" sortable style="min-width: 8rem"></Column>
                    <Column header="Actions" style="min-width: 10rem">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="productDialog" :style="{width: '450px'}" header="Product Details" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model="product.name" required="true" autofocus :class="{'p-invalid': submitted && !product.name}" />
                        <small class="p-error" v-if="submitted && !product.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" />
                    </div>
                    <div class="field">
                        <label for="category">Category</label>
                        <Dropdown id="category" v-model="product.category" :options="categories" placeholder="Select a Category" />
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="price">Price</label>
                            <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US" />
                        </div>
                        <div class="field col">
                            <label for="inventory">Inventory</label>
                            <InputNumber id="inventory" v-model="product.inventory" integeronly />
                        </div>
                    </div>
                    <div class="field">
                        <label for="status">Status</label>
                        <Dropdown id="status" v-model="product.status" :options="statuses" optionLabel="label" optionValue="value" placeholder="Select Status" />
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete <b>{{product.name}}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>Are you sure you want to delete the selected products?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import ProductService from '@/services/ProductService';

export default {
    setup() {
        const toast = useToast();
        const productService = new ProductService();
        const products = ref([]);
        const productDialog = ref(false);
        const deleteProductDialog = ref(false);
        const deleteProductsDialog = ref(false);
        const product = ref({});
        const selectedProducts = ref(null);
        const submitted = ref(false);
        const categories = ref(['Electronics', 'Clothing', 'Furniture', 'Sports', 'Toys', 'Books']);
        const statuses = ref([
            { label: 'In Stock', value: 'IN_STOCK' },
            { label: 'Low Stock', value: 'LOW_STOCK' },
            { label: 'Out of Stock', value: 'OUT_OF_STOCK' }
        ]);

        onMounted(() => {
            loadProducts();
        });

        const loadProducts = async () => {
            try {
                const response = await productService.getAll();
                products.value = response.data;
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load products', life: 3000 });
            }
        };

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        };

        const openNew = () => {
            product.value = {
                name: '',
                description: '',
                price: 0,
                category: null,
                inventory: 0,
                status: 'IN_STOCK'
            };
            submitted.value = false;
            productDialog.value = true;
        };

        const hideDialog = () => {
            productDialog.value = false;
            submitted.value = false;
        };

        const saveProduct = async () => {
            submitted.value = true;

            if (product.value.name.trim()) {
                try {
                    if (product.value.id) {
                        // Update existing product
                        await productService.update(product.value.id, product.value);
                        toast.add({ severity: 'success', summary: 'Success', detail: 'Product Updated', life: 3000 });
                    } else {
                        // Create new product
                        await productService.create(product.value);
                        toast.add({ severity: 'success', summary: 'Success', detail: 'Product Created', life: 3000 });
                    }
                    
                    loadProducts();
                    productDialog.value = false;
                    product.value = {};
                } catch (error) {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save product', life: 3000 });
                }
            }
        };

        const editProduct = (editProduct) => {
            product.value = { ...editProduct };
            productDialog.value = true;
        };

        const confirmDeleteProduct = (deleteProduct) => {
            product.value = deleteProduct;
            deleteProductDialog.value = true;
        };

        const deleteProduct = async () => {
            try {
                await productService.delete(product.value.id);
                products.value = products.value.filter(val => val.id !== product.value.id);
                deleteProductDialog.value = false;
                toast.add({ severity: 'success', summary: 'Success', detail: 'Product Deleted', life: 3000 });
                product.value = {};
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product', life: 3000 });
            }
        };

        const confirmDeleteSelected = () => {
            deleteProductsDialog.value = true;
        };

        const deleteSelectedProducts = async () => {
            try {
                const deletePromises = selectedProducts.value.map(p => productService.delete(p.id));
                await Promise.all(deletePromises);
                
                products.value = products.value.filter(val => !selectedProducts.value.includes(val));
                deleteProductsDialog.value = false;
                selectedProducts.value = null;
                toast.add({ severity: 'success', summary: 'Success', detail: 'Products Deleted', life: 3000 });
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete selected products', life: 3000 });
            }
        };

        const exportCSV = () => {
            import('xlsx').then(xlsx => {
                const worksheet = xlsx.utils.json_to_sheet(products.value);
                const workbook = { Sheets: { 'Products': worksheet }, SheetNames: ['Products'] };
                const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
                saveAsExcelFile(excelBuffer, 'products');
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

        const importCSV = (e) => {
            const file = e.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const csvData = e.target.result;
                const rows = csvData.split('\n');
                
                const importedData = [];
                
                for (let i = 1; i < rows.length; i++) {
                    if (rows[i].trim()) {
                        const cols = rows[i].split(',');
                        const product = {
                            id: cols[0],
                            name: cols[1],
                            description: cols[2],
                            price: parseFloat(cols[3]),
                            category: cols[4],
                            inventory: parseInt(cols[5]),
                            status: cols[6]
                        };
                        importedData.push(product);
                    }
                }
                
                const importProductsAsync = async () => {
                    for (const product of importedData) {
                        await productService.create(product);
                    }
                    loadProducts();
                    toast.add({ severity: 'success', summary: 'Success', detail: 'Products Imported', life: 3000 });
                };
                
                importProductsAsync().catch(error => {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to import products', life: 3000 });
                });
            };
            reader.readAsText(file);
        };

        const getStatusLabel = (status) => {
            switch (status) {
                case 'IN_STOCK':
                    return 'In Stock';
                case 'LOW_STOCK':
                    return 'Low Stock';
                case 'OUT_OF_STOCK':
                    return 'Out of Stock';
                default:
                    return status;
            }
        };

        const getStatusSeverity = (status) => {
            switch (status) {
                case 'IN_STOCK':
                    return 'success';
                case 'LOW_STOCK':
                    return 'warning';
                case 'OUT_OF_STOCK':
                    return 'danger';
                default:
                    return null;
            }
        };

        return {
            products,
            productDialog,
            deleteProductDialog,
            deleteProductsDialog,
            product,
            selectedProducts,
            submitted,
            categories,
            statuses,
            formatCurrency,
            openNew,
            hideDialog,
            saveProduct,
            editProduct,
            confirmDeleteProduct,
            deleteProduct,
            confirmDeleteSelected,
            deleteSelectedProducts,
            exportCSV,
            importCSV,
            getStatusLabel,
            getStatusSeverity
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
</style>
