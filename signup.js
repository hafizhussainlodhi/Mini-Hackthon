var userName = document.getElementById("userNameSing");
var firstName = document.getElementById("firstNameSing");
var lastName = document.getElementById("lastNameSing");
var email = document.getElementById("emailSing");
var password = document.getElementById("passwordSing");
var cPassword = document.getElementById("cPasswordSing");
var btnjoin = document.getElementById("btnjoin");

btnjoin.addEventListener("click", () => {

    let userDetails = {
        userName: userName.value,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value
    }

    // Empty fields
    if (!userName.value || !firstName.value || !lastName.value
        || !email.value || !password.value || !cPassword.value) {
        return alert("⚠️ Please fill in all fields before continuing.");
    }

    // Email validation
    if (!email.value.includes("@")) {
        return alert("❌ Invalid email format.\nEmail must include '@'.");
    }

    // Password match
    if (password.value.trim() !== cPassword.value.trim()) {
        return alert("❌ Password and Confirm Password do not match.");
    }

    // Password length
    if (password.value.length <= 5) {
        return alert("⚠️ Password must be at least 5 characters long.");
    }

    // Local Storage
    var allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

    // Unique Username
    let userNameAlreadyExsits = allUsers.find((userData) => {
        return userData.userName == userName.value
    });

    // Unique Email
    let emailAlreadyExsits = allUsers.find((emailData) => {
        return emailData.email == email.value
    });

    // Alerts for duplicates
    if (userNameAlreadyExsits) {
        return alert("⚠️ This username is already taken.\nPlease choose another.");
    }

    if (emailAlreadyExsits) {
        return alert("ℹ️ Email already registered.\nTry logging in instead.");
    }

    // Save new user
    allUsers.push(userDetails);
    localStorage.setItem("allUsers", JSON.stringify(allUsers));

    alert("🎉 Signup Successful!\nWelcome aboard, " + firstName.value + "!");

    window.location = "login.html";
});


const modeToggle = document.getElementById("modeToggle");
const body = document.body;

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        modeToggle.textContent = "Light Mode";
        modeToggle.style.background = "#333";
        modeToggle.style.color = "#fff";
    } else {
        modeToggle.textContent = "Dark Mode";
        modeToggle.style.background = "#fff";
        modeToggle.style.color = "#000";
    }
});
