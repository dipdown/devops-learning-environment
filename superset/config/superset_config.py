import os
from flask_appbuilder.security.manager import AUTH_DB

# Superset specific config
ROW_LIMIT = 5000
SUPERSET_WEBSERVER_PORT = 8088
SECRET_KEY = os.environ.get('SUPERSET_SECRET_KEY', 'superset_secret_key')

# Flask App Builder configuration
APP_NAME = 'DevOps Learning Environment - Superset'
APP_ICON = '/static/assets/images/superset-logo-horiz.png'

# Authentication config
AUTH_TYPE = AUTH_DB
AUTH_USER_REGISTRATION = True
AUTH_USER_REGISTRATION_ROLE = 'Admin'

# Database connection pool configuration
SQLALCHEMY_POOL_SIZE = 10
SQLALCHEMY_POOL_TIMEOUT = 30
SQLALCHEMY_POOL_RECYCLE = 3600

# Redis configuration for Celery
REDIS_HOST = os.environ.get('REDIS_HOST', 'redis')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)
REDIS_PASSWORD = os.environ.get('REDIS_PASSWORD', 'redis_password')
REDIS_URL = f"redis://:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}/0"

# Celery configuration
class CeleryConfig:
    BROKER_URL = REDIS_URL
    CELERY_IMPORTS = ('superset.sql_lab',)
    CELERY_RESULT_BACKEND = REDIS_URL
    CELERY_ANNOTATIONS = {'tasks.add': {'rate_limit': '10/s'}}

CELERY_CONFIG = CeleryConfig

# SQL Lab settings
SQLLAB_TIMEOUT = 30
SQLLAB_ASYNC_TIME_LIMIT_SEC = 60 * 60 * 6  # 6 hours
SQL_MAX_ROW = 100000
SQL_QUERY_MUTATOR = lambda sql, username, security_manager, database: sql

# Feature flags
FEATURE_FLAGS = {
    'EMBEDDED_SUPERSET': True,
    'DASHBOARD_RBAC': True,
    'ENABLE_TEMPLATE_PROCESSING': True,
    'ENABLE_EXPLORE_JSON_CSRF_PROTECTION': False,
    'ALERT_REPORTS': True,
}

# Cache configuration
CACHE_CONFIG = {
    'CACHE_TYPE': 'redis',
    'CACHE_DEFAULT_TIMEOUT': 300,
    'CACHE_KEY_PREFIX': 'superset_',
    'CACHE_REDIS_URL': REDIS_URL,
}
