from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authtoken.models import Token

class QueryParamTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token_key = request.query_params.get('token')  # Get token from query parameters
        if not token_key:
            return None

        try:
            token = Token.objects.get(key=token_key)
        except Token.DoesNotExist:
            raise AuthenticationFailed('Invalid token.')

        return (token.user, token)

