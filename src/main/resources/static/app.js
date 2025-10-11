const API = 'http://localhost:8081/api';

const setStatus = (t) => { /* document.getElementById('status').textContent = t */ };

async function http(url, opts = {}) {
    setStatus('Loading...');
    try {
        const headers = opts.method === 'DELETE'
            ? { Accept: 'application/json' }
            : { Accept: 'application/json', 'Content-Type': 'application/json' };

        const res = await fetch(url, { ...opts, headers });

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
            `<li class="text-red-600">Error, false input: ${e.message}</li>`;
            `<li class="text-red-600">Error, false input: ${e.message}</li>`;
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

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('deleteGarageForm');
    if (!form) {
        console.error('❌ deleteGarageForm not found in DOM');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('garageIdDel').value.trim();
        const output = document.getElementById('delGarageOutput');

        if (!id) {
            output.textContent = 'Garage ID is required';
            output.classList.add('text-red-600');
            return;
        }

        try {
            await http(`${API}/garages/${encodeURIComponent(id)}`, { method: 'DELETE' });
            document.getElementById('garageIdDel').value = '';
            output.textContent = `✅ Garage #${id} deleted`;
            output.classList.remove('text-red-600');
            output.classList.add('text-green-700');
            await loadGarages();
        } catch (err) {
            output.textContent = `❌ Error deleting garage: ${err.message}`;
            output.classList.remove('text-green-700');
            output.classList.add('text-red-600');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('deleteSpotForm');
    if(!form){
        console.error('❌ deleteSpotForm not found in DOM');
        return;
    }
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('spotIdDel').value.trim();
        const output = document.getElementById('delSpotOutput');

        if (!id) {
            output.textContent = 'Spot ID is required';
            output.classList.add('text-red-600');
            return;
        }
        try {
            await http(`${API}/parkingspots/${encodeURIComponent(id)}`, {method: 'DELETE'});
            document.getElementById('spotIdDel').value = '';
            output.textContent = `✅ Spot #${id} deleted`;
            output.classList.remove('text-red-600');
            output.classList.add('text-green-700');
            await loadSpots();
        } catch (err) {
            output.textContent = `❌ Error deleting spot: ${err.message}`;
            output.classList.remove('text-green-700');
            output.classList.add('text-red-600');
        }

    });
});

let currentGarageId = null;

async function loadSpots(garageId) {
    const list = document.getElementById('spots');

    if (!garageId) {
        const input = document.getElementById('spotsGarageId');
        if (input && input.value.trim()) {
            garageId = input.value.trim();
        } else if (currentGarageId) {
            garageId = currentGarageId; // fallback na posledné použité ID
        }
    }
    if (!garageId) {
        list.innerHTML = `<li class="text-gray-500">Pick garageID and press "Load spots".</li>`;
        return;
    }

    currentGarageId = garageId;

    try {
        const data = await http(`${API}/parkingspots?garageId=${encodeURIComponent(garageId)}`);
        const html = Array.isArray(data) && data.length
            ? data.map(s => `<li>spot #${s.id} — ${s.spotNumber} <span class="text-gray-500">(${s.type})</span></li>`).join('')
            : `<li class="text-gray-500">No spots.</li>`;
        list.innerHTML = html;
    } catch (e) {
        list.innerHTML = `<li class="text-red-600">Error: ${e.message}</li>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('deleteResForm');
    if(!form){
        console.error('❌ deleteResForm not found in DOM');
        return;
    }
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('resIdDel').value.trim();
        const output = document.getElementById('delResOutput');

        if (!id) {
            output.textContent = 'Reservation ID is required';
            output.classList.add('text-red-600');
            return;
        }
        try {
            await http(`${API}/reservations/${encodeURIComponent(id)}`, {method: 'DELETE'});
            document.getElementById('resIdDel').value = '';
            output.textContent = `✅ Reservation #${id} deleted`;
            output.classList.remove('text-red-600');
            output.classList.add('text-green-700');
            const sid = Number(document.getElementById('resSpotId').value.trim());
            if (Number.isFinite(sid) && sid > 0) loadReservations(sid);
        } catch (err) {
            output.textContent = `❌ Error deleting reservation: ${err.message}`;
            output.classList.remove('text-green-700');
            output.classList.add('text-red-600');
        }
    });
});



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
            let preview;

            if (typeof raw === 'object' && raw !== null) {
                preview = Object.entries(raw)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('<br>');
            } else {
                preview = String(raw);
            }
            outputEl.innerHTML = `
                <div class="mt-2 p-2 rounded bg-gray-50 text-sm">
                    ${preview}
                </div>
            `;
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
    }
}

spotIdInput.addEventListener('change', () => {
    const sid = Number(spotIdInput.value.trim());
    if (Number.isFinite(sid) && sid > 0) loadReservations(sid);
});

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

(() => {
    const sid = Number(spotIdInput.value.trim());
    if (Number.isFinite(sid) && sid > 0) loadReservations(sid);
})();


//availability
function renderAvailabilityTable(items){
    if(!Array.isArray(items) || items.length === 0){
        return `<div class="text-gray-500">No free spaces.</div>`;
    }
    const rows = items.map((s, i) => `
    <tr class="border-b last:border-0">
      <td class="px-3 py-2 whitespace-nowrap">#${i + 1}</td>
      <td class="px-3 py-2 font-medium">${s.number ?? '-'}</td>
      <td class="px-3 py-2">${s.type ?? '-'}</td>
      <td class="px-3 py-2 text-right">
        <button class="quick-res px-2 py-1 border rounded hover:bg-gray-100 text-xs"
                data-spot-id="${s.id}" data-spot-number="${s.number}">
          Quick reserve
        </button>
      </td>
    </tr>
  `).join('');

    return `
    <div class="overflow-x-auto rounded border">
        <table class="min-w-full text-sm">
            <thead class="bg-gray-50 text-gray-700">
            <tr>
                <th class="text-left px-3 py-2">#</th>
                <th class="text-left px-3 py-2">Spot Number</th>
                <th class="text-left px-3 py-2">Type</th>
                <th class="text-right px-3 py-2">Action</th>
            </tr>
            </thead>
            <tbody>${rows}</tbody>
      </table>
    </div>
    `;
}

async function loadAvailability(){
    const garageId = document.getElementById('availGarageId').value.trim();
    const startIso = toLocalOffsetISOString(document.getElementById('availStartTime').value);
    const endIso = toLocalOffsetISOString(document.getElementById('availEndTime').value);
    const output = document.getElementById('availabilityOutput');

    if(!garageId || !startIso || !endIso){
        output.innerHTML = `<div class="text-gray-500">Fill all fields and press "Check availability".</div>`;
        output.className = 'mt-3 text-sm text-gray-600';
        return;
    }

    output.innerHTML = '' +
        '<div class="text-gray-500">Loading…</div>';

    try{
        const url =
            `${API}/availability?garageId=${encodeURIComponent(garageId)}&start=${encodeURIComponent(startIso)}&end=${encodeURIComponent(endIso)}`;
        const data = await http(url);
        output.innerHTML = renderAvailabilityTable(data);
        output.className = 'mt-3 text-sm text-gray-800';
    }catch(e){
        output.innerHTML = `<div class="text-red-700">Error: ${e.message}</div>`;
        output.className = 'mt-3 text-sm';
    }

}
(function initAvailability(){
    const form = document.getElementById('availabilityForm');
    const output = document.getElementById('availabilityOutput');
    if (!form || !output) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        loadAvailability();
    });

    output.addEventListener('click', (e) => {
        const btn = e.target.closest('.quick-res');
        if (!btn) return;
        const spotId = btn.dataset.spotId;
        document.getElementById('resSpotId')?.setAttribute('value', spotId);
        const s = document.getElementById('availStartTime')?.value;
        const en = document.getElementById('availEndTime')?.value;
        if (s) document.getElementById('startTime')?.setAttribute('value', s);
        if (en) document.getElementById('endTime')?.setAttribute('value', en);
        document.getElementById('Reservation-section')?.scrollIntoView({ behavior: 'smooth' });
    });
})();