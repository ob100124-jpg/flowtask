// toggle between signup and login forms
document.getElementById('switchToLogin').addEventListener('click', () => {
    document.getElementById('signupContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
});

document.getElementById('switchToSignup').addEventListener('click', () => {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('signupContainer').style.display = 'block';
});

//tokn d'authentification
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// SIGN UP
document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fullname = document.querySelector("input[name='fullname']").value;
    const email = document.querySelector("input[name='email']").value;
    const password = document.querySelector("input[name='password']").value;
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', { fullname, email, password });
       localStorage.setItem('token', response.data.token);
        alert('Signup successful! Please login.');
        document.getElementById('switchToLogin').click(); 
    } catch (error) {
        alert('Signup failed: ' + error.response.data.message);
    }
});

//login 
document.getElementById('loginform').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.querySelector("input[name='email']").value;
    const password = document.querySelector("input[name='password']").value;
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        alert('Login successful!');
        window.location.href = '/dashboard.html';
    } catch (error) {
        alert('Login failed: ' + error.response.data.message);
    }
});
