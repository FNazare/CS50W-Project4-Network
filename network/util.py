from .models import *


def get_posts(users):
    posts_ids = []
    for user in users:
        for p in user.posts.all():
            posts_ids.append(p.id)
    return Post.objects.filter(id__in=posts_ids).order_by("-timestamp")