# Configuração do Firebase

## Serviços necessários

1. Crie ou selecione o projeto Firebase indicado em `firebase-config.js`.
2. Em **Authentication > Sign-in method**, ative o fornecedor **Email/Password**.
3. Em **Firestore Database**, crie a base de dados.
4. Publique as regras presentes em `firestore.rules`.

## Regras de segurança

O ficheiro `firestore.rules` contém a política de acesso à coleção `reservas`:

- criar: apenas utilizador autenticado, com `userId` igual ao seu UID;
- ler, editar e eliminar: apenas o proprietário do documento.

Publique as regras pela consola Firebase ou com a Firebase CLI:

```powershell
firebase deploy --only firestore:rules
```

## Verificação da persistência

Depois de criar uma reserva, abra **Firestore Database > Data** na consola Firebase. Deve existir um documento na coleção `reservas` com `userId`, `createdAt`, `updatedAt` e os dados submetidos.

## Notas de desenvolvimento

- As chaves de configuração web identificam o projeto e não substituem as regras de segurança do Firestore.
- Não guarde palavras-passe no Firestore; a autenticação é gerida pelo Firebase Authentication.
- Para produção, adicione o domínio publicado à lista de domínios autorizados em Authentication.

