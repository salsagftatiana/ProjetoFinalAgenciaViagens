import { requireUser } from './auth.js';
import { criarReserva } from './reservas-service.js';

const form = document.getElementById('reservaForm');
const feedback = document.getElementById('feedback');
const dataInput = document.getElementById('data');
const destinoInput = document.getElementById('destino');
const botaoRascunho = document.getElementById('guardarRascunho');
let utilizadorAtual = null;
let sessaoConfirmada = false;

function msg(texto, erro = false) {
  feedback.textContent = texto;
  feedback.className = erro ? 'feedback erro' : 'feedback';
}

const hoje = new Date().toISOString().slice(0, 10);
dataInput.min = hoje;

const destinoDoPacote = new URLSearchParams(location.search).get('destino');
if (destinoDoPacote) {
  const opcao = [...destinoInput.options].find(item => item.value === destinoDoPacote);
  if (opcao) destinoInput.value = destinoDoPacote;
  else destinoInput.add(new Option(destinoDoPacote, destinoDoPacote, true, true));
}

function valor(id) {
  return document.getElementById(id)?.value.trim() || '';
}

function recolherDados(estado) {
  const selecionados = nome => [...form.querySelectorAll(`[name="${nome}"]:checked`)].map(item => item.value);
  return {
    nome: valor('nome'), nascimento: valor('nascimento'), passaporte: valor('passaporte'),
    nacionalidade: valor('nacionalidade'), telemovel: `${valor('codigo-pais')} ${valor('telemovel')}`.trim(),
    email: valor('email'), endereco: valor('endereco'), numero: valor('numero'),
    codigoPostal: valor('codigo-postal'), cidade: valor('cidade'), tipo: valor('tipo'),
    destino: valor('destino'), data: valor('data'), horaChegada: valor('hora-chegada'),
    horaPartida: valor('hora-partida'), adultos: valor('adultos'), criancas: valor('criancas'),
    precoMinimo: Number(valor('preco-minimo') || 0), precoMaximo: Number(valor('preco-maximo') || 0),
    classeVoo: valor('classe-voo'), hospedagem: valor('hospedagem'), quarto: selecionados('quarto'),
    extras: selecionados('extras'), observacoes: valor('observacoes'), estado
  };
}

async function guardar(estado) {
  if (!sessaoConfirmada) {
    msg('Não foi possível confirmar a sessão. Será encaminhado para a página de conta.', true);
    setTimeout(() => {
      location.href = `conta.html?next=${encodeURIComponent(location.pathname.split('/').pop() + location.search)}`;
    }, 1200);
    return;
  }
  if (!utilizadorAtual) return;
  if (estado === 'Pendente') {
    if (!form.checkValidity()) {
      form.reportValidity();
      msg('Preencha todos os campos obrigatórios.', true);
      return;
    }
    const minimo = Number(valor('preco-minimo') || 0);
    const maximo = Number(valor('preco-maximo') || 0);
    if (maximo && minimo > maximo) {
      msg('O preço mínimo não pode ser superior ao preço máximo.', true);
      return;
    }
    if (dataInput.value < hoje) {
      msg('Selecione uma data futura para a viagem.', true);
      return;
    }
  }
  botaoRascunho.disabled = true;
  msg(estado === 'Rascunho' ? 'A guardar o rascunho…' : 'A guardar o agendamento…');
  try {
    await criarReserva(utilizadorAtual, recolherDados(estado));
    msg(estado === 'Rascunho' ? 'Rascunho guardado. A abrir o histórico…' : 'Agendamento guardado com sucesso. A abrir o histórico…');
    // Depois de o rascunho/agendamento ser gravado, apresenta a confirmação.
    location.href = 'agendamento-sucesso.html';
  } catch (erro) {
    botaoRascunho.disabled = false;
    msg(`Não foi possível guardar: ${erro.message}`, true);
  }
}

form.addEventListener('submit', event => event.preventDefault());
botaoRascunho.addEventListener('click', () => guardar('Rascunho'));

requireUser(user => {
  utilizadorAtual = user;
  sessaoConfirmada = true;
  const email = document.getElementById('email');
  if (!email.value) email.value = user.email || '';
  msg('Sessão iniciada. Pode guardar um rascunho ou submeter o agendamento.');
});

setTimeout(() => {
  if (!sessaoConfirmada) {
    msg('Não foi possível validar a autenticação. Confirme a configuração do Firebase e entre na sua conta.', true);
  }
}, 6000);


