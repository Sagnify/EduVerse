from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenBackendError
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token


class QueryParamTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token_key = request.query_params.get('token')  # Get token from query parameters
        if not token_key:
            return None

        try:
            # Retrieve the token and corresponding user
            token = Token.objects.get(key=token_key)
        except Token.DoesNotExist:
            raise AuthenticationFailed('Invalid token.')

        return (token.user, token)
    
