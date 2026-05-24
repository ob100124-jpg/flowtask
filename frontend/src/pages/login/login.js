 // toggle forms
document.getElementById('switchToLogin').addEventListener('click', () => {
  document.getElementById('signupContainer').style.display = 'none';
  document.getElementById('loginContainer').style.display = 'block';
});

document.getElementById('switchToSignup').addEventListener('click', () => {
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('signupContainer').style.display = 'block';
});

// interceptor token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// SIGN UP
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fullName = document.querySelector("#signupForm input[name='fullName']").value;
  const email    = document.querySelector("#signupForm input[name='email']").value;
  const password = document.querySelector("#signupForm input[name='password']").value;

  try {
    await axios.post('http://localhost:5000/api/auth/register', { fullName, email, password });
    alert('Compte créé ! Connecte-toi.');
    document.getElementById('switchToLogin').click();
  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.message || "Erreur inconnue";
    alert('Erreur : ' + msg);
  }
});

// LOGIN
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email    = document.querySelector("#loginForm input[name='email']").value;
  const password = document.querySelector("#loginForm input[name='password']").value;

  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    window.location.href = '/frontend/src/pages/dashboard/dashboard.html';  } catch (error) {
    alert('Erreur : ' + error.response?.data?.message);
  }
});
