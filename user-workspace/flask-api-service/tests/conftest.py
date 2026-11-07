import socket
import pytest


@pytest.fixture(autouse=True)
def no_live_connections(monkeypatch):
    def blocked(*args, **kwargs):
        raise AssertionError('Live network is disabled in the offline test suite')
    monkeypatch.setattr(socket.socket, 'connect', blocked)
    monkeypatch.setattr(socket.socket, 'connect_ex', blocked)
