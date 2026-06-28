from typing import Dict, Any

class AuthResource:
    def __init__(self, client):
        self.client = client

    def get_me(self) -> Dict[str, Any]:
        """Get current auth context."""
        return self.client.request("GET", "/auth/me")
