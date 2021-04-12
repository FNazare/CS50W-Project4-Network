document.addEventListener('DOMContentLoaded', function() {

    // Get user id. This id is going to be load the posts the user is following
    try {
        var userId = document.querySelector('#userId').value
    }
    // If user is not logged in, there is no ID
    catch (TypeError) {
        var userId = ''
    }
    

    // Buttons
    document.querySelector('#all_posts').addEventListener('click', () => load_posts(''));
    document.querySelector('#following_posts').addEventListener('click', () => load_posts(userId));

    // By default, load all posts
    load_posts('')
})

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
        
        var posts_container = document.createElement("div")

        posts.forEach(element => {
            var one_post = document.createElement("ul")
            one_post.className = "one_post"

            //  Poster
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

        document.querySelector('#posts-display').appendChild(posts_container)
        }
    )
}