const API_URL  = "http://localhost:5000/api";
const token    = localStorage.getItem("token");
const projetId = localStorage.getItem("selectedProject");

let currentPage = 1;
const limit = 5;

const loadMembers = async () => {
  try {
    const res = await axios.get(API_URL + "/projects/" + projetId + "/members", {
      headers: { Authorization: "Bearer " + token }
    });
    const members = res.data.data || res.data;
    const selectCreate = document.getElementById("assignedTo");
    const selectFilter = document.getElementById("filter-assignedTo");
    members.forEach(function(member) {
      const opt1 = document.createElement("option");
      opt1.value = member._id;
      opt1.textContent = member.fullName;
      selectCreate.appendChild(opt1);
      const opt2 = document.createElement("option");
      opt2.value = member._id;
      opt2.textContent = member.fullName;
      selectFilter.appendChild(opt2);
    });
  } catch (err) {
    console.error("Erreur chargement membres:", err);
  }
};

const loadTasks = async () => {
  const search     = document.getElementById("search-input").value.trim();
  const statut     = document.getElementById("filter-statut").value;
  const priorite   = document.getElementById("filter-priorite").value;
  const assignedTo = document.getElementById("filter-assignedTo").value;

  const params = new URLSearchParams({ page: currentPage, limit: limit, _t: Date.now() });
  if (search)     params.append("search",     search);
  if (statut)     params.append("status",     statut);
  if (priorite)   params.append("priorite",   priorite);
  if (assignedTo) params.append("assignedTo", assignedTo);

  try {
    const res = await axios.get(API_URL + "/projects/" + projetId + "/tasks?" + params.toString(), {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const list = document.getElementById('tasks-list');
    list.innerHTML = '';
    
     const tasks = res.data.data;
     const total      = res.data.total;
     const page       = res.data.page;
     const totalPages = res.data.totalPages;

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
    document.getElementById("page-info").textContent =
  "Page " + page + " / " + (totalPages || 1) + " - " + total + " tache(s)";
document.getElementById("prev-page").disabled = page <= 1;
document.getElementById("next-page").disabled = page >= (totalPages || 1);
  } catch (err) {
    console.log("status:", err.response && err.response.status);
    console.log("data:",   err.response && err.response.data);
  }
};


const createTask = async () => {
  const titre      = document.getElementById("titre").value;
  const priorite   = document.getElementById("priorite").value;
  const assignedTo = document.getElementById("assignedTo").value || undefined;
  if (!titre) return alert("Titre requis");
  try {
    await axios.post(API_URL + "/tasks",
      { titre: titre, priorite: priorite, assignedTo: assignedTo, projet: projetId },
      { headers: { Authorization: "Bearer " + token } }
    );
    document.getElementById("titre").value = "";
    currentPage = 1;
    loadTasks();  } catch (err) { console.error("Erreur creation task:", err); }
};


const assignTask = async (taskId) => {
  const userId = document.getElementById("assignedTo").value;
  if (!userId) return alert("Selectionne un membre d abord.");
  try {
    await axios.patch(
      API_URL + "/tasks/" + taskId + "/assign",
      { userId: userId },
      { headers: { Authorization: "Bearer " + token } }
    );
    loadTasks();
  } catch (err) { console.error("Erreur assignation:", err); }
};

const applyFilters = () => { currentPage = 1; loadTasks(); };

const resetFilters = () => {
  document.getElementById("search-input").value      = "";
  document.getElementById("filter-statut").value     = "";
  document.getElementById("filter-priorite").value   = "";
  document.getElementById("filter-assignedTo").value = "";
  currentPage = 1;
  loadTasks();
};

const prevPage = () => { if (currentPage > 1) { currentPage--; loadTasks(); } };
const nextPage = () => { currentPage++; loadTasks(); };


const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)   return `il y a ${diff} secondes`;
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} minutes`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} heures`;
  return `il y a ${Math.floor(diff / 86400)} jours`;
};

const formatActivity = (activity) => {
  const who  = activity.user?.fullName || 'Quelqu\'un';
  const when = timeAgo(activity.createdAt);
  switch (activity.type) {
    case 'task_created':       return `${who} a créé la tâche "${activity.meta.taskTitle}" — ${when}`;
    case 'task_deleted':       return `${who} a supprimé la tâche "${activity.meta.taskTitle}" — ${when}`;
    case 'task_status_changed': return `${who} a changé le statut de "${activity.meta.taskTitle}" : ${activity.meta.from} → ${activity.meta.to} — ${when}`;
    case 'task_assigned':      return `${who} a assigné la tâche "${activity.meta.taskTitle}" — ${when}`;
    case 'project_updated':    return `${who} a modifié le projet — ${when}`;
    case 'member_added':       return `${who} a ajouté un membre — ${when}`;
    case 'member_removed':     return `${who} a retiré un membre — ${when}`;
    default:                   return `${who} a effectué une action — ${when}`;
  }
};

const loadActivities = async () => {
  try {
    const res  = await axios.get(API_URL + "/projects/" + projetId + "/activities", {
      headers: { Authorization: "Bearer " + token }
    });
    const feed = document.getElementById("activity-feed");
    if (!res.data.length) {
      feed.innerHTML = '<p class="no-activity">Aucune activité pour ce projet.</p>';
      return;
    }
    feed.innerHTML = res.data
      .map(a => `<div class="activity-item">${formatActivity(a)}</div>`)
      .join('');
  } catch (err) {
    console.error("Erreur chargement activités:", err);
  }
};


if (projetId) {
  loadMembers();
  loadTasks();
  loadActivities();
}