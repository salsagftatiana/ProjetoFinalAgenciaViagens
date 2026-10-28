import { requireUser } from './auth.js';
import { observarReservas } from './reservas-service.js';

const lista = document.getElementById('lista-viagens');
const feedback = document.getElementById('historicoFeedback');
const userEmail = document.getElementById('userEmail');
const texto = (valor, vazio = 'Não indicado') => valor === undefined || valor === null || valor === '' ? vazio : String(valor);

function formatarData(data) {
  if (!data) return 'Não indicada';
  const [ano, mes, dia] = data.split('-');
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : data;
}

function linha(cartao, etiqueta, valor) {
  const p = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = `${etiqueta}: `;
  p.append(strong, document.createTextNode(texto(valor)));
  cartao.appendChild(p);
}

function classeDoEstado(estado) {
  return String(estado || 'Pendente').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function renderizar(reservas) {
  lista.replaceChildren();
  if (!reservas.length) {
    feedback.textContent = 'Ainda não tem viagens registadas.';
    return;
  }
  feedback.textContent = `${reservas.length} agendamento${reservas.length === 1 ? '' : 's'} registado${reservas.length === 1 ? '' : 's'}.`;
  reservas.forEach(reserva => {
    const cartao = document.createElement('article');
    cartao.className = 'cartao-viagem';
    const titulo = document.createElement('h3');
    titulo.textContent = texto(reserva.destino, 'Pedido personalizado');
    cartao.appendChild(titulo);
    linha(cartao, 'Tipo de viagem', reserva.tipo);
    linha(cartao, 'Data', formatarData(reserva.data));
    linha(cartao, 'Cidade', reserva.cidade);
    linha(cartao, 'Passageiros', `${texto(reserva.adultos, '0')} adulto(s), ${texto(reserva.criancas, '0')} criança(s)`);
    const estado = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = 'Estado: ';
    const badge = document.createElement('span');
    badge.className = `badge ${classeDoEstado(reserva.estado)}`;
    badge.textContent = texto(reserva.estado, 'Pendente');
    estado.append(strong, badge);
    cartao.appendChild(estado);
    lista.appendChild(cartao);
  });
}

requireUser(user => {
  userEmail.textContent = user.email || '';
  observarReservas(user.uid, renderizar);
});
