import logging
from datetime import datetime

def setup_logger():
    """Configure and return a logger instance for the application."""
    # Create logger
    logger = logging.getLogger('flask-api-service')
    logger.setLevel(logging.INFO)

    # Create console handler and set level to INFO
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)

    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    # Add formatter to console handler
    console_handler.setFormatter(formatter)

    # Add console handler to logger
    logger.addHandler(console_handler)

    return logger

def log_request(logger, request):
    """Log request details."""
    logger.info(
        f"Request: {request.method} {request.path} - "
        f"Client: {request.remote_addr} - "
        f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    )
