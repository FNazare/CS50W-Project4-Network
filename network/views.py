from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Post, Like, Follow

@csrf_exempt
@login_required
def compose(request):
    if request.method == 'POST':
        p = Post (content=request.POST["content"], user=request.user)
        print(p)
        p.save()
        return HttpResponseRedirect(reverse('index'))


def posts(request, user_id = None):

    if user_id == None:
        # Returns all posts
        posts = Post.objects.all()
        return JsonResponse ([post.serialize() for post in posts], safe=False)
    else:
        # Check if user exists
        try:
            user = User.objects.get(id=user_id)
        except:
            return JsonResponse ({"error": "user does not exist"})

        # Create list of people being followed by the user
        follows = []
        for follow in user.follows.all():
            follows.append(follow.user)

        # From the list of people, aggregate those people posts
        posts = []
        for person in follows:
            for p in person.posts.all():
                posts.append(p)
        return JsonResponse ([post.serialize() for post in posts], safe=False)



def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
