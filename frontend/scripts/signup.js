const BaseURL = 'http://localhost:4000';

document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post(`${BaseURL}/user/signup`, {
            name,
            email,
            phone,
            password
        });

        alert('Signup successful! Please login.');
        window.location.href = './login.html';
    } catch (error) {
        console.error('Error during signup:', error);
        alert('Signup failed. Please try again.');
    }
}); 
