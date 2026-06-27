import pytest
import responses
from pastebin_sdk import PastebinClient

@pytest.fixture
def client():
    return PastebinClient(base_url="https://api.example.com")

def test_initialization(client):
    assert client.base_url == "https://api.example.com"
    assert "Authorization" not in client.session.headers

def test_set_token(client):
    client.set_token("mock-token")
    assert client.session.headers["Authorization"] == "Bearer mock-token"
    client.clear_token()
    assert "Authorization" not in client.session.headers

@responses.activate
def test_create_paste(client):
    mock_response = {
        "success": True,
        "data": {"id": "1", "title": "test", "content": "hello"}
    }
    
    responses.add(
        responses.POST,
        "https://api.example.com/api/v1/pastes",
        json=mock_response,
        status=201
    )
    
    result = client.create_paste(
        title="test",
        content="hello",
        language="plaintext",
        visibility="public"
    )
    
    assert result == mock_response
    
    assert len(responses.calls) == 1
    req = responses.calls[0].request
    assert b"test" in req.body

@responses.activate
def test_auth_request(client):
    client.set_token("test-token")
    mock_response = {"success": True, "data": []}
    
    responses.add(
        responses.GET,
        "https://api.example.com/api/v1/pastes",
        json=mock_response,
        status=200
    )
    
    result = client.list_pastes()
    assert result == mock_response
    
    req = responses.calls[0].request
    assert req.headers["Authorization"] == "Bearer test-token"

@responses.activate
def test_fork_paste(client):
    mock_response = {
        "success": True,
        "data": {"id": "new-id", "title": "test (Fork)", "content": "hello"}
    }
    
    responses.add(
        responses.POST,
        "https://api.example.com/api/v1/pastes/old-id/fork",
        json=mock_response,
        status=201
    )
    
    result = client.fork_paste("old-id", "secret")
    
    assert result == mock_response
    assert len(responses.calls) == 1
    req = responses.calls[0].request
    import json
    body = json.loads(req.body)
    assert body["password"] == "secret"
