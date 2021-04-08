from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


#POST
class Post(models.Model):
    content = models.CharField(max_length=255)
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name='posts')

    def __str__(self):
        return f"{self.content}"

    def serialize(self):
        return {
            "id": self.id,
            "poster": self.user,
            "content": self.content,
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

    def __str__(self):
        return f"{self.follower.all()} follows {self.user}"