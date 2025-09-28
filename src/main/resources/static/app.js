const API = 'http://localhost:8081/api';



const setStatus = (t) => { /* optional: document.getElementById('status').textContent = t */ };

async function http(url, opts = {}) {
    setStatus('Loading...');
    try {
        const res = await fetch(url, opts);
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || res.statusText);
        }
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        return ct.includes('application/json') ? res.json() : res.text();
    } finally {
        setStatus('Ready');
    }
}


async function loadGarages() {
    try {
        const data = await http(`${API}/garages`);
        const html = Array.isArray(data) && data.length
            ? data.map(g => `<li>#${g.id} – ${g.name}</li>`).join('')
            : `<li class="text-gray-500">Žiadne garáže.</li>`;
        document.getElementById('garages').innerHTML = html; // <-- sem
    } catch (e) {
        document.getElementById('garages').innerHTML =
            `<li class="text-red-600">Chyba: ${e.message}</li>`;
    }
}
document.getElementById('garages').addEventListener('click', loadGarages);


document.getElementById('garageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('garageName').value.trim();
    if (!name) {
        alert('Garage name is required');
        return;
    }
    try {
        await http(`${API}/garages?name=${encodeURIComponent(name)}`, { method: 'POST' });
        document.getElementById('garageName').value = '';
        await loadGarages();
    } catch (e2) {
        alert(`Error creating garage: ${e2.message}`);
    }
});

document.addEventListener('DOMContentLoaded', loadGarages);