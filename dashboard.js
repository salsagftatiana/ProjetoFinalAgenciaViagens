import { requireUser, logout } from './auth.js';
import { observarReservas, atualizarReserva, apagarReserva } from './reservas-service.js';

let reservas = []; const list = document.getElementById('reservasList');
const feedback = document.getElementById('dashFeedback');
const show = (m, e = false) => { feedback.textContent = m; feedback.className = e ? 'feedback erro' : 'feedback' };
logoutBtn.onclick = logout; searchInput.oninput = render; estadoFiltro.onchange = render;

requireUser(user => {
  userEmail.textContent = user.email;
  observarReservas(user.uid, dados => { reservas = dados; render(); });
});
function render() {
  const termo = searchInput.value.toLowerCase(); const estado = estadoFiltro.value;
  const filtradas = reservas.filter(r => (!estado || r.estado === estado) && [r.nome, r.destino, r.cidade].join(' ').toLowerCase().includes(termo));
  list.innerHTML = filtradas.map(r => `<article class="reserva-card"><h3>${r.destino || 'Reserva'}</h3><p><b>Nome:</b> ${r.nome || ''}</p><p><b>Cidade:</b> ${r.cidade || ''}</p><p><b>Email:</b> ${r.email || ''}</p><p><b>Estado:</b> ${r.estado || 'Pendente'}</p><div><button data-edit="${r.id}">Editar</button><button class="danger" data-del="${r.id}">Apagar</button></div></article>`).join('') || '<p>Sem reservas encontradas.</p>';
}
list.addEventListener('click', async e => {
  const id = e.target.dataset.edit || e.target.dataset.del; if (!id) return; const r = reservas.find(x => x.id === id);
  if (e.target.dataset.del) { if (confirm('Apagar esta reserva?')) { await apagarReserva(id); show('Reserva apagada com sucesso.'); } return; }
  editId.value = id; editNome.value = r.nome || ''; editDestino.value = r.destino || ''; editCidade.value = r.cidade || ''; editEstado.value = r.estado || 'Pendente'; editDialog.showModal();
});
editForm.addEventListener('submit', async e => {
  e.preventDefault();
  await atualizarReserva(editId.value, { nome: editNome.value.trim(), destino: editDestino.value.trim(), cidade: editCidade.value.trim(), estado: editEstado.value });
  editDialog.close(); show('Reserva atualizada com sucesso.');
});

