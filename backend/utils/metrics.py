import logging
import time
from functools import wraps
from flask import request, g

logger = logging.getLogger(__name__)

def log_api_call(f):
    """
    Decorator to log API calls with timing information
    
    Args:
        f: The function to decorate
        
    Returns:
        The decorated function
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Record start time
        start_time = time.time()
        
        # Get endpoint information
        endpoint = request.path
        method = request.method
        
        # Execute the function
        response = f(*args, **kwargs)
        
        # Calculate response time in milliseconds
        response_time = int((time.time() - start_time) * 1000)
        
        # Get status code
        status_code = response[1] if isinstance(response, tuple) and len(response) > 1 else 200
        
        # Log the API call
        logger.info(f"API {method} {endpoint} - Status: {status_code} - Time: {response_time}ms")
        
        return response
    
    return decorated_function