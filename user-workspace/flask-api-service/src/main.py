from flask import Blueprint, jsonify, request
from .logger import log_request

# Create blueprint
main_bp = Blueprint('main', __name__)

# Get logger instance from app context
def get_logger():
    from flask import current_app
    return current_app.logger

@main_bp.before_request
def before_request():
    """Log request details before processing."""
    logger = get_logger()
    log_request(logger, request)

@main_bp.route('/welcome', methods=['GET'])
def welcome():
    """Welcome endpoint that returns a JSON response."""
    return jsonify({
        'message': 'Welcome to the Flask API Service!',
        'status': 'success'
    })

@main_bp.route('/status', methods=['GET'])
def status():
    """Status endpoint to check if the service is running."""
    return jsonify({
        'status': 'running',
        'service': 'Flask API Service'
    })
