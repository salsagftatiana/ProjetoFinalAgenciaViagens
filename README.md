# Sonhos em Viagem

Aplicação web para pedido e gestão de viagens. Os utilizadores autenticados podem criar agendamentos e consultar o seu histórico privado.

## Documentação

- [Visão geral do projeto](docs/PROJETO.md)
- [Histórico e persistência de reservas](docs/HISTORICO.md)
- [Configuração do Firebase](docs/FIREBASE.md)

## Executar localmente

É necessário servir os ficheiros por HTTP, pois a aplicação usa módulos JavaScript.

```powershell
python -m http.server 5500
```

Depois, abra `http://localhost:5500/index.html`.

## Tecnologias

- HTML, CSS e JavaScript modular
- Firebase Authentication (email/password)
- Cloud Firestore


