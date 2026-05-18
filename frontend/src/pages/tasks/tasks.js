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
    
     const tasks = res.data.data;

    tasks.forEach(task => {
      const div = document.createElement('div');
      div.className = 'task-card';
      div.innerHTML = `
        <h3>${task.titre}</h3>
        <p>Priorité: ${task.priorite}</p>
        <p>Statut: ${task.statut}</p>
        <p>Assigné à: ${task.assignedTo ? task.assignedTo.fullName : 'Non assigné'}</p>
        <button onclick="assignTask('${task._id}')">Assigner</button>
      `;
      list.appendChild(div);
    });
  } catch (err) {
    console.log('status:', err.response?.status);
    console.log('data:', err.response?.data);
    alert(JSON.stringify(err.response?.data));
  }
};

// khla9 task jdida
const createTask = async () => {
  const projetId = localStorage.getItem('selectedProject');
  try {
    await axios.post(`${API_URL}/tasks`, {
      titre: document.getElementById('titre').value,
      priorite: document.getElementById('priorite').value,
      assignedTo: document.getElementById('assignedTo').value || undefined,
      projet: projetId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    loadTasks(projetId);
  } catch (err) {
    console.error('Erreur création task:', err);
  }
};

const assignTask = async (taskId) => {
  const userId = document.getElementById('assignedTo').value;
  const projetId = localStorage.getItem('selectedProject');
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
const projetId = localStorage.getItem('selectedProject');
if (projetId) {
  loadMembers(projetId);
  loadTasks(projetId);
}