import jwt
from django.conf import settings
from rest_framework import authentication, exceptions

from .models import Account

jwks_client = jwt.PyJWKClient(f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json")


class Auth0JWTAuthentication(authentication.BaseAuthentication):
    """Verify an 'Authorization: Bearer <token>' header against Auth0."""

    def authenticate(self, request):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return None

        token = header.removeprefix("Bearer ").strip()

        try:
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            claims = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience=settings.AUTH0_AUDIENCE,
                issuer=f"https://{settings.AUTH0_DOMAIN}/",
                options={"require": ["sub", "exp"]},
            )
        except (jwt.PyJWKClientError, jwt.InvalidTokenError) as exc:
            raise exceptions.AuthenticationFailed(f"Invalid token: {exc}") from exc

        account, _ = Account.objects.get_or_create(
            auth0_user_id=claims["sub"],
            defaults={"email": claims.get("email", "")},
        )
        return account, claims

    def authenticate_header(self, request):
        return "Bearer"
