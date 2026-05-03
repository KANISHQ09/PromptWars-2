from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Indian Election Assistant API"}

def test_get_election_data():
    response = client.get("/election/data")
    assert response.status_code == 200
    data = response.json()
    assert "election_type" in data

def test_get_booths():
    response = client.get("/booths")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_candidates():
    response = client.get("/candidates")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_chat_validation_error():
    # Test that empty messages are rejected by pydantic validation
    response = client.post("/chat", json={"message": ""})
    assert response.status_code == 422 # Unprocessable Entity
