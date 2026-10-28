# Histórico de viagens e persistência

## Estado da implementação

A persistência está implementada. Os agendamentos não são guardados em `localStorage`: são gravados na coleção `reservas` do Cloud Firestore.

Para funcionar num ambiente real, é indispensável que o projeto Firebase esteja ativo, que Authentication por email/password e Firestore estejam configurados e que as regras de `firestore.rules` tenham sido publicadas.

## Fluxo de dados

```text
Utilizador autenticado
        |
        v
agendar-viagem.html + reservas-form.js
        |
        | criarReserva(user, dados)
        v
Cloud Firestore / reservas
        |
        | where(userId == user.uid) + onSnapshot
        v
historico.html + historico.js
```

1. `reservas-form.js` obtém o utilizador autenticado através de `requireUser`.
2. Ao submeter o formulário, chama `criarReserva(user, dados)`.
3. `reservas-service.js` cria um documento em `reservas` com o UID, email, estado e datas de criação/atualização do servidor.
4. Após a gravação, o utilizador é encaminhado para `historico.html`.
5. `historico.js` subscreve alterações à coleção com `onSnapshot`; por isso, novos dados ou alterações são refletidos automaticamente.

## Estrutura de uma reserva

| Campo | Origem / finalidade |
| --- | --- |
| `userId` | UID Firebase do proprietário; usado para isolamento de dados. |
| `userEmail` | Email da conta que submeteu o pedido. |
| `estado` | Estado inicial: `Pendente`. |
| `createdAt` / `updatedAt` | Datas de servidor do Firestore. |
| `nome`, `email`, `telemovel` | Dados de contacto. |
| `destino`, `tipo`, `data` | Dados principais da viagem. |
| `adultos`, `criancas`, `quarto`, `extras` | Preferências da reserva. |
| `observacoes` | Informação complementar facultativa. |

## Privacidade

O histórico não usa uma chave global no navegador. A consulta é filtrada por `userId` e as regras do Firestore confirmam no servidor que o UID autenticado coincide com o proprietário do documento. Assim, um utilizador só recebe as suas próprias reservas.

## Teste manual

1. Inicie um servidor HTTP local e abra a aplicação.
2. Crie uma conta ou inicie sessão.
3. Abra `agendar-viagem.html` e submeta um agendamento válido.
4. Confirme o redirecionamento para `historico.html` e a apresentação da reserva.
5. Saia da conta e entre com outro utilizador; o histórico não deverá mostrar a reserva anterior.


