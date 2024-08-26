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
        except Token.DoesNotExist:
            data['user_id'] = None

        return Response(data)
    
class UserApiView(ListCreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = []
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = []
        for user in queryset:
            try:
                user_data = self.get_serializer(user).data
                data.append(user_data)
            except Exception as e:
                # Log the error
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
# class PostViewSet(viewsets.ModelViewSet):
#     queryset = Post.objects.all()
#     serializer_class = PostSerializer

# # Upvote ViewSet
# class UpvoteViewSet(viewsets.ModelViewSet):
#     queryset = Upvote.objects.all()
#     serializer_class = UpvoteSerializer

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
