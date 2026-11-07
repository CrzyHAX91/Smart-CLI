import pytest
from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config.update(TESTING=True)
    return app.test_client()


@pytest.mark.parametrize('path,expected', [
    ('/welcome', {'message': 'Welcome to the Flask API Service!', 'status': 'success'}),
    ('/status', {'status': 'running', 'service': 'Flask API Service'}),
])
def test_real_flask_routes(client, path, expected):
    response = client.get(path)
    assert response.status_code == 200
    assert response.json == expected


def test_unknown_route_is_not_success(client):
    assert client.get('/not-a-route').status_code == 404
