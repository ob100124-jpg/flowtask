const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');

// load dashboard data
const loadDashboard = async () => {
  try {
    const res = await axios.get(`${API_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = res.data;

    // afficher les métriques
    document.getElementById('tasksAssignees').textContent = data.tasksAssignees;
    document.getElementById('tasksTerminees').textContent = data.tasksTerminees;
    document.getElementById('tasksEnRetard').textContent = data.tasksEnRetard;

    // afficher tasks en cours
    const container = document.getElementById('tasksEnCours');
    container.innerHTML = '';

    data.tasksEnCours.forEach(task => {
      const div = document.createElement('div');
      div.className = 'task-card';
      div.innerHTML = `
        <h3>${task.titre}</h3>
        <p>Priorité: ${task.priorite}</p>
        <p>Date limite: ${task.dateLimite ? new Date(task.dateLimite).toLocaleDateString() : 'Non définie'}</p>
      `;
      container.appendChild(div);
    });

  } catch (err) {
    console.error('Erreur dashboard:', err);
  }
};

// load mli tftah page
loadDashboard();

document.getElementById('projectsBtn').addEventListener('click', () => {
    window.location.href = '/frontend/src/pages/projects/projects.html';
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/frontend/src/pages/login/login.html';
});