document.querySelectorAll('.pacote-card').forEach(cartao => {
  const destino = cartao.querySelector('h2')?.textContent.trim();
  const link = cartao.querySelector('.ver-detalhes');
  if (!destino || !link) return;
  const proximaPagina = `agendar-viagem.html?destino=${encodeURIComponent(destino)}`;
  link.href = `conta.html?next=${encodeURIComponent(proximaPagina)}`;
});
