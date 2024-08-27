from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *


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
    student_profile = UserProfileStudentSerializer(required=False)
    teacher_profile = UserProfileTeacherSerializer(required=False)
    
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
    




# class PostSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Post
#         fields = '__all__'

# class UpvoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Upvote
#         fields = '__all__'

# class CommentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Comment
#         fields = '__all__'

# class LibAssetSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = LibAsset
#         fields = '__all__'

# class LectureSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Lecture
#         fields = '__all__'

# class StreamSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Stream
#         fields = '__all__'

# class SubjectSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Subject
#         fields = '__all__'

# class StandardSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Standard
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
