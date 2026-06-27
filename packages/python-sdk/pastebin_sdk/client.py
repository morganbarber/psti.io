import requests
from typing import Optional, Dict, Any, List

class PastebinClient:
    def __init__(self, base_url: str, token: Optional[str] = None):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        if token:
            self.set_token(token)

    def set_token(self, token: str):
        self.session.headers.update({"Authorization": f"Bearer {token}"})

    def clear_token(self):
        self.session.headers.pop("Authorization", None)

    def _request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        url = f"{self.base_url}/api/v1{endpoint}"
        response = self.session.request(method, url, **kwargs)
        
        try:
            data = response.json()
        except ValueError:
            response.raise_for_status()
            return {"success": True, "data": None}
            
        if not response.ok:
            error_message = data.get("message", f"API error: {response.status_code}")
            if error_message == "Password required":
                return {"success": False, "error": error_message}
            raise Exception(error_message)
            
        return data

    def create_paste(self, title: str, content: str, language: str = "plaintext", 
                     visibility: str = "public", encrypted: bool = False, 
                     burn_after_read: bool = False, **kwargs) -> Dict[str, Any]:
        payload = {
            "title": title,
            "content": content,
            "language": language,
            "visibility": visibility,
            "encrypted": encrypted,
            "burn_after_read": burn_after_read
        }
        payload.update(kwargs)
        return self._request("POST", "/pastes", json=payload)

    def get_paste(self, paste_id: str, password: Optional[str] = None) -> Dict[str, Any]:
        params = {"password": password} if password else None
        return self._request("GET", f"/pastes/{paste_id}", params=params)

    def list_pastes(self) -> Dict[str, Any]:
        return self._request("GET", "/pastes")

    def update_paste(self, paste_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._request("PATCH", f"/pastes/{paste_id}", json=data)

    def delete_paste(self, paste_id: str) -> Dict[str, Any]:
        return self._request("DELETE", f"/pastes/{paste_id}")

    def get_profile(self) -> Dict[str, Any]:
        return self._request("GET", "/users/profile")

    def update_profile(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._request("PATCH", "/users/profile", json=data)

    def get_me(self) -> Dict[str, Any]:
        return self._request("GET", "/auth/me")
