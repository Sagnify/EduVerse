import uuid
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token



# UserProfile Model
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_student = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

# UserProfileStudent Model
class UserProfileStudent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    # name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, default=" ")
    profile_pic = models.URLField(blank=True, null=True)
    address = models.TextField(default="")
    gender = models.CharField(max_length=10, default=" ")
    stream = models.CharField(max_length=50, default=" ")
    standard = models.CharField(max_length=50, default=" ")

    def __str__(self):
        return self.name

# UserProfileTeacher Model
class UserProfileTeacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
    # name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, default=" ")
    profile_pic = models.URLField(blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    bio = models.TextField(default=" ")

    def __str__(self):
        return self.name

# Signal to create auth token when user is created
@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)



class Stream(models.Model):
    name = models.CharField(max_length=100)

class Subject(models.Model):
    name = models.CharField(max_length=100)
    stream = models.ForeignKey(Stream, on_delete=models.CASCADE)

class Standard(models.Model):
    name = models.CharField(max_length=100)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    stream = models.ForeignKey(Stream, on_delete=models.CASCADE)

class Post(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    caption = models.TextField()
    post_img_url = models.URLField(max_length=200)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

class Upvote(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    comment_caption = models.TextField()
    parent_id = models.IntegerField(blank=True, null=True)

class LibAsset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    visibility = models.BooleanField(default=True)
    asset_url = models.URLField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    stream = models.ForeignKey(Stream, on_delete=models.CASCADE)
    standard = models.ForeignKey(Standard, on_delete=models.CASCADE)
    is_verified = models.BooleanField(default=False)

class Lecture(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    stream = models.ForeignKey(Stream, on_delete=models.CASCADE)
    standard = models.ForeignKey(Standard, on_delete=models.CASCADE)
    views = models.IntegerField(default=0)
    asset_sel = models.ForeignKey(LibAsset, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    visibility = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)

class SaveLater(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE, blank=True, null=True)
    libasset = models.ForeignKey(LibAsset, on_delete=models.CASCADE, blank=True, null=True)

class Report(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, blank=True, null=True)
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE, blank=True, null=True)
    asset = models.ForeignKey(LibAsset, on_delete=models.CASCADE, blank=True, null=True)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Follow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follower")
    created_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    icon = models.CharField(max_length=100)
    title = models.CharField(max_length=255)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_seen = models.BooleanField(default=False)
