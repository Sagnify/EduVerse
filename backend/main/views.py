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
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ObjectDoesNotExist
from django.core.exceptions import PermissionDenied
from rest_framework import status
from rest_framework.exceptions import NotFound

class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        data = response.data

        try:
            user = Token.objects.get(key=data['token']).user
            data['user_id'] = user.id
            data['is_student'] = user.profile.is_student
            data['is_teacher'] = user.profile.is_teacher

        except Token.DoesNotExist:
            data['user_id'] = None
            data['is_student'] = False
            data['is_teacher'] = False

        return Response(data)
    
class UserApiView(ListCreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = []
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        user_id = request.query_params.get('user_id')
        if user_id:
            user = get_object_or_404(User, id=user_id)
            try:
                user_data = self.get_serializer(user).data
                return Response(user_data)
            except Exception as e:
                logger.error(f"Error serializing user {user.id}: {str(e)}")
                return Response({"error": "Error retrieving user data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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
            token = Token.objects.get(key=token_key)
            user = token.user
        except Token.DoesNotExist:
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

        # Include the user ID in the data
        request.data._mutable = True  # Make request.data mutable
        request.data['user'] = user.id
        request.data._mutable = False  # Make request.data immutable

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
            return Response({'detail': 'Upvote removed.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            # Add new upvote
            Upvote.objects.create(user=user, post=post)
            return Response({'detail': 'Post upvoted.'}, status=status.HTTP_201_CREATED)


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
            return Response({'detail': 'Downvote removed.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            # Add new downvote
            Downvote.objects.create(user=user, post=post)
            return Response({'detail': 'Post downvoted.'}, status=status.HTTP_201_CREATED)

    


# # Comment ViewSet
# class CommentViewSet(viewsets.ModelViewSet):
#     queryset = Comment.objects.all()
#     serializer_class = CommentSerializer

# # LibAsset ViewSet
# class LibAssetViewSet(viewsets.ModelViewSet):
#     queryset = LibAsset.objects.all()
#     serializer_class = LibAssetSerializer

# # Lecture ViewSet
# class LectureViewSet(viewsets.ModelViewSet):
#     queryset = Lecture.objects.all()
#     serializer_class = LectureSerializer

# # Stream ViewSet
# class StreamViewSet(viewsets.ModelViewSet):
#     queryset = Stream.objects.all()
#     serializer_class = StreamSerializer

# # Subject ViewSet
# class SubjectViewSet(viewsets.ModelViewSet):
#     queryset = Subject.objects.all()
#     serializer_class = SubjectSerializer

# # Standard ViewSet
# class StandardViewSet(viewsets.ModelViewSet):
#     queryset = Standard.objects.all()
#     serializer_class = StandardSerializer

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
