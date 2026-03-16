const btn = document.getElementById('btnPing');
const out = document.getElementById('out');

btn.addEventListener('click', async () => {
  out.textContent = 'Chargement...';
  try {
    const res = await fetch('/api/catalog/ping');
    const data = await res.json();
    out.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    out.textContent = String(e);
  }
});