document.addEventListener('DOMContentLoaded', function() {

    // Get user id. This id is going to be load the posts the user is following
    var userId = document.querySelector('#userId').value

    // Buttons
    document.querySelector('#all_posts').addEventListener('click', () => load_posts(''));
    document.querySelector('#following_posts').addEventListener('click', () => load_posts(userId));


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
            var posts_container = document.createElement("div")

            posts.forEach(element => {
                var one_post = document.createElement("ul")
                one_post.className = "one_post"

                //  Poster
                item = document.createElement("li")
                item.innerHTML = '<b>' + element.poster + '</b>' + ' says:'
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






                //posts_container.appendChild(one_post)
                posts_container.append(one_post)
            });

            document.querySelector('#posts-display').appendChild(posts_container)
        }
    )
}