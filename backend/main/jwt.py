
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken


def create_jwt_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def decode_refresh_token(token):
    try:
        # Decode the refresh token using SimpleJWT's RefreshToken class
        refresh_token = RefreshToken(token)
        
        # You can access the token's payload (decoded data) like this
        payload = refresh_token.payload
        
        return payload
    
    except TokenError as e:
        raise InvalidToken(f"Invalid refresh token: {str(e)}")