from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('users/', views.UserApiView.as_view()),
    path('token-auth', views.CustomObtainAuthToken.as_view(), name='token_auth'),
    path('token-auth/refresh/', views.RefreshTokenView.as_view(), name='token_refresh'),

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

    path('series/', views.SeriesViewSet.as_view({'get': 'list', 'post': 'create'}), name='series-list-create'),
    path('series/<int:pk>/', views.SeriesViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='series-detail'),

    # path('libassets/', LibAssetListCreateView.as_view(), name='libasset-list-create'),
    # path('libassets/<int:pk>/', LibAssetDetailView.as_view(), name='libasset-detail'),

    path('lectures/', views.LectureViewSet.as_view({'get': 'list', 'post': 'create'}), name='lecture-list-create'),
    path('lectures/<int:pk>/', views.LectureViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='lecture-detail'),

    path('streams/', views.StreamViewSet.as_view({'get': 'list', 'post': 'create'}), name='stream-list'),
    path('streams/<int:pk>/', views.StreamViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='stream-detail'),

    path('subjects/', views.SubjectViewSet.as_view({'get': 'list', 'post': 'create'}), name='subject-list'),
    path('subjects/<int:pk>/', views.SubjectViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='subject-detail'),

    path('standards/', views.StandardViewSet.as_view({'get': 'list', 'post': 'create'}), name='standard-list'),
    path('standards/<int:pk>/', views.StandardViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='standard-detail'),

    # path('savelater/', SaveLaterListCreateView.as_view(), name='savelater-list-create'),
    # path('savelater/<int:pk>/', SaveLaterDetailView.as_view(), name='savelater-detail'),

    # path('reports/', ReportListCreateView.as_view(), name='report-list-create'),
    # path('reports/<int:pk>/', ReportDetailView.as_view(), name='report-detail'),

    # path('dives/', DiveListCreateView.as_view(), name='dive-list-create'),
    # path('dives/<int:pk>/', DiveDetailView.as_view(), name='dive-detail'),

    # path('notifications/', NotificationListCreateView.as_view(), name='notification-list-create'),
    # path('notifications/<int:pk>/', NotificationDetailView.as_view(), name='notification-detail'),
]
