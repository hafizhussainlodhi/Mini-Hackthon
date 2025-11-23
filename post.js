console.log("SocialNest Posts Page Loaded");

// --- Initialization ---

// Check if user is logged in
var currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!currentUser) {
    alert("Please login first!");
    // Ensure this path is correct if login.html is in a different directory
    window.location.href = "login.html";
}

// Get DOM elements
var feed = document.getElementById("feed");
// Assuming you have input fields with these IDs in your HTML
var postInput = document.getElementById("postInput");
var imgInput = document.getElementById("imgInput");
var postButton = document.getElementById("postButton"); // Assuming this is your post button ID
var searchInput = document.getElementById("searchInput"); // Assuming this is your search input ID

// Get and fix posts data
var allPosts = JSON.parse(localStorage.getItem("allPosts")) || [];

// Fix old posts structure (Good practice, keep this)
allPosts = allPosts.map(p => {
    if (!p.likedBy) p.likedBy = [];
    if (!p.likes) p.likes = 0;
    // Use a more robust unique ID if possible, but Date.now() + Math.random() is fine for local storage
    if (!p.id) p.id = Date.now() + Math.random();
    return p;
});
localStorage.setItem("allPosts", JSON.stringify(allPosts));


// =====================
// ADD EMOJI
// =====================
function addEmoji(emoji) {
    // Check if the input element exists before manipulating it
    if (postInput) {
        postInput.value += emoji;
        postInput.focus();
    }
}

// =====================
// CREATE POST
// =====================
function createPost() {
    // Get values from the correct elements
    let text = postInput ? postInput.value : '';
    let image = imgInput ? imgInput.value : '';

    if (!text.trim()) {
        alert("Please write something before posting.");
        return;
    }

    let post = {
        id: Date.now() + Math.random(),
        user: currentUser.userName,
        text: text,
        image: image,
        // Format date better
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        likes: 0,
        likedBy: []
    };

    allPosts.unshift(post); // Use unshift to show the newest post first
    localStorage.setItem("allPosts", JSON.stringify(allPosts));

    // Clear inputs
    if (postInput) postInput.value = "";
    if (imgInput) imgInput.value = "";

    showPosts();
}

// *** FIX: Attach createPost function to the button click event ***
if (postButton) {
    postButton.addEventListener("click", createPost);
} else {
    // console.warn("Post button not found! Make sure your HTML element has the ID 'postButton'.");
}


// =====================
// SHOW POSTS
// =====================
function showPosts(filteredPosts) {
    if (!feed) return console.error("Feed element not found!");

    feed.innerHTML = "";
    // Sort posts by ID (newest first) if no filter is applied
    let postsToShow = filteredPosts || allPosts.sort((a, b) => b.id - a.id);

    postsToShow.forEach(post => {
        let hasLiked = post.likedBy.includes(currentUser.userName);
        let isOwner = post.user === currentUser.userName;

        // Use a template literal for clean HTML generation
        feed.innerHTML += `
            <div class="post-box" data-post-id="${post.id}">
                <h3>@${post.user}</h3>
                <p>${post.text}</p>
                ${post.image ? `<img src="${post.image}" class="post-image">` : ""}
                <small>Posted on: ${post.date}</small>
                <div class="post-actions">
                    <button onclick="likePost(${post.id})" class="like-btn" style="color: ${hasLiked ? 'rgb(24, 119, 242)' : 'gray'};">
                        ${hasLiked ? '❤️' : '👍'} Like (${post.likes})
                    </button>
                    ${isOwner ? `
                        <button onclick="editPost(${post.id})" class="edit-btn">✏️ Edit</button>
                        <button onclick="deletePost(${post.id})" class="delete-btn">🗑 Delete</button>
                    ` : ""}
                </div>
            </div>
        `;
    });
}

// Initial load of posts
showPosts();

// =====================
// LIKE / UNLIKE
// =====================
function likePost(postId) {
    // Convert postId to number as it's passed from HTML as string and post.id is number
    const numericPostId = Number(postId);
    let post = allPosts.find(p => p.id === numericPostId);
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
    const numericPostId = Number(postId);
    if (confirm("Are you sure you want to delete this post?")) {
        allPosts = allPosts.filter(p => p.id !== numericPostId);
        localStorage.setItem("allPosts", JSON.stringify(allPosts));
        showPosts();
    }
}

// =====================
// EDIT POST
// =====================
function editPost(postId) {
    const numericPostId = Number(postId);
    let post = allPosts.find(p => p.id === numericPostId);
    if (!post) return;

    let newText = prompt("Edit your post:", post.text);
    if (newText !== null && newText.trim() !== "") {
        post.text = newText.trim();
        // You might want to update the date to indicate it was edited
        // post.date = new Date().toLocaleDateString() + ' (Edited)';
        localStorage.setItem("allPosts", JSON.stringify(allPosts));
        showPosts();
    }
}

// =====================
// SEARCH POSTS
// =====================
function searchPosts() {
    let query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    
    if (!query) {
        showPosts();
        return;
    }

    // Filter by username OR post text for better search functionality
    let filtered = allPosts.filter(post => 
        post.user.toLowerCase().includes(query) || post.text.toLowerCase().includes(query)
    );
    showPosts(filtered);
}

// *** FIX: Attach searchPosts to input event for real-time filtering ***
if (searchInput) {
    searchInput.addEventListener("input", searchPosts);
}


// =====================
// DARK / LIGHT MODE
// =====================
const modeToggle = document.getElementById("modeToggle");
const body = document.body;

if (modeToggle) {
    modeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
    
        // Update button text and style based on new mode
        if (body.classList.contains("dark-mode")) {
            modeToggle.innerHTML = " Light Mode";
            modeToggle.style.background = "#333";
        } else {
            modeToggle.innerHTML = " Dark Mode";
            modeToggle.style.background = "#007bff";
        }
    });
}


// =====================
// LOGOUT SYSTEM
// =====================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });
}