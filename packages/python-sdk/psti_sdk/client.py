import requests
from typing import Optional, Dict, Any

from .exceptions import PstiAPIError
from .resources.pastes import PastesResource
from .resources.users import UsersResource
from .resources.auth import AuthResource

class PstiClient:
    def __init__(self, base_url: str, token: Optional[str] = None):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        if token:
            self.set_token(token)

        self.pastes = PastesResource(self)
        self.users = UsersResource(self)
        self.auth = AuthResource(self)

    def set_token(self, token: str):
        self.session.headers.update({"Authorization": f"Bearer {token}"})

    def clear_token(self):
        self.session.headers.pop("Authorization", None)

    def request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
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
            raise PstiAPIError(error_message)
            
        return data
