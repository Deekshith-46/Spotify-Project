// Show login form when "Log in" is clicked
document.getElementById("login-button").addEventListener("click", () => {
    document.getElementById("form1").style.display = "none";
    document.getElementById("form-con").style.display = "block";
});

// Sign-up function
function signup() {
    // Prevent page refresh on button click
    event.preventDefault();
    
    // Get values from sign-up inputs
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    // Validate fields are not blank
    if (!name || !email || !password) {
        alert("All fields are required.");
        return;
    }

    // Retrieve existing users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the email is already registered
    let userExists = users.some(user => user.email === email);
    if (userExists) {
        alert("This email is already registered. Please log in.");
        return;
    }

    // Add new user to the users array and save it to localStorage
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Sign-up successful! You can now log in.");

    // Clear the form fields
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    // Redirect to login form
    document.getElementById("form1").style.display = "none";
    document.getElementById("form-con").style.display = "block";
}

// Sign-in function
function sign_in() {
    // Prevent page refresh on button click
    event.preventDefault();

    // Get values from login inputs
    let email = document.getElementById("email2").value.trim();
    let password = document.getElementById("password2").value.trim();

    // Validate fields are not blank
    if (!email || !password) {
        alert("All fields are required.");
        return;
    }

    // Retrieve existing users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the user exists with matching credentials
    let validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
        alert("Login successful!"); // Redirect to the desired page
        location.href="./index.html"
    } else {
        alert("Invalid email or password.");
    }

    // Clear the form fields
    document.getElementById("email2").value = "";
    document.getElementById("password2").value = "";

}
