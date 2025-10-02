const API = 'http://localhost:8081/api';


const setStatus = (t) => { /* document.getElementById('status').textContent = t */ };

async function http(url, opts = {}) {
    setStatus('Loading...');
    try {
        const res = await fetch(url, { headers: { Accept: 'application/json' }, ...opts });

        const ct = (res.headers.get('content-type') || '').toLowerCase();
        const isJson = ct.includes('application/json');

        if (!res.ok) {
            const body = isJson ? await res.json().catch(() => ({})) : await res.text();
            const err = new Error(
                isJson ? (body.message || body.error || `HTTP ${res.status}`) : (body || res.statusText)
            );
            err.status = res.status;
            err.payload = body;
            err.url = url;
            throw err;
        }

        if (res.status === 204) return null;
        return isJson ? res.json() : res.text();
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
function toLocalOffsetISOString(inputValue) {
    const d = new Date(inputValue);
    if (Number.isNaN(d.getTime())) return null;
    const pad = (n) => String(n).padStart(2, '0');
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const h = pad(d.getHours());
    const min = pad(d.getMinutes());
    const s = pad(d.getSeconds());
    const tzMin = -d.getTimezoneOffset();
    const sign = tzMin >= 0 ? '+' : '-';
    const offH = pad(Math.floor(Math.abs(tzMin) / 60));
    const offM = pad(Math.abs(tzMin) % 60);
    return `${y}-${m}-${day}T${h}:${min}:${s}${sign}${offH}:${offM}`;
}

function formatHuman(iso) {
    try {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleString(undefined, {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    } catch { return iso; }
}

// DOM
const form = document.getElementById('resFormSpots');
const spotIdInput = document.getElementById('resSpotId');
const plateInput = document.getElementById('resPlate');
const startInput = document.getElementById('startTime');
const endInput = document.getElementById('endTime');
const outputEl = document.getElementById('resOutput');
// === FIX: normalizácia odpovede ===
function normalizeReservationsPayload(data) {
    if (data === null || data === undefined) return [];
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;                  // Spring Page
    if (data && data._embedded && Array.isArray(data._embedded.reservations)) {   // HATEOAS
        return data._embedded.reservations;
    }
    return null; // neočakávaný tvar
}

async function loadReservations(spotId) {
    if (!spotId) {
        outputEl.innerHTML = '<span class="text-gray-500">Zadaj spotId pre zobrazenie rezervácií.</span>';
        outputEl.className = 'mt-3 text-sm text-gray-600';
        return;
    }
    try {
        const raw = await http(`${API}/reservations/${encodeURIComponent(spotId)}`);
        const data = normalizeReservationsPayload(raw);

        if (data === null) {
            const preview = typeof raw === 'object' ? JSON.stringify(raw, null, 2) : String(raw);
            outputEl.innerHTML = `
        <div class="text-amber-700">Neočakávaný tvar odpovede (čakalo sa pole alebo {content:[...]}).</div>
        <pre class="mt-2 p-2 rounded bg-gray-50 text-xs overflow-auto">${preview}</pre>
      `;
            outputEl.className = 'mt-3 text-sm';
            return;
        }

        if (data.length === 0) {
            outputEl.innerHTML = '<span class="text-gray-500">Žiadne rezervácie pre tento spot.</span>';
            outputEl.className = 'mt-3 text-sm text-gray-600';
            return;
        }

        const rows = data.map((r) =>
            `<li>#${r.id} • ${r.licensePlate} • ${formatHuman(r.startTime)} → ${formatHuman(r.endTime)}${r.status ? ` • ${r.status}` : ''}</li>`
        ).join('');
        outputEl.innerHTML = `<ul class="list-disc pl-6">${rows}</ul>`;
        outputEl.className = 'mt-3 text-sm text-gray-800';
    } catch (e) {
        const details = e && e.payload ? `<pre class="mt-2 p-2 rounded bg-red-50 text-xs overflow-auto">${JSON.stringify(e.payload, null, 2)}</pre>` : '';
        outputEl.innerHTML = `<div class="text-red-700">Kazda revzervacia musi prisluchat jednemu autu v garazi</div>${details}`;
        outputEl.className = 'mt-3 text-sm';
    }
}

// autoload pri zmene
spotIdInput.addEventListener('change', () => {
    const sid = Number(spotIdInput.value.trim());
    if (Number.isFinite(sid) && sid > 0) loadReservations(sid);
});

// submit novej rezervácie (nezmenené)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const spotId = Number(spotIdInput.value.trim());
    const plate = (plateInput.value || '').trim().toUpperCase();
    const startIso = toLocalOffsetISOString(startInput.value);
    const endIso = toLocalOffsetISOString(endInput.value);

    if (!Number.isFinite(spotId) || spotId <= 0) {
        outputEl.textContent = 'Chyba: Zadaj platný spotId (> 0).';
        outputEl.className = 'mt-3 text-sm text-red-600';
        return;
    }
    if (!plate) {
        outputEl.textContent = 'Chyba: Zadaj EČV (License plate).';
        outputEl.className = 'mt-3 text-sm text-red-600';
        return;
    }
    if (!startIso || !endIso) {
        outputEl.textContent = 'Chyba: Zadaj platný začiatok a koniec.';
        outputEl.className = 'mt-3 text-sm text-red-600';
        return;
    }
    if (new Date(startIso) >= new Date(endIso)) {
        outputEl.textContent = 'Chyba: Koniec musí byť po začiatku.';
        outputEl.className = 'mt-3 text-sm text-red-600';
        return;
    }

    const payload = { spotId, licensePlate: plate, startTime: startIso, endTime: endIso };
    const btn = form.querySelector('button[type="submit"], button:not([type])');
    const prevHtml = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.innerHTML = 'Adding…'; }

    try {
        const res = await http(`${API}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(payload),
        });

        const okMsg = `✅ Reservation #${res.id} — spot ${res.spotNumber || res.spotId} • ${res.licensePlate}
🕒 ${formatHuman(res.startTime)} → ${formatHuman(res.endTime)}${res.status ? `\nStatus: ${res.status}` : ''}`;
        outputEl.textContent = okMsg;
        outputEl.className = 'mt-3 text-sm text-green-700';

        form.reset();
        await loadReservations(spotId);
    } catch (err) {
        const details = err && err.payload ? `\n${JSON.stringify(err.payload)}` : '';
        outputEl.textContent = `❌ Chyba: ${err?.message || String(err)}${details}`;
        outputEl.className = 'mt-3 text-sm text-red-600';
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = prevHtml; }
    }
});

// autoload ak je predvyplnené
(() => {
    const sid = Number(spotIdInput.value.trim());
    if (Number.isFinite(sid) && sid > 0) loadReservations(sid);
})();