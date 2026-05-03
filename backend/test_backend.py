import requests
import time

def test_backend():
    url = "http://127.0.0.1:8000"
    
    # Wait for server to start if needed (though I'll run it in background)
    print("Checking root endpoint...")
    try:
        r = requests.get(url)
        print(f"Root response: {r.json()}")
    except Exception as e:
        print(f"Error connecting to root: {e}")

    print("\nChecking election data...")
    try:
        r = requests.get(f"{url}/election/data")
        print(f"Election data fetched successfully: {r.json()['election_type']}")
    except Exception as e:
        print(f"Error fetching election data: {e}")

    print("\nTesting chat endpoint...")
    payload = {
        "message": "Hi, I'm a first-time voter in India. How do I start?",
        "history": []
    }
    try:
        r = requests.post(f"{url}/chat", json=payload)
        print(f"Chat response: {r.json()['response']}")
    except Exception as e:
        print(f"Error in chat endpoint: {e}")

if __name__ == "__main__":
    test_backend()
