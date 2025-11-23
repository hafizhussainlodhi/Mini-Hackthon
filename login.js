
let emailLogin = document.getElementById("email");
let passwordLogin = document.getElementById("password");
let loginBtn = document.querySelector(".loginBtn");

loginBtn.addEventListener("click", () => {

    if (!emailLogin.value || !passwordLogin.value) {
        return alert("Please fill in all the fields.");
    }

    if (!emailLogin.value.includes("@")) {
        return alert("Please enter a valid email address.");
    }

    if (passwordLogin.value.length <= 5) {
        return alert("Password must be at least 5 characters long.");
    }

    let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

    let isExists = allUsers.find(userData =>
        userData.email === emailLogin.value && userData.password === passwordLogin.value
    );

    if (isExists) {
        // ✅ Set loggedInUser so post page can fetch username
        localStorage.setItem("loggedInUser", JSON.stringify({ userName: isExists.userName }));

        alert(`🎉 Login Successful!\nWelcome back, ${isExists.userName}!`);
        window.location = "post.html"; // Redirect to post page
    } else {
        alert("❌ Incorrect email or password.\nPlease Signup first!");
    }
});

