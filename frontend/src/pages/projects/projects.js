import { create } from "../../../../backend/src/models/Project";
import {getProjects , deleteProject} from "../../services/projectsService";

async function loadProjects() {
    try {
        const projects = await getProjects();
        const list = document.getElementById('projects-list');
        list.innerHTML = '';

        projects.forEach(p => {
            const row = document.createElement('div');
            row.className = 'project-row';

            row.innerHTML = `
                <div class="project-info">
                    <h3>${p.titre}</h3>
                    <p>${p.description || ''}</p>
                    <p>${p.datelimite ? new Date(p.datelimite).toLocaleDateString() : 'No deadline'}</p>
                    <p>Status: ${p.status}</p>
                </div>
                <div class="project-actions">
                    <button class="btn-edit">Edit</button>
                    <button class="btn-delete">Delete</button>
                </div>
            `;
            row.querySelector('.btn-delete').addEventListener('click', async () => {
                await deleteProject(p._id);
                loadProjects();
            });

            list.appendChild(row);
        });
    } catch (err) {
        console.error('Error loading projects:', err);
    } 
}

loadProjects();

document.getElementById('btn-add-project').addEventListener('click', () => {
    document.getElementById('project-form').style.display = 'flex';
});
document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const projectData = {
        titre: document.getElementById('title').value,
        description: document.getElementById('description').value,
        datelimite: document.getElementById('deadline').value,
        status: document.getElementById('status').value
    };    

    await createproject(projectData);
    document.getElementById('project-form').reset();
    document.getElementById('project-form').style.display = 'none';
    loadProjects();
});