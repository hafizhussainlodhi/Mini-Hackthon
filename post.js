console.log("SocialNest Posts Page Loaded");

// Check if user is logged in
var currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!currentUser) {
    alert("Please login first!");
    window.location.href = "login.html";
}

// Get posts
var feed = document.getElementById("feed");
var allPosts = JSON.parse(localStorage.getItem("allPosts")) || [];

// Fix old posts structure
allPosts = allPosts.map(p => {
    if (!p.likedBy) p.likedBy = [];
    if (!p.likes) p.likes = 0;
    if (!p.id) p.id = Date.now() + Math.random();
    return p;
});
localStorage.setItem("allPosts", JSON.stringify(allPosts));

// =====================
// ADD EMOJI
// =====================
function addEmoji(emoji) {
    let postInput = document.getElementById("postInput");
    postInput.value += emoji;
    postInput.focus();
}

// =====================
// CREATE POST
// =====================
function createPost() {
    let text = document.getElementById("postInput").value;
    let image = document.getElementById("imgInput").value;

    if (!text.trim()) return alert("Please write something before posting.");

    let post = {
        id: Date.now() + Math.random(),
        user: currentUser.userName,
        text: text,
        image: image,
        date: new Date().toLocaleString(),
        likes: 0,
        likedBy: []
    };

    allPosts.push(post);
    localStorage.setItem("allPosts", JSON.stringify(allPosts));

    document.getElementById("postInput").value = "";
    document.getElementById("imgInput").value = "";

    showPosts();
}

// =====================
// SHOW POSTS
// =====================
function showPosts(filteredPosts) {
    feed.innerHTML = "";
    let postsToShow = filteredPosts || allPosts;

    postsToShow.forEach(post => {
        let hasLiked = post.likedBy.includes(currentUser.userName);
        let isOwner = post.user === currentUser.userName;

        feed.innerHTML += `
            <div class="post-box">
                <h3>@${post.user}</h3>
                <p>${post.text}</p>
                ${post.image ? `<img src="${post.image}">` : ""}
                <small>${post.date}</small>
                <br><br>
                <button onclick="likePost(${post.id})" style="color: ${hasLiked ? 'blue' : 'black'};">
                    👍 Like (${post.likes})
                </button>
                ${isOwner ? `<button onclick="editPost(${post.id})">✏️ Edit</button>
                             <button onclick="deletePost(${post.id})">🗑 Delete</button>` : ""}
            </div>
        `;
    });
}

showPosts();

// =====================
// LIKE / UNLIKE
// =====================
function likePost(postId) {
    let post = allPosts.find(p => p.id === postId);
    if (!post) return;

    let user = currentUser.userName;
    if (post.likedBy.includes(user)) {
        post.likedBy = post.likedBy.filter(u => u !== user);
        post.likes--;
    } else {
        post.likedBy.push(user);
        post.likes++;
    }

    localStorage.setItem("allPosts", JSON.stringify(allPosts));
    showPosts();
}

// =====================
// DELETE POST
// =====================
function deletePost(postId) {
    if (confirm("Are you sure you want to delete this post?")) {
        allPosts = allPosts.filter(p => p.id !== postId);
        localStorage.setItem("allPosts", JSON.stringify(allPosts));
        showPosts();
    }
}

// =====================
// EDIT POST
// =====================
function editPost(postId) {
    let post = allPosts.find(p => p.id === postId);
    if (!post) return;

    let newText = prompt("Edit your post:", post.text);
    if (newText !== null) {
        post.text = newText;
        localStorage.setItem("allPosts", JSON.stringify(allPosts));
        showPosts();
    }
}

// =====================
// SEARCH POSTS
// =====================
function searchPosts() {
    let query = document.getElementById("searchInput").value.trim().toLowerCase();
    if (!query) {
        showPosts();
        return;
    }

    let filtered = allPosts.filter(post => post.user.toLowerCase().includes(query));
    showPosts(filtered);
}

// =====================
// DARK / LIGHT MODE
// =====================
const modeToggle = document.getElementById("modeToggle");
const body = document.body;

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        modeToggle.innerHTML = " Light Mode";
        modeToggle.style.background = "#333";
    } else {
        modeToggle.innerHTML = " Dark Mode";
        modeToggle.style.background = "#007bff";
    }
});


// =====================
// LOGOUT SYSTEM
// =====================
document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
});