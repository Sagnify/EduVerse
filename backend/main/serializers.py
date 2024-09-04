from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *

## User Serializers 

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['is_student', 'is_teacher']

    def validate(self, data):
        if data.get('is_student') == data.get('is_teacher'):
            raise serializers.ValidationError("User must be either a student or a teacher, not both/neither.")
        return data

# UserProfileStudent Serializer
class UserProfileStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfileStudent
        fields = ['phone_number', 'profile_pic', 'address', 'gender', 'stream', 'standard']

class UserProfileStudentUpdateSerializer(serializers.ModelSerializer):
    # first_name = serializers.CharField(source='user.first_name', required=False)
    # last_name = serializers.CharField(source='user.last_name', required=False)

    class Meta:
        model = UserProfileStudent
        fields = ['phone_number', 'profile_pic', 'address', 'gender', 'stream', 'standard']

    # def update(self, instance, validated_data):
    #     user_data = validated_data.pop('user', None)
    #     # Update User fields
    #     if user_data:
    #         instance.user.first_name = user_data.get('first_name', instance.user.first_name)
    #         instance.user.last_name = user_data.get('last_name', instance.user.last_name)
    #         instance.user.save()
        
    #     # Update UserProfileTeacher fields
    #     return super().update(instance, validated_data)

# UserProfileTeacher Serializer
class UserProfileTeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfileTeacher
        fields = ['phone_number', 'profile_pic', 'rating', 'bio']
        read_only_fields = ['rating']  # Assuming rating shouldn't be directly editable

class UserProfileTeacherUpdateSerializer(serializers.ModelSerializer):
    # first_name = serializers.CharField(source='user.first_name', required=False)
    # last_name = serializers.CharField(source='user.last_name', required=False)

    class Meta:
        model = UserProfileTeacher
        fields = ['phone_number', 'profile_pic', 'bio']

    # def update(self, instance, validated_data):
    #     user_data = validated_data.pop('user', None)
    #     # Update User fields
    #     if user_data:
    #         instance.user.first_name = user_data.get('first_name', instance.user.first_name)
    #         instance.user.last_name = user_data.get('last_name', instance.user.last_name)
    #         instance.user.save()
        
    #     # Update UserProfileTeacher fields
    #     return super().update(instance, validated_data)

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    student_profile = UserProfileStudentSerializer(required=False, allow_null=True)
    teacher_profile = UserProfileTeacherSerializer(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password', 'profile', 'student_profile', 'teacher_profile']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        student_data = validated_data.pop('student_profile', None)
        teacher_data = validated_data.pop('teacher_profile', None)

        user = User.objects.create_user(
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            username=validated_data['username'],
            email=validated_data['email'],
            # password=validated_data['password']
        )
        user.set_password(validated_data['password'])
        user.save()

        UserProfile.objects.update_or_create(
            user=user,
            defaults=profile_data
        )

        try:
            if profile_data['is_student'] and student_data:
                UserProfileStudent.objects.create(user=user, **student_data)
            elif profile_data['is_teacher'] and teacher_data:
                UserProfileTeacher.objects.create(user=user, **teacher_data)
        except Exception as e:
            user.delete()
            raise serializers.ValidationError(f"Error creating profile: {str(e)}")

        return user

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        try:
            if instance.profile.is_student:
                try:
                    student_profile = UserProfileStudentSerializer(instance.student_profile).data
                    representation['student_profile'] = student_profile
                except UserProfileStudent.DoesNotExist:
                    representation['student_profile'] = None
                representation.pop('teacher_profile', None)
            elif instance.profile.is_teacher:
                try:
                    teacher_profile = UserProfileTeacherSerializer(instance.teacher_profile).data
                    representation['teacher_profile'] = teacher_profile
                except UserProfileTeacher.DoesNotExist:
                    representation['teacher_profile'] = None
                representation.pop('student_profile', None)
            else:
                representation.pop('student_profile', None)
                representation.pop('teacher_profile', None)
        except UserProfile.DoesNotExist:
            representation['profile'] = None
            representation.pop('student_profile', None)
            representation.pop('teacher_profile', None)
        return representation
    



## Post Serializers
class PostListSerializer(serializers.ModelSerializer):
    # user = serializers.ReadOnlyField(source='user.username')
    user = UserSerializer()
    upvote_count = serializers.SerializerMethodField()
    downvote_count = serializers.SerializerMethodField()
    total_vote = serializers.SerializerMethodField()
    has_upvoted = serializers.SerializerMethodField()
    has_downvoted = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'created_at', 'user', 'caption', 'post_img_url', 'uuid', 'upvote_count', 'downvote_count', 'total_vote', 'has_upvoted', 'has_downvoted']

    def get_upvote_count(self, obj):
        return Upvote.objects.filter(post=obj).count()

    def get_downvote_count(self, obj):
        return Downvote.objects.filter(post=obj).count()
    
    def get_total_vote(self, obj):
        upvote_count = self.get_upvote_count(obj)
        downvote_count = self.get_downvote_count(obj)
        return upvote_count - downvote_count

    def get_has_upvoted(self, obj):
        user = self.context.get('request').user
        return Upvote.objects.filter(post=obj, user=user).exists()

    def get_has_downvoted(self, obj):
        user = self.context.get('request').user
        return Downvote.objects.filter(post=obj, user=user).exists()



class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['caption', 'post_img_url','user']
        extra_kwargs = {
            'user': {'read_only': True}  # Ensure user is set internally
        }



class CommentSerializer(serializers.ModelSerializer):
    # replies = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'created_at', 'comment_caption']
        read_only_fields = ['user', 'created_at']

    # def get_replies(self, obj):
    #     replies = Comment.objects.filter(parent=obj)
    #     serializer = CommentSerializer(replies, many=True)
    #     return serializer.data

    def get_user(self, obj):
        return obj.user.username

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Ensure that the user cannot be changed during update
        validated_data.pop('user', None)
        return super().update(instance, validated_data)


class LectureSerializer(serializers.ModelSerializer):
    series = serializers.PrimaryKeyRelatedField(queryset=Series.objects.none(), required=True)
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.none(), required=True)
    rating = serializers.FloatField(read_only=True)
    is_verified = serializers.BooleanField(read_only=True)

    class Meta:
        model = Lecture
        fields = [
            'id', 'lecture_url', 'thumbnail_url', 'title', 'description', 
            'stream', 'subject', 'standard', 'asset_sel', 'rating', 
            'visibility', 'is_verified', 'series'
        ]

    def __init__(self, *args, **kwargs):
        super(LectureSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request', None)

        if request:
            user = request.user

            if user.is_authenticated:
                # Filter series queryset based on the logged-in user
                self.fields['series'].queryset = Series.objects.filter(user=user)

                # Filter subjects based on the selected stream
                if request.method in ['POST', 'PUT', 'PATCH']:
                    stream_id = request.data.get('stream')
                    if stream_id:
                        try:
                            stream_id = int(stream_id)
                            self.fields['subject'].queryset = Subject.objects.filter(stream_id=stream_id)
                        except (ValueError, TypeError):
                            self.fields['subject'].queryset = Subject.objects.none()
                    else:
                        self.fields['subject'].queryset = Subject.objects.all()
                else:
                    # For GET requests, do not filter subjects
                    self.fields['subject'].queryset = Subject.objects.all()
            else:
                # Handle the case where the user is not authenticated
                self.fields['series'].queryset = Series.objects.none()
                self.fields['subject'].queryset = Subject.objects.none()



class SeriesSerializer(serializers.ModelSerializer):
    lecture_count = serializers.IntegerField(read_only=True)
    user = serializers.ReadOnlyField(source='user.username')  # Show username or other user info

    class Meta:
        model = Series
        fields = ['id', 'title', 'description', 'created_at', 'user', 'lecture_count']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['lecture_count'] = instance.lectures.count()  # Use 'lectures' based on the related_name
        return representation
   

class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ['user', 'series', 'last_watched_lecture', 'updated_at']
        read_only_fields = ['user', 'updated_at']



class StreamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stream
        fields = ['id', 'name']

class SubjectSerializer(serializers.ModelSerializer):
    stream = serializers.CharField(source='stream.name', read_only=True)
    stream_id = serializers.PrimaryKeyRelatedField(queryset=Stream.objects.all(), source='stream')

    class Meta:
        model = Subject
        fields = ['id', 'name', 'stream', 'stream_id']

class StandardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Standard
        fields = ['id', 'name']  # Add 'subject' and 'stream' fields if relationships are included


# class LibAssetSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = LibAsset
#         fields = '__all__'


# class SaveLaterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = SaveLater
#         fields = '__all__'

# class ReportSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Report
#         fields = '__all__'

# class DiveSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Follow
#         fields = '__all__'

# class NotificationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Notification
#         fields = '__all__'
