from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenBackendError
from django.contrib.auth import get_user_model


class QueryParamTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):  # sourcery skip: use-fstring-for-formatting
        token_key = request.query_params.get('token')  # Get token from query parameters
        if not token_key:
            return None

        try:
            # Decode the token and extract user_id
            access_token = AccessToken(token_key)
            user_id = access_token['user_id']
        except Exception as e:
            raise AuthenticationFailed('Invalid token. {}'.format(str(e)))

        try:
            user = get_user_model().objects.get(id=user_id)
        except get_user_model().DoesNotExist:
            raise AuthenticationFailed('User not found.')

        return (user, access_token)
    
