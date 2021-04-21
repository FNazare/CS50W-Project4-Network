document.addEventListener('DOMContentLoaded', function() {

    // Get user id. This ID is going to be used to load the posts from people the user is following
    try {
        var userId = document.querySelector('#userId').value
    }
    // If user is not logged in, there is no ID
    catch (TypeError) {
        var userId = ''
    }
    

    // Buttons
    document.querySelector('#all_posts').addEventListener('click', () => {
        document.querySelector('#profile-display').style.display = 'none';
        load_posts('');
    });
    document.querySelector('#following_posts').addEventListener('click', () => {
        document.querySelector('#profile-display').style.display = 'none';
        load_posts_follows(userId)
    });

    // By default, load all posts and hide profile display
    document.querySelector('#profile-display').style.display = 'none';
    load_posts('')
})


// Loads posts from people the user(user_id) is following
function load_posts_follows(user_id) {
    
    //clear container
    document.querySelector('#posts-display').innerHTML = ""

    // Fetch posts.
    fetch('following/' + user_id)
    .then(response => response.json())
    .then(posts => {
        
        // Structure posts
        var grouped_posts = BuildPosts(posts)

        // Render posts on the page
        document.querySelector('#posts-display').appendChild(grouped_posts)
    }
    )
}


// To load posts from all users: user_id should be an empty string
// To load posts from specifi user: specify the user_id
function load_posts(user_id) {

    // user_id will be used to fetch the API
    if (user_id){
        user_id = '/' + user_id
    }

    //clear container
    document.querySelector('#posts-display').innerHTML = ""

    // Fetch posts.
    fetch('posts' + user_id)
    .then(response => response.json())
    .then(posts => {
        posts = posts.reverse()
        
        // Structure posts
        var grouped_posts = BuildPosts(posts)

        // Render posts on the page
        document.querySelector('#posts-display').appendChild(grouped_posts)
    }
    )
}


// Defines the structure of the posts to be rendered
function BuildPosts(posts) {

    if (posts.length){
    
        // Posts are going to be stored here
        var posts_container = document.createElement("div")

        // Store each post on the container
        posts.forEach(element => {
            var one_post = document.createElement("ul")
            one_post.className = "one_post"

            //  Poster name
            item = document.createElement("li")
            item.innerHTML = '<b>' + element.poster + '</b>';
            item.addEventListener('click', () => LoadProfile(element.poster_id))
            item.className = "show-as-clickable";
            one_post.append(item)

            // Content
            item = document.createElement("li")
            item.innerHTML = element.content
            one_post.append(item)

            // Timestamp
            item = document.createElement("li")
            item.innerHTML = '<small>' + element.timestamp + '</small>'
            one_post.append(item)

            // Likes
            item = document.createElement("li")
            item.innerHTML = `&hearts; ` + element.likes;
            one_post.append(item)

            posts_container.append(one_post)
    });
    }
    else{
        var posts_container = document.createElement("div")
        posts_container.innerHTML = "<i>No posts to show.</i>"
    }
    return posts_container
}

function LoadProfile(profile_id) {
    // Populate user profile
    fetch('profile/' + profile_id)
    .then(response => response.json())
    .then(user => {

        var profile_container = document.createElement("div")

        document.querySelector('#profile-display').innerHTML = `<b>${user.name}</b><br/>
        followers count: <b>${user.followers_count}</b><br/>
        is following: <b>${user.following_count}</b><br/>`;

        // Confirm user is not visiting his own profile before rendering the follow button
        if (user.id != userId.value){
            // Add "follow/unfollow" button
            var follow_button = document.createElement("button");
            follow_button.type = "button";
            follow_button.addEventListener('click', () => {

                follow(user.id)

                // Change follow/unfollow button
                if (follow_button.innerHTML === "Unfollow") {
                    follow_button.innerHTML = "Follow"
                }
                else if (follow_button.innerHTML === "Follow"){
                    follow_button.innerHTML = "Unfollow"
                }
                
            })

            if (user.is_following) {
                follow_button.innerHTML = "Unfollow"
            }
            else {
                follow_button.innerHTML = "Follow"
            }
            document.querySelector('#profile-display').append(follow_button);
        }
    }
    )

    // After populating the profile, unhide it
    document.querySelector('#profile-display').style.display = 'block';

    // Load posts
    load_posts(profile_id);

}

// Toggle follow/unfollow
function follow(person_id) {
    fetch(`follow/${person_id}`, {
        method: 'PUT'
    })
}

