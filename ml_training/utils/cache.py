from flask_caching import Cache
import logging

logger = logging.getLogger(__name__)

def setup_cache(app):
    """
    Configure and initialize caching for the Flask app.
    
    Args:
        app: Flask application instance
        
    Returns:
        Cache: Configured Flask-Caching instance
    """
    # Default cache config
    cache_config = {
        'CACHE_TYPE': 'SimpleCache',  # Simple in-memory cache
        'CACHE_DEFAULT_TIMEOUT': 300  # 5 minutes default
    }
    
    # Check if Redis is configured
    if app.config.get('REDIS_URL'):
        logger.info("Using Redis for caching")
        cache_config = {
            'CACHE_TYPE': 'RedisCache',
            'CACHE_REDIS_URL': app.config.get('REDIS_URL'),
            'CACHE_DEFAULT_TIMEOUT': 300
        }
    
    # Initialize cache
    cache = Cache(app, config=cache_config)
    
    logger.info(f"Cache initialized with type: {cache_config['CACHE_TYPE']}")
    
    return cache