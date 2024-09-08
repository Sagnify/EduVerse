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
from rest_framework.exceptions import NotAuthenticated, ValidationError
from django.core.exceptions import PermissionDenied
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
# from .jwt import create_jwt_for_user, decode_refresh_token
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.views import APIView
from .aimod import *


class CustomObtainAuthToken(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        # sourcery skip: remove-unnecessary-else, swap-if-else-branches
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            # Generate or retrieve the token for the authenticated user
            token, _ = Token.objects.get_or_create(user=user)
            
            # Prepare response data
            response_data = {
                'token': token.key,
                'is_student': getattr(user.profile, 'is_student', False),
                'is_teacher': getattr(user.profile, 'is_teacher', False),
            }
            return Response(response_data, status=200)
        else:
            return Response({'detail': 'Invalid credentials'}, status=400)
    
        

class UserApiView(ListCreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = [QueryParamTokenAuthentication]  # Use DRF's TokenAuthentication
    permission_classes = [AllowAny]  # AllowAny can be replaced with IsAuthenticated if needed

    def list(self, request, *args, **kwargs):
        show_my = request.query_params.get('show_my') == 'true'
        if show_my:
            if not request.user.is_authenticated:
                raise NotAuthenticated(detail='Authentication is required to access your details.')

            user = request.user
            try:
                user_data = self.get_serializer(user).data
                return Response(user_data)
            except Exception as e:
                logger.error(f"Error serializing user {user.id}: {str(e)}")
                return Response({"error": "Error retrieving user data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

            # Automatically create a token for the new user
            user = serializer.instance
            token, created = Token.objects.get_or_create(user=user)

            # Include the token in the response data
            response_data = serializer.data
            response_data['token'] = token.key

            return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            return Response({"error": "Error creating user"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



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
    queryset = Post.objects.all().order_by('-created_at')

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
        # Get token from query parameters
        token_key = request.query_params.get('token')
        if not token_key:
            return Response({'detail': 'Token query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            logger.debug(f"User found: {user.id}")
        except Token.DoesNotExist:
            logger.error(f"Invalid token: {token_key}")
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a mutable copy of the request data and attach user ID
        mutable_data = request.data.copy()
        mutable_data['user'] = user.id
        
        logger.debug(f"Request data: {mutable_data}")

        # Check for an image URL in the request
        image_url = mutable_data.get('post_img_url')
        if image_url:
            # Analyze the image to get a description and determine if it is educational
            image_description, has_educational_labels = analyze_image_with_vision(image_url)
            
            if image_description:
                # Use Gemini to check if the image description is educational
                is_image_educational = moderate_post_with_gemini(image_description, has_educational_labels)
                
                if not is_image_educational:
                    logger.error(f"Image description failed moderation: {image_description}")
                    return Response({'detail': 'Image content is not educational.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                logger.error("Failed to analyze the image.")
                return Response({'detail': 'Failed to analyze the image.'}, status=status.HTTP_400_BAD_REQUEST)

        # Moderation step: check 'caption' with Gemini AI
        caption = mutable_data.get('caption')
        if caption and not moderate_post_with_gemini(caption):
            logger.error(f"Post caption failed moderation: {caption}")
            return Response({'detail': 'Post caption is not educational.'}, status=status.HTTP_400_BAD_REQUEST)

        # Serialize and save the data
        serializer = self.get_serializer(data=mutable_data)
        if serializer.is_valid():
            logger.debug(f"Serializer is valid. Data: {serializer.validated_data}")
            serializer.save(user=user)  # Explicitly pass the user when saving
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    
    def upvote(self, request, *args, **kwargs):
        post_uuid = kwargs.get('pk')
        token_key = request.query_params.get('token')
        if not token_key:
            return Response({'detail': 'Token query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=token_key)
            user = token.user
        except Token.DoesNotExist:
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = Post.objects.get(uuid=post_uuid)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Remove any existing downvote
        Downvote.objects.filter(user=user, post=post).delete()

        # Toggle the upvote
        existing_upvote = Upvote.objects.filter(user=user, post=post).first()
        if existing_upvote:
            # Remove existing upvote
            existing_upvote.delete()
            return Response({'detail': 'Upvote removed.', 'status': 0}, status=status.HTTP_200_OK)
        else:
            # Add new upvote
            Upvote.objects.create(user=user, post=post)
            return Response({'detail': 'Post upvoted.', 'status' : 1}, status=status.HTTP_201_CREATED)


    def downvote(self, request, *args, **kwargs):
        post_uuid = kwargs.get('pk')
        token_key = request.query_params.get('token')
        if not token_key:
            return Response({'detail': 'Token query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=token_key)
            user = token.user
        except Token.DoesNotExist:
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = Post.objects.get(uuid=post_uuid)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Remove any existing upvote
        Upvote.objects.filter(user=user, post=post).delete()

        # Toggle the downvote
        existing_downvote = Downvote.objects.filter(user=user, post=post).first()
        if existing_downvote:
            # Remove existing downvote
            existing_downvote.delete()
            return Response({'detail': 'Downvote removed.', 'status' : 0}, status=status.HTTP_200_OK)
        else:
            # Add new downvote
            Downvote.objects.create(user=user, post=post)
            return Response({'detail': 'Post downvoted.', 'status': 1}, status=status.HTTP_201_CREATED)
        


## Comment ViewSet
class CommentViewSet(viewsets.ModelViewSet):
    authentication_classes = [QueryParamTokenAuthentication]
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = CommentSerializer

    def get_queryset(self):
        post_uuid = self.kwargs.get('post_uuid')
        if post_uuid:
            try:
                post = Post.objects.get(uuid=post_uuid)
                # Fetch top-level comments only, no replies
                return Comment.objects.filter(post=post)
            except Post.DoesNotExist:
                return Comment.objects.none()

        # For other actions (retrieve, update, delete), allow access to all comments
        return Comment.objects.all()

    def create(self, request, *args, **kwargs):
        post_uuid = request.data.get('post')

        # Get the user from the authenticated request
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication is required.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Fetch the post
        try:
            post = Post.objects.get(uuid=post_uuid)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Prepare data for the serializer
        data = request.data.copy()
        data['post'] = post.id
        data['user'] = user.id
        data['parent'] = None  # Ensure no parent comment (no replies)

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

    def create(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            raise NotAuthenticated(detail='Authentication is required.')

        data = request.data.copy()
        data['user'] = user.id  # Add user ID to the data

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LectureViewSet(viewsets.ModelViewSet):
    serializer_class = LectureSerializer
    authentication_classes = [QueryParamTokenAuthentication]
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Lecture.objects.all()

    def create(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            raise NotAuthenticated(detail='Authentication is required.')

        data = request.data.copy()
        data['user'] = user.id  # Add user ID to the data

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            raise NotAuthenticated(detail='Authentication is required.')

        instance = self.get_object()
        if instance.user != user:
            raise PermissionDenied(detail='You do not have permission to edit this lecture.')

        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            raise NotAuthenticated(detail='Authentication is required.')

        instance = self.get_object()
        if instance.user != user:
            raise PermissionDenied(detail='You do not have permission to delete this lecture.')

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

   
class UserProgressViewSet(viewsets.ModelViewSet):
    authentication_classes = [QueryParamTokenAuthentication]
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = UserProgressSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned progress to the user
        if ?me=true is provided in the query parameters.
        """
        queryset = UserProgress.objects.all()
        me = self.request.query_params.get('me', None)

        if me == 'true' and self.request.user.is_authenticated:
            # Return progress only for the authenticated user
            queryset = queryset.filter(user=self.request.user)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        series = serializer.validated_data.get('series')
        last_watched_lecture = serializer.validated_data.get('last_watched_lecture')

        # Try to get the existing record
        progress, created = UserProgress.objects.get_or_create(
            user=user,
            defaults={'series': series, 'last_watched_lecture': last_watched_lecture}
        )

        if not created:
            # If record exists, update the series and progress
            progress.series = series
            progress.last_watched_lecture = last_watched_lecture
            progress.save()

        # Return the updated or created progress
        serializer.instance = progress

    def update(self, request, *args, **kwargs):
        """
        Update an existing progress record. Only allowed if ?me=true is provided
        in the query parameters.
        """
        me = request.query_params.get('me', None)

        if me != 'true':
            return Response({'detail': 'Updates are only allowed with ?me=true.'}, status=status.HTTP_403_FORBIDDEN)

        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        """
        Partially update an existing progress record. Only allowed if ?me=true is provided
        in the query parameters.
        """
        me = request.query_params.get('me', None)

        if me != 'true':
            return Response({'detail': 'Partial updates are only allowed with ?me=true.'}, status=status.HTTP_403_FORBIDDEN)

        return super().partial_update(request, *args, **kwargs)
    


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


# LibAsset ViewSet
class LibAssetViewSet(viewsets.ModelViewSet):
    queryset = LibAsset.objects.all()
    serializer_class = LibAssetSerializer
    authentication_classes = [QueryParamTokenAuthentication]
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        uuid = kwargs.get('pk')
        try:
            asset = LibAsset.objects.get(uuid=uuid)
        except LibAsset.DoesNotExist:
            raise NotFound('Asset not found.')

        serializer = self.get_serializer(asset)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        uuid = kwargs.get('pk')
        try:
            asset = LibAsset.objects.get(uuid=uuid)
        except LibAsset.DoesNotExist:
            raise NotFound('Asset not found.')

        serializer = self.get_serializer(asset, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        uuid = kwargs.get('pk')
        try:
            asset = LibAsset.objects.get(uuid=uuid)
        except LibAsset.DoesNotExist:
            raise NotFound('Asset not found.')

        serializer = self.get_serializer(asset, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        uuid = kwargs.get('pk')
        try:
            asset = LibAsset.objects.get(uuid=uuid)
        except LibAsset.DoesNotExist:
            raise NotFound('Asset not found.')

        self.perform_destroy(asset)
        return Response(status=status.HTTP_204_NO_CONTENT)




class FollowViewSet(viewsets.ModelViewSet):
    serializer_class = FollowSerializer
    permission_classes = [IsOwnerOrReadOnly]
    authentication_classes = [QueryParamTokenAuthentication]

    def get_queryset(self):
        # Ensure users only interact with follows relevant to them
        return Follow.objects.filter(follower=self.request.user)

    def perform_create(self, serializer):
        follower = self.request.user
        user = serializer.validated_data['user']

        # Prevent users from following themselves
        if follower == user:
            raise serializers.ValidationError("You cannot follow yourself.")
        
        # Check if the user is already following the target user
        if Follow.objects.filter(follower=follower, user=user).exists():
            raise serializers.ValidationError("You are already following this user.")
        
        serializer.save(follower=follower)

    def create(self, request, *args, **kwargs):
        # Extract the token from the query parameters
        token_key = request.query_params.get('token')
        if not token_key:
            return Response({"detail": "Token is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
        except Token.DoesNotExist:
            return Response({"detail": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Handle the follow/unfollow logic
        user_id = request.data.get('user')
        target_user = User.objects.filter(pk=user_id).first()  # Safe lookup

        if not target_user:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if user == target_user:
            return Response({"detail": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the follow relationship already exists
        follow, created = Follow.objects.get_or_create(follower=user, user=target_user)
        
        if not created:
            # If the follow relationship already exists, delete it (unfollow)
            follow.delete()
            return Response({"detail": "Unfollowed the user."}, status=status.HTTP_204_NO_CONTENT)

        # If the follow relationship did not exist, create it
        return Response({"detail": "Followed the user."}, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            follow = self.get_queryset().get(pk=pk)
        except Follow.DoesNotExist:
            raise NotFound('Follow record not found.')

        serializer = self.get_serializer(follow)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            follow = self.get_queryset().get(pk=pk)
        except Follow.DoesNotExist:
            raise NotFound('Follow record not found.')

        follow.delete()
        return Response({"detail": "Successfully unfollowed the user."}, status=status.HTTP_204_NO_CONTENT)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def list_followers(self, request, *args, **kwargs):
        followers = Follow.objects.filter(user=request.user)
        serializer = self.get_serializer(followers, many=True)
        return Response(serializer.data)

    def list_following(self, request, *args, **kwargs):
        following = Follow.objects.filter(follower=request.user)
        serializer = self.get_serializer(following, many=True)
        return Response(serializer.data)

# # SaveLater ViewSet
# class SaveLaterViewSet(viewsets.ModelViewSet):
#     queryset = SaveLater.objects.all()
#     serializer_class = SaveLaterSerializer

# # Report ViewSet
# class ReportViewSet(viewsets.ModelViewSet):
#     queryset = Report.objects.all()
#     serializer_class = ReportSerializer

# # Notification ViewSet
# class NotificationViewSet(viewsets.ModelViewSet):
#     queryset = Notification.objects.all()
#     serializer_class = NotificationSerializer
