from django.urls import path
from . import views

urlpatterns = [
    # path('users/', UserListCreateView.as_view(), name='user-list-create'),
    # path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('users/', views.UserApiView.as_view()),
    path('token-auth', views.CustomObtainAuthToken.as_view(), name='token_auth'),

    path('userprofiles/student/', views.UserProfileStudentViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='userprofilestudent-list-create'),
    # path('userprofiles/student/<pk>/', views.UserProfileStudentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='userprofilestudent-detail'),

    path('userprofiles/teacher/', views.UserProfileTeacherViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='userprofileteacher-list-create'),
    # path('userprofiles/teacher/<pk>/', views.UserProfileTeacherViewSet.as_view({ 'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='userprofileteacher-detail'),

    path('posts/', views.PostViewSet.as_view({'get': 'list', 'post': 'create'}), name='post-list-create'),
    path('posts/<uuid:pk>/', views.PostViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='post-detail'),

    path('posts/<uuid:pk>/upvote/', views.PostViewSet.as_view({'post': 'upvote'}), name='post-upvote'),
    path('posts/<uuid:pk>/downvote/', views.PostViewSet.as_view({'post': 'downvote'}), name='post-downvote'),

    path('comments/', views.CommentViewSet.as_view({'get': 'list', 'post': 'create'}), name='comment-list-create'),
    path('comments/<int:pk>/', views.CommentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='comment-detail'),

    # path('libassets/', LibAssetListCreateView.as_view(), name='libasset-list-create'),
    # path('libassets/<int:pk>/', LibAssetDetailView.as_view(), name='libasset-detail'),

    # path('lectures/', LectureListCreateView.as_view(), name='lecture-list-create'),
    # path('lectures/<int:pk>/', LectureDetailView.as_view(), name='lecture-detail'),

    # path('streams/', StreamListCreateView.as_view(), name='stream-list-create'),
    # path('streams/<int:pk>/', StreamDetailView.as_view(), name='stream-detail'),

    # path('subjects/', SubjectListCreateView.as_view(), name='subject-list-create'),
    # path('subjects/<int:pk>/', SubjectDetailView.as_view(), name='subject-detail'),

    # path('standards/', StandardListCreateView.as_view(), name='standard-list-create'),
    # path('standards/<int:pk>/', StandardDetailView.as_view(), name='standard-detail'),

    # path('savelater/', SaveLaterListCreateView.as_view(), name='savelater-list-create'),
    # path('savelater/<int:pk>/', SaveLaterDetailView.as_view(), name='savelater-detail'),

    # path('reports/', ReportListCreateView.as_view(), name='report-list-create'),
    # path('reports/<int:pk>/', ReportDetailView.as_view(), name='report-detail'),

    # path('dives/', DiveListCreateView.as_view(), name='dive-list-create'),
    # path('dives/<int:pk>/', DiveDetailView.as_view(), name='dive-detail'),

    # path('notifications/', NotificationListCreateView.as_view(), name='notification-list-create'),
    # path('notifications/<int:pk>/', NotificationDetailView.as_view(), name='notification-detail'),
]
