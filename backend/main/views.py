from venv import logger
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .authentication import QueryParamTokenAuthentication
from .permission import IsOwnerOrReadOnly
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotAuthenticated, AuthenticationFailed
from django.core.exceptions import PermissionDenied
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .jwt import create_jwt_for_user, decode_refresh_token
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.views import APIView


class CustomObtainAuthToken(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # sourcery skip: remove-unnecessary-else, swap-if-else-branches
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            # Generate JWT tokens for the authenticated user
            tokens = create_jwt_for_user(user)
            
            # Prepare response data
            response_data = {
                'refresh': tokens['refresh'],
                'access': tokens['access'],
                'is_student': getattr(user.profile, 'is_student', False),
                'is_teacher': getattr(user.profile, 'is_teacher', False),
            }
            return Response(response_data, status=200)
        else:
            return Response({'detail': 'Invalid credentials'}, status=400)
    
class RefreshTokenView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')
        
        if not refresh_token:
            return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Decode the refresh token
            token = RefreshToken(refresh_token)
            user_id = token['user_id']
            
            # Fetch the user object from user_id
            user = User.objects.get(id=user_id)
            
            # Generate a new access token
            new_access_token = AccessToken.for_user(user)
            
            return Response({
                'access': str(new_access_token),
            })
        
        except (InvalidToken, User.DoesNotExist) as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class UserApiView(ListCreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = []
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        user_id = request.query_params.get('user_id')
        username = request.query_params.get('username')

        if user_id:
            user = get_object_or_404(User, id=user_id)
        elif username:
            user = get_object_or_404(User, username=username)
        else:
            queryset = self.get_queryset()
            data = []
            for user in queryset:
                try:
                    user_data = self.get_serializer(user).data
                    data.append(user_data)
                except Exception as e:
                    logger.error(f"Error serializing user {user.id}: {str(e)}")
            return Response(data)

        try:
            user_data = self.get_serializer(user).data
            return Response(user_data)
        except Exception as e:
            logger.error(f"Error serializing user {user.id}: {str(e)}")
            return Response({"error": "Error retrieving user data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



# UserProfileTeacher ViewSet with Custom Queryset Filtering
class UserProfileTeacherViewSet(viewsets.ModelViewSet):
    authentication_classes = [QueryParamTokenAuthentication]  # Custom authentication using query params
    permission_classes = [IsAuthenticated]  # Require authentication
    lookup_field = 'user_id'  # Use 'user_id' instead of 'pk'

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return UserProfileTeacherUpdateSerializer
        return UserProfileTeacherSerializer

    def get_queryset(self):
        queryset = UserProfileTeacher.objects.all()
        user_id = self.request.query_params.get('user_id')
        is_active = self.request.query_params.get('is_active')

        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)

        return queryset

    def get_object(self):
        queryset = self.get_queryset()
        filter_kwargs = {self.lookup_field: self.request.query_params.get(self.lookup_field)}
        obj = get_object_or_404(queryset, **filter_kwargs)
        # Ensure the user can only edit their own profile
        if obj.user != self.request.user:
            raise PermissionDenied("You don't have permission to edit this profile.")
        return obj

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


class UserProfileStudentViewSet(viewsets.ModelViewSet):
    authentication_classes = [QueryParamTokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'user_id'  # Use 'user_id' instead of 'pk'

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return UserProfileStudentUpdateSerializer
        return UserProfileStudentSerializer

    def get_queryset(self):
        queryset = UserProfileStudent.objects.all()
        user_id = self.request.query_params.get('user_id')
        is_active = self.request.query_params.get('is_active')

        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)

        return queryset

    def get_object(self):
        queryset = self.get_queryset()
        filter_kwargs = {self.lookup_field: self.request.query_params.get(self.lookup_field)}
        obj = get_object_or_404(queryset, **filter_kwargs)
        # Ensure the user can only edit their own profile
        if obj.user != self.request.user:
            raise PermissionDenied("You don't have permission to edit this profile.")
        return obj

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


# Post ViewSet
class PostViewSet(viewsets.ModelViewSet):
    authentication_classes = [QueryParamTokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Post.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return PostListSerializer
        return PostCreateSerializer

    def retrieve(self, request, *args, **kwargs):
        uuid = kwargs.get('pk')
        try:
            post = Post.objects.get(uuid=uuid)
        except Post.DoesNotExist:
            raise NotFound('Post not found.')

        serializer = self.get_serializer(post)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        edit_param = request.query_params.get('edit')
        if edit_param != 'true':
            return Response({'detail': 'Edit parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        uuid = kwargs.get('pk')
        try:
            post = Post.objects.get(uuid=uuid)
        except Post.DoesNotExist:
            raise NotFound('Post not found.')

        serializer = self.get_serializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        edit_param = request.query_params.get('edit')
        if edit_param != 'true':
            return Response({'detail': 'Edit parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        uuid = kwargs.get('pk')
        try:
            post = Post.objects.get(uuid=uuid)
        except Post.DoesNotExist:
            raise NotFound('Post not found.')

        serializer = self.get_serializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        uuid = kwargs.get('pk')
        try:
            post = Post.objects.get(uuid=uuid)
        except Post.DoesNotExist:
            raise NotFound('Post not found.')

        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def create(self, request, *args, **kwargs):
        token_key = request.query_params.get('token')
        if not token_key:
            return Response({'detail': 'Token query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = AccessToken(token_key)  # Verify and decode the JWT token
            user_id = token['user_id']  # Extract user ID from the token
            request.data._mutable = True  # Make request.data mutable
            request.data['user'] = user_id
            request.data._mutable = False  # Make request.data immutable
        except InvalidToken:
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def upvote(self, request, *args, **kwargs):
        post_uuid = kwargs.get('pk')
        token_key = request.query_params.get('token')
        if not token_key:
            return Response({'detail': 'Token query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = AccessToken(token_key)
            user_id = token['user_id']
        except InvalidToken:
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = Post.objects.get(uuid=post_uuid)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Remove any existing downvote
        Downvote.objects.filter(user_id=user_id, post=post).delete()

        # Toggle the upvote
        existing_upvote = Upvote.objects.filter(user_id=user_id, post=post).first()
        if existing_upvote:
            # Remove existing upvote
            existing_upvote.delete()
            return Response({'detail': 'Upvote removed.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            # Add new upvote
            Upvote.objects.create(user_id=user_id, post=post)
            return Response({'detail': 'Post upvoted.'}, status=status.HTTP_201_CREATED)


    def downvote(self, request, *args, **kwargs):
        post_uuid = kwargs.get('pk')
        token_key = request.query_params.get('token')
        if not token_key:
            return Response({'detail': 'Token query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = AccessToken(token_key)
            user_id = token['user_id']
        except InvalidToken:
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = Post.objects.get(uuid=post_uuid)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Remove any existing upvote
        Upvote.objects.filter(user_id=user_id, post=post).delete()

        # Toggle the downvote
        existing_downvote = Downvote.objects.filter(user_id=user_id, post=post).first()
        if existing_downvote:
            # Remove existing downvote
            existing_downvote.delete()
            return Response({'detail': 'Downvote removed.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            # Add new downvote
            Downvote.objects.create(user_id=user_id, post=post)
            return Response({'detail': 'Post downvoted.'}, status=status.HTTP_201_CREATED)
    


## Comment ViewSet
class CommentViewSet(viewsets.ModelViewSet):
    authentication_classes = [QueryParamTokenAuthentication]
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        # For list view, only fetch top-level comments (those without a parent)
        if self.action == 'list':
            return Comment.objects.filter(parent__isnull=True)
        # For other actions (retrieve, update, delete), allow access to all comments
        return Comment.objects.all()

    def create(self, request, *args, **kwargs):
        post_uuid = request.data.get('post')
        parent_id = request.data.get('parent')

        # Get the user from the token
        token_key = request.query_params.get('token')
        if not token_key:
            return Response({'detail': 'Token query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = AccessToken(token_key)  # Verify and decode the JWT token
            user_id = token['user_id']  # Extract user ID from the token
        except InvalidToken:
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the post and optionally the parent comment
        try:
            post = Post.objects.get(uuid=post_uuid)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        parent_comment = None
        if parent_id:
            try:
                parent_comment = Comment.objects.get(id=parent_id)
            except Comment.DoesNotExist:
                return Response({'detail': 'Parent comment not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Prepare data for the serializer
        data = request.data.copy()
        data['post'] = post.id
        data['user_id'] = user_id
        
        if parent_comment:
            data['parent'] = parent_comment.id
        else:
            data['parent'] = None

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class SeriesViewSet(viewsets.ModelViewSet):
    serializer_class = SeriesSerializer
    authentication_classes = [QueryParamTokenAuthentication]
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Series.objects.all()

    def get_token_user(self):
        token_key = self.request.query_params.get('token')
        if not token_key:
            raise NotAuthenticated(detail='Token query parameter is required.')

        try:
            token = AccessToken(token_key)  # Verify and decode the JWT token
            return token['user_id']  # Extract user ID from the token
        except InvalidToken:
            raise NotAuthenticated(detail='Invalid token.')

    def create(self, request, *args, **kwargs):
        user_id = self.get_token_user()

        data = request.data.copy()
        data['user'] = user_id  # Add user ID to the data

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        user_id = self.get_token_user()
        serializer.save(user_id=user_id)


class LectureViewSet(viewsets.ModelViewSet):
    serializer_class = LectureSerializer
    authentication_classes = [QueryParamTokenAuthentication]
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Lecture.objects.all()

    def get_token_user(self):
        token_key = self.request.query_params.get('token')
        if not token_key:
            raise NotAuthenticated(detail='Token query parameter is required.')

        try:
            # Verify and decode the JWT token
            token = AccessToken(token_key)
            user_id = token['user_id']  # Extract user ID from the token
            return user_id
        except InvalidToken:
            raise NotAuthenticated(detail='Invalid token.')

    def create(self, request, *args, **kwargs):
        user_id = self.get_token_user()

        data = request.data.copy()
        data['user'] = user_id  # Add user ID to the data

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        user_id = self.get_token_user()
        serializer.save(user_id=user_id)  # Save user ID in the Lecture instance

    def update(self, request, *args, **kwargs):
        user_id = self.get_token_user()

        instance = self.get_object()
        if instance.user_id != user_id:
            raise PermissionDenied(detail='You do not have permission to edit this lecture.')

        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user_id = self.get_token_user()

        instance = self.get_object()
        if instance.user_id != user_id:
            raise PermissionDenied(detail='You do not have permission to delete this lecture.')

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class StreamViewSet(viewsets.ModelViewSet):
    queryset = Stream.objects.all()
    serializer_class = StreamSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

class StandardViewSet(viewsets.ModelViewSet):
    queryset = Standard.objects.all()
    serializer_class = StandardSerializer
    authentication_classes = []
    permission_classes = [AllowAny]


# # LibAsset ViewSet
# class LibAssetViewSet(viewsets.ModelViewSet):
#     queryset = LibAsset.objects.all()
#     serializer_class = LibAssetSerializer


# # SaveLater ViewSet
# class SaveLaterViewSet(viewsets.ModelViewSet):
#     queryset = SaveLater.objects.all()
#     serializer_class = SaveLaterSerializer

# # Report ViewSet
# class ReportViewSet(viewsets.ModelViewSet):
#     queryset = Report.objects.all()
#     serializer_class = ReportSerializer

# # Dive ViewSet
# class DiveViewSet(viewsets.ModelViewSet):
#     queryset = Follow.objects.all()
#     serializer_class = DiveSerializer

# # Notification ViewSet
# class NotificationViewSet(viewsets.ModelViewSet):
#     queryset = Notification.objects.all()
#     serializer_class = NotificationSerializer
