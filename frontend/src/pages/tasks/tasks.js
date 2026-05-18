const API_URL  = "http://localhost:5000/api";
const token    = localStorage.getItem("token");
const projetId = localStorage.getItem("selectedProject");

const DRAFT_KEY = "task_draft_" + projetId;

let currentPage = 1;
const limit = 5;

// Sauvegarde automatique du brouillon
const saveTaskDraft = () => {
  const draft = {
    titre: document.getElementById("titre").value,
    priorite: document.getElementById("priorite").value,
    assignedTo: document.getElementById("assignedTo").value
  };

  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
};

// Restauration du brouillon
const restoreTaskDraft = () => {
  const savedDraft = localStorage.getItem(DRAFT_KEY);

  if (!savedDraft) return;

  const shouldRestore = confirm("Un brouillon existe pour ce projet. Voulez-vous le restaurer ?");

  if (!shouldRestore) {
    localStorage.removeItem(DRAFT_KEY);
    return;
  }

  const draft = JSON.parse(savedDraft);

  document.getElementById("titre").value = draft.titre || "";
  document.getElementById("priorite").value = draft.priorite || "basse";
  document.getElementById("assignedTo").value = draft.assignedTo || "";
};

// Suppression du brouillon
const clearTaskDraft = () => {
  localStorage.removeItem(DRAFT_KEY);
};

// Activation de la sauvegarde sur chaque modification
const initDraftAutoSave = () => {
  document.getElementById("titre").addEventListener("input", saveTaskDraft);
  document.getElementById("priorite").addEventListener("input", saveTaskDraft);
  document.getElementById("assignedTo").addEventListener("input", saveTaskDraft);
};

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

  if (search)     params.append("search", search);
  if (statut)     params.append("status", statut);
  if (priorite)   params.append("priorite", priorite);
  if (assignedTo) params.append("assignedTo", assignedTo);

  try {
    const res = await axios.get(API_URL + "/projects/" + projetId + "/tasks?" + params.toString(), {
      headers: { Authorization: `Bearer ${token}` }
    });

    const list = document.getElementById("tasks-list");
    list.innerHTML = "";

    const tasks = res.data.data;
    const total = res.data.total;
    const page = res.data.page;
    const totalPages = res.data.totalPages;

    tasks.forEach(task => {
      const div = document.createElement("div");
      div.className = "task-card";
      div.innerHTML = `
        <h3>${task.titre}</h3>
        <p>Priorité: ${task.priorite}</p>
        <p>Statut: ${task.statut}</p>
        <p>Assigné à: ${task.assignedTo ? task.assignedTo.fullName : "Non assigné"}</p>
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
    console.log("data:", err.response && err.response.data);
  }
};

const createTask = async () => {
  const titre = document.getElementById("titre").value;
  const priorite = document.getElementById("priorite").value;
  const assignedTo = document.getElementById("assignedTo").value || undefined;

  if (!titre) return alert("Titre requis");

  try {
    await axios.post(API_URL + "/tasks",
      { titre: titre, priorite: priorite, assignedTo: assignedTo, projet: projetId },
      { headers: { Authorization: "Bearer " + token } }
    );

    document.getElementById("titre").value = "";
    document.getElementById("priorite").value = "basse";
    document.getElementById("assignedTo").value = "";

    clearTaskDraft();

    currentPage = 1;
    loadTasks();

  } catch (err) {
    console.error("Erreur creation task:", err);
  }
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

  } catch (err) {
    console.error("Erreur assignation:", err);
  }
};

const applyFilters = () => {
  currentPage = 1;
  loadTasks();
};

const resetFilters = () => {
  document.getElementById("search-input").value = "";
  document.getElementById("filter-statut").value = "";
  document.getElementById("filter-priorite").value = "";
  document.getElementById("filter-assignedTo").value = "";

  currentPage = 1;
  loadTasks();
};

const prevPage = () => {
  if (currentPage > 1) {
    currentPage--;
    loadTasks();
  }
};

const nextPage = () => {
  currentPage++;
  loadTasks();
};

if (projetId) {
  loadMembers().then(() => {
    restoreTaskDraft();
    initDraftAutoSave();
  });

  loadTasks();
}