const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');

// jib les membres dyal projet w zidهom f menu déroulant
const loadMembers = async (projetId) => {
  try {
    const res = await axios.get(`${API_URL}/projects/${projetId}/members`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const select = document.getElementById('assignedTo');
    res.data.forEach(member => {
      const option = document.createElement('option');
      option.value = member._id;
      option.textContent = member.nom;
      select.appendChild(option);
    });
  } catch (err) {
    console.error('Erreur chargement membres:', err);
  }
};

// jib tasks dyal projet
const loadTasks = async (projetId) => {
  try {
    const res = await axios.get(`${API_URL}/projects/${projetId}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const list = document.getElementById('tasks-list');
    list.innerHTML = '';
    
    res.data.forEach(task => {
      const div = document.createElement('div');
      div.className = 'task-card';
      div.innerHTML = `
        <h3>${task.titre}</h3>
        <p>Priorité: ${task.priorite}</p>
        <p>Statut: ${task.statut}</p>
        <p>Assigné à: ${task.assignedTo ? task.assignedTo.nom : 'Non assigné'}</p>
        <button onclick="assignTask('${task._id}')">Assigner</button>
      `;
      list.appendChild(div);
    });
  } catch (err) {
    console.error('Erreur chargement tasks:', err);
  }
};

// khla9 task jdida
const createTask = async () => {
  const projetId = 'PROJET_ID'; // ghadi ytbadal dynamiquement
  try {
    await axios.post(`${API_URL}/tasks`, {
      titre: document.getElementById('titre').value,
      priorite: document.getElementById('priorite').value,
      assignedTo: document.getElementById('assignedTo').value,
      projetId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    loadTasks(projetId);
  } catch (err) {
    console.error('Erreur création task:', err);
  }
};

// assign task l membre
const assignTask = async (taskId) => {
  const userId = document.getElementById('assignedTo').value;
  const projetId = 'PROJET_ID';
  try {
    await axios.put(`${API_URL}/tasks/${taskId}/assign`, 
      { userId },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    loadTasks(projetId);
  } catch (err) {
    console.error('Erreur assignation:', err);
  }
};

// load dyal page
const projetId = new URLSearchParams(window.location.search).get('projetId');
if (projetId) {
  loadMembers(projetId);
  loadTasks(projetId);
}