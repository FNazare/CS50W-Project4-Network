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
    document.querySelector('#all_posts').addEventListener('click', () => load_posts(''));
    document.querySelector('#following_posts').addEventListener('click', () => load_posts_follows(userId));

    // By default, load all posts
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
            item.innerHTML = '<b>' + element.poster + '</b>' + ' said:'
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