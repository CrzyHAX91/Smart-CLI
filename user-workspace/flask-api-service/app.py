from flask import Flask
from src.main import main_bp
from src.logger import setup_logger

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # Set up logger
    logger = setup_logger()
    app.logger.addHandler(logger.handlers[0])  # Add console handler to app logger

    # Register blueprints
    app.register_blueprint(main_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    # Enable debug mode only in development environment
    debug_mode = os.getenv('FLASK_ENV', 'production') == 'development'
    app.run(debug=debug_mode)
