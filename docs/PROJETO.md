# Visão geral do projeto

## Objetivo

O projeto **Sonhos em Viagem** permite a utilizadores registados submeter pedidos de viagem e consultar os pedidos que já efetuaram.

## Páginas principais

| Ficheiro | Responsabilidade |
| --- | --- |
| `index.html` | Página inicial e entrada para a autenticação. |
| `agendar-viagem.html` | Formulário de agendamento; cria a reserva persistente. |
| `historico.html` | Histórico privado das reservas do utilizador autenticado. |
| `minhas-reservas.html` | Gestão de reservas com pesquisa, edição e eliminação. |
| `conta.html` | Registo/autenticação com Firebase. |
| `pacotes.html` | Pacotes promocionais. |
| `sobre.html` | Página institucional da agência. |

## Organização do código

| Ficheiro | Responsabilidade |
| --- | --- |
| `firebase-config.js` | Dados de ligação ao projeto Firebase. |
| `firebase-init.js` | Inicializa Authentication e Firestore. |
| `auth.js` | Registo, autenticação, sessão, saída e proteção de páginas. |
| `auth-guard.js` | Protege páginas que exigem sessão iniciada. |
| `reservas-service.js` | Operações persistentes sobre a coleção `reservas`. |
| `reservas-form.js` | Recolhe e grava os dados de `agendar-viagem.html`. |
| `historico.js` | Lê e apresenta o histórico do utilizador atual. |

## Limites de acesso

Uma reserva pertence a um único utilizador. O identificador do proprietário é guardado em `userId`, usando o UID devolvido pelo Firebase Authentication. As regras do Firestore impedem leitura, edição ou eliminação por outro utilizador. Consulte [FIREBASE.md](FIREBASE.md).


