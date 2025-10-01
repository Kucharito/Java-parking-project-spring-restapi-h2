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


async function loadSpots(garageId){
    const list = document.getElementById('spots');
    if(!garageId) {
        list.innerHTML = `<li class="text-gray-500">Pick garageID and press "Load spots".</li>`;
        return;
    }
    try {
        const data = await http(`${API}/parkingspots?garageId=${encodeURIComponent(garageId)}`);
        const html = Array.isArray(data) && data.length
            ? data.map(s => `<li>spot #${s.id} — ${s.spotNumber} <span class="text-gray-500">(${s.type})</span></li>`).join('')
            : `<li class="text-gray-500">No spots.</li>`;
        list.innerHTML = html;
    }catch (e) {
        list.innerHTML = `<li class="text-red-600">Error: ${e.message}</li>`;
    }
}

document.getElementById('loadSpotBtn').addEventListener('click',() => {
    const garageId = document.getElementById('spotsGarageId').value.trim();
    loadSpots(garageId);
});

document.getElementById('resForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const garageId = document.getElementById('spotsGarageId').value.trim();
    const spotNumber = document.getElementById('spotNumber').value.trim();
    const type = document.getElementById('spotType').value;
    if (!garageId || !spotNumber || !type) {
        alert('All fields are required');
        return;
    }
    try {
        const qs = new URLSearchParams({garageId, spotNumber, type}).toString();
        await http(`${API}/parkingspots?${qs}`, {method: 'POST'});


        const filterGarageId = document.getElementById('spotsGarageId').value.trim();
        if (filterGarageId && filterGarageId === garageId) {
            await loadSpots(garageId);
        }

        document.getElementById('spotsGarageId').value = '';
        document.getElementById('spotNumber').value = '';
        document.getElementById('spotType').value = 'LARGE';
    } catch (e2) {
        alert(`Error creating spot: ${e2.message}`);
    }
});
