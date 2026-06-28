from typing import Dict, Any

class UsersResource:
    def __init__(self, client):
        self.client = client

    def get_profile(self) -> Dict[str, Any]:
        """Get user profile."""
        return self.client.request("GET", "/users/profile")

    def update_profile(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update user profile."""
        return self.client.request("PATCH", "/users/profile", json=data)
