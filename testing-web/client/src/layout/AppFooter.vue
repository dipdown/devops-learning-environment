<template>
    <div class="layout-footer">
        <div class="footer-content">
            <span class="footer-text">DevOps Learning Environment - &copy; {{ new Date().getFullYear() }}</span>
            <div class="social-icons">
                <a href="https://github.com/your-repo/devops-learning-environment" target="_blank" rel="noopener noreferrer">
                    <i class="pi pi-github"></i>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                    <i class="pi pi-twitter"></i>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                    <i class="pi pi-linkedin"></i>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppFooter'
};
</script>

<style lang="scss" scoped>
.layout-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 2rem;
    border-top: 1px solid var(--surface-border);
    
    .footer-content {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
    }

    .footer-text {
        font-size: 0.875rem;
        color: var(--text-color-secondary);
    }

    .social-icons {
        display: flex;
        gap: 1rem;

        a {
            color: var(--text-color-secondary);
            transition: color 0.2s;

            &:hover {
                color: var(--primary-color);
            }

            i {
                font-size: 1.25rem;
            }
        }
    }
}
</style>
