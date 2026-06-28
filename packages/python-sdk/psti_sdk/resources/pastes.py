from typing import Dict, Any, Optional

class PastesResource:
    def __init__(self, client):
        self.client = client

    def create(self, title: str, content: str, language: str = "plaintext", 
               visibility: str = "public", encrypted: bool = False, 
               burn_after_read: bool = False, **kwargs) -> Dict[str, Any]:
        """Create a new paste."""
        payload = {
            "title": title,
            "content": content,
            "language": language,
            "visibility": visibility,
            "encrypted": encrypted,
            "burn_after_read": burn_after_read
        }
        payload.update(kwargs)
        return self.client.request("POST", "/pastes", json=payload)

    def get(self, paste_id: str, password: Optional[str] = None) -> Dict[str, Any]:
        """Get a paste by ID."""
        params = {"password": password} if password else None
        return self.client.request("GET", f"/pastes/{paste_id}", params=params)

    def list(self) -> Dict[str, Any]:
        """List pastes for the current user."""
        return self.client.request("GET", "/pastes")

    def fork(self, paste_id: str, password: Optional[str] = None) -> Dict[str, Any]:
        """Fork an existing paste."""
        payload = {"password": password} if password else {}
        return self.client.request("POST", f"/pastes/{paste_id}/fork", json=payload)
        
    def get_versions(self, paste_id: str, password: Optional[str] = None) -> Dict[str, Any]:
        """Get the version history of a paste by its ID."""
        params = {"password": password} if password else None
        return self.client.request("GET", f"/pastes/{paste_id}/versions", params=params)

    def update(self, paste_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a paste."""
        return self.client.request("PATCH", f"/pastes/{paste_id}", json=data)

    def delete(self, paste_id: str) -> Dict[str, Any]:
        """Delete a paste."""
        return self.client.request("DELETE", f"/pastes/{paste_id}")
