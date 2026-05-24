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

// Build <option> HTML from the already-loaded assignedTo select
const buildMemberOptions = () => {
  const src = document.getElementById("assignedTo");
  let html = "";
  for (let i = 1; i < src.options.length; i++) {  // skip index 0 (placeholder)
    html += `<option value="${src.options[i].value}">${src.options[i].text}</option>`;
  }
  return html;
};

const updateStatus = async (taskId, newStatut) => {
     try {
       await axios.patch(
         API_URL + "/tasks/" + taskId + "/status",
         { statut: newStatut },
         { headers: { Authorization: "Bearer " + token } }
       );
       loadTasks();
       loadActivities();
     } catch (err) {
       console.error("Erreur mise à jour statut:", err);
       alert(err.response?.data?.message || "Erreur statut");
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

    
    // Build members options once, reuse for every card
    const memberOptions = buildMemberOptions();

    tasks.forEach(task => {
      const div = document.createElement("div");
      div.className = "task-card priorite-" + task.priorite;

      const assignedLabel = task.assignedTo ? task.assignedTo.fullName : "Non assigné";
      const assignedId    = task.assignedTo ? task.assignedTo._id : "";

      div.innerHTML = `
  <div class="task-info">
    <h3>${task.titre}</h3>
    <div class="task-meta">
      <span class="badge badge-priorite-${task.priorite}">${task.priorite}</span>
      <span class="badge badge-statut-${task.statut.replace(/\s/g, "-").replace("é","e")}">${task.statut}</span>
      <span class="badge badge-assigned">👤 ${assignedLabel}</span>
    </div>
  </div>
  <div class="task-actions">
    <div class="task-assign-row">
      <select class="task-member-select" id="select-${task._id}">
        <option value="">Choisir un membre...</option>
        ${memberOptions}
      </select>
      <button class="btn-assign" onclick="assignTask('${task._id}')">Assigner</button>
    </div>
    <div class="task-status-row">
      ${task.statut !== 'terminé' ?
        `<button class="btn-status btn-encours ${task.statut === 'en cours' ? 'active' : ''}"
           onclick="updateStatus('${task._id}', 'en cours')">En cours</button>
         <button class="btn-status btn-termine"
           onclick="updateStatus('${task._id}', 'terminé')">✓ Terminé</button>` :
        `<button class="btn-status btn-reopen"
           onclick="updateStatus('${task._id}', 'à faire')">↩ Réouvrir</button>`
      }
    </div>
  </div>
`;

      // Pre-select current assignee in the dropdown
      if (assignedId) {
        const sel = div.querySelector("#select-" + task._id);
        if (sel) sel.value = assignedId;
      }

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
    loadActivities();

  } catch (err) {
    console.error("Erreur creation task:", err);
  }
};

const assignTask = async (taskId) => {
  const sel = document.getElementById("select-" + taskId);
  const userId = sel ? sel.value : "";

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
  loadActivities();
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
// ── Feature 9 — Fil d'activité ──
const loadActivities = async () => {
  const feed = document.getElementById("activity-feed");
  try {
    const res = await axios.get(API_URL + "/projects/" + projetId + "/activities", {
      headers: { Authorization: "Bearer " + token }
    });

    const activities = res.data;

    if (!activities.length) {
      feed.innerHTML = "<p class='no-activity'>Aucune activité pour l'instant.</p>";
      return;
    }

    feed.innerHTML = activities.map(a => {
      const who  = a.user ? a.user.fullName : "Quelqu'un";
      const when = new Date(a.createdAt).toLocaleString("fr-FR");
      const msg  = formatActivity(a);
      return `<div class="activity-item"><strong>${who}</strong> ${msg} <span style="color:#999;font-size:0.8rem">— ${when}</span></div>`;
    }).join("");

  } catch (err) {
    feed.innerHTML = "<p class='no-activity'>Impossible de charger les activités.</p>";
    console.error("Erreur activités:", err);
  }
};

const formatActivity = (a) => {
  switch (a.type) {
    case "task_created":        return `a créé la tâche <em>${a.meta?.taskTitle || ""}</em>`;
    case "task_deleted":        return `a supprimé la tâche <em>${a.meta?.taskTitle || ""}</em>`;
    case "task_status_changed": return `a changé le statut de <em>${a.meta?.taskTitle || ""}</em> : ${a.meta?.from} → ${a.meta?.to}`;
    case "task_assigned":       return `a assigné la tâche <em>${a.meta?.taskTitle || ""}</em>`;
    default:                    return `a effectué une action (${a.type})`;
  }
};

if (projetId) {
  loadMembers().then(() => {
    restoreTaskDraft();
    initDraftAutoSave();
  });

  loadTasks();
  loadActivities();
}

// ─────────────────────────────────────────────
//  Feature 8 — Gestion des membres
// ─────────────────────────────────────────────

const toggleMembresPanel = () => {
  const panel = document.getElementById("membres-panel");
  const isHidden = panel.style.display === "none";
  panel.style.display = isHidden ? "block" : "none";
  if (isHidden) loadProjectMembers();
};

const loadProjectMembers = async () => {
  const list = document.getElementById("membres-list");
  list.innerHTML = "<p class='membres-loading'>Chargement...</p>";

  try {
    const res = await axios.get(API_URL + "/projects/" + projetId + "/members", {
      headers: { Authorization: "Bearer " + token }
    });

    const members = res.data.data || res.data;

    if (!members.length) {
      list.innerHTML = "<p class='membres-empty'>Aucun membre pour l'instant.</p>";
      return;
    }

    // Decode token to know who is the current user
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentUserId = payload.id || payload._id || payload.userId;

    list.innerHTML = "";
    members.forEach(m => {
      const isOwner = m.role === "owner" || m._id === currentUserId;
      const row = document.createElement("div");
      row.className = "membre-row";
      row.innerHTML =
        "<span class='membre-name'>" + m.fullName + "</span>" +
        "<span class='membre-email'>" + m.email + "</span>" +
        "<span class='membre-badge " + (isOwner ? "badge-owner" : "badge-member") + "'>" +
          (isOwner ? "Propriétaire" : "Membre") +
        "</span>" +
        (!isOwner
          ? "<button class='btn-retirer' onclick=\"removeMember('" + m._id + "', '" + m.fullName.replace(/'/g, "\\'") + "')\">Retirer</button>"
          : "");
      list.appendChild(row);
    });

  } catch (err) {
    list.innerHTML = "<p class='membres-empty'>Impossible de charger les membres.</p>";
    console.error("Erreur chargement membres panel:", err);
  }
};

const showMembresAlert = (msg, type) => {
  const el = document.getElementById("membres-alert");
  el.textContent = msg;
  el.className = "membres-alert membres-alert-" + type;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 4000);
};

const inviteMember = async () => {
  const email = document.getElementById("membre-email").value.trim();
  if (!email) return showMembresAlert("Veuillez saisir un email.", "error");

  const btn = document.querySelector(".btn-inviter");
  btn.disabled = true;
  btn.textContent = "Envoi...";

  try {
    await axios.post(
      API_URL + "/projects/" + projetId + "/members",
      { email: email },
      { headers: { Authorization: "Bearer " + token } }
    );
    document.getElementById("membre-email").value = "";
    showMembresAlert("Membre ajouté avec succès.", "success");

    // Refresh both the panel list and the assign dropdowns
    await loadProjectMembers();
    await refreshMembersDropdowns();

  } catch (err) {
    const msg = (err.response && err.response.data && err.response.data.message)
      || "Erreur lors de l'invitation.";
    showMembresAlert(msg, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Inviter";
  }
};

const removeMember = async (memberId, memberName) => {
  if (!confirm("Retirer " + memberName + " du projet ?")) return;

  try {
    await axios.delete(
      API_URL + "/projects/" + projetId + "/members/" + memberId,
      { headers: { Authorization: "Bearer " + token } }
    );
    showMembresAlert(memberName + " a été retiré.", "success");

    await loadProjectMembers();
    await refreshMembersDropdowns();

  } catch (err) {
    const msg = (err.response && err.response.data && err.response.data.message)
      || "Impossible de retirer ce membre.";
    showMembresAlert(msg, "error");
  }
};

// Refresh the assignedTo + filter-assignedTo selects after invite/remove
const refreshMembersDropdowns = async () => {
  try {
    const res = await axios.get(API_URL + "/projects/" + projetId + "/members", {
      headers: { Authorization: "Bearer " + token }
    });

    const members = res.data.data || res.data;

    const selectCreate = document.getElementById("assignedTo");
    const selectFilter = document.getElementById("filter-assignedTo");

    // Keep only the first "placeholder" option, remove the rest
    while (selectCreate.options.length > 1) selectCreate.remove(1);
    while (selectFilter.options.length > 1) selectFilter.remove(1);

    members.forEach(m => {
      const o1 = document.createElement("option");
      o1.value = m._id; o1.textContent = m.fullName;
      selectCreate.appendChild(o1);

      const o2 = document.createElement("option");
      o2.value = m._id; o2.textContent = m.fullName;
      selectFilter.appendChild(o2);
    });

  } catch (err) {
    console.error("Erreur refresh dropdowns:", err);
  }
};