
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("new_post", views.compose, name="compose"),
    path("posts", views.posts, name="posts"),
    path("posts/<int:user_id>", views.posts, name="user_posts")
]
