from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    def serialize(self, requester):
        
        try:
            followers = self.followers.first().follower.all()
        except:
            followers = []

        return {
            "id": self.id,
            "name": self.username,
            "followers_count": self.followers.all().count(),
            "is_following": True if requester in followers else False,
            "following_count": self.follows.all().count()
        }


#POST
class Post(models.Model):
    content = models.CharField(max_length=255)
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name='posts')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.content}"

    def serialize(self):
        return {
            "id": self.id,
            "poster": self.user.username,
            "poster_id": self.user.id,
            "content": self.content,
            "timestamp": self.timestamp.ctime(),
            "likes": self.likes.all().count()
        }

#LIKE
class Like(models.Model):
    post = models.ForeignKey("Post", on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name='likes_given')
    like = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user} likes {self.post}"

#FOLLOW
class Follow(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name='followers')
    follower = models.ManyToManyField("User", related_name='follows')