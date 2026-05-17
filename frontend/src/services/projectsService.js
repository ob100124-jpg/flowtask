const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

// GET all projects
export const getProjects = async () => {
    const res = await axios.get(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
};

// CREATE project
export const createProject = async (projectData) => {
    const res = await axios.post(`${API_URL}/projects`, projectData, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
};

// DELETE project
export const deleteProject = async (id) => {
    const res = await axios.delete(`${API_URL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
};

// UPDATE project
export const updateProject = async (id, projectData) => {
    const res = await axios.put(`${API_URL}/projects/${id}`, projectData, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
};