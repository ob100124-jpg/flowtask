import { getProjects, createProject, deleteProject } from "../../services/projectsService.js";
async function loadProjects() {
    try {
        const projects = await getProjects();
        console.log(projects);
        const tbody = document.getElementById('project-tbody');
        tbody.innerHTML = '';

        projects.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${p.titre}</td>
        <td>${p.description || '-'}</td>
        <td>${p.datelimite ? new Date(p.datelimite).toLocaleDateString() : 'No deadline'}</td>
        <td>${p.status}</td>
        <td>
            <button class="btn-tasks">📋 Tasks</button>
            <button class="btn-delete">🗑️ Delete</button>
        </td>
    `;

    row.querySelector('.btn-tasks').addEventListener('click', () => {
        localStorage.setItem('selectedProject', p._id);
        window.location.href = '/frontend/src/pages/tasks/tasks.html';
    });

    row.querySelector('.btn-delete').addEventListener('click', async () => {
        await deleteProject(p._id);
        loadProjects();
    });

    tbody.appendChild(row);
});
    } catch (err) {
        console.error('Error loading projects:', err);
    } 
}

loadProjects();

document.getElementById('btn-add-project').addEventListener('click', () => {
    document.getElementById('project-form').style.display = 'block';
});
document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const projectData = {
        titre: document.getElementById('title').value,
        description: document.getElementById('description').value,
        datelimite: document.getElementById('deadline').value,
        status: document.getElementById('status').value
    };    

    await createProject(projectData);
    document.getElementById('project-form').reset();
    document.getElementById('project-form').style.display = 'none';
    loadProjects();
});