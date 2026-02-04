const BaseURL = "http://localhost:4000";


document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        const response = await axios.post(`${BaseURL}/user/login`, {
            email,
            password
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        alert("Login successful!");
        window.location.href = "chatui.html";
    } catch (error) {
        console.error("Error during login:", error);
        alert("Login failed. Please check your credentials and try again.");
    }   
});

