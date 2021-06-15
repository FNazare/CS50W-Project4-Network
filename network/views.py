from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Post, Like, Follow
from .util import get_posts



@csrf_exempt
@login_required
def follow(request, profile_id):

    if (request.method != "PUT"):
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)

    # Follower can't be the same as person to be followed
    if (profile_id == request.user.id):
        return JsonResponse ({"error": "One cannot follow himself."})

    # Check if profile exists
    try:
        profile = User.objects.get(pk=profile_id)
    except:
        return JsonResponse ({"error": "Profile to follow does not exist"})

    # Check if profile already has followers
    if (Follow.objects.filter(user=profile_id).first() == None):
        # Create new Follow object and save
        follow = Follow(user=profile)
        follow.save()
        follow.follower.add(request.user)
        print(f"Created new Follow object for user -{profile}- and added -{request.user}- as follower")
        return HttpResponse(status=204)
    else:
        follow = Follow.objects.filter(user=profile_id).first()

    # list of Profile followers
    followers = Follow.objects.filter(user=profile).first().follower.all()

    # Check if the Profile is already being followed by user
    if request.user in followers:
        # Unfollow profile
        follow.follower.remove(request.user)
    else:
        # Follow profile
        follow.follower.add(request.user)
    return HttpResponse(status=204)

@login_required
def profile(request, user_id):
    # Get user
    try:
        u = User.objects.get(pk=user_id)
    except:
        return JsonResponse ({"error": "user does not exist"})
    # Return serialized
    return JsonResponse(u.serialize(request.user))

@csrf_exempt
@login_required
def compose(request):
    if request.method == 'POST':
        p = Post (content=request.POST["content"], user=request.user)
        print(p)
        p.save()
        return HttpResponseRedirect(reverse('index'))


def following(request, user_id):
    # Get posts from people the user is following
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
    posts = get_posts(follows)
    return JsonResponse ([post.serialize() for post in posts], safe=False)

def posts(request, user_id = None):

    if user_id == None:
        # Returns all posts
        posts = Post.objects.all()
        return JsonResponse ([post.serialize() for post in posts], safe=False)
    # Get user posts
    else:
        # Check if user exists
        try:
            user = User.objects.get(id=user_id)
        except:
            return JsonResponse ({"error": "user does not exist"})

        posts = []
        posts = get_posts([user])
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

        # Ensure user typed a username
        if username == "":
            return render(request, "network/register.html", {
                "message": "Please type a username."
            })

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if not password:
                return render(request, "network/register.html", {
                "message": "Please type a password."
            })
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
