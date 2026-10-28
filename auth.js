import { auth } from "./firebase-init.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const feedback = document.getElementById("authFeedback");

const nextPage =
  new URLSearchParams(location.search).get("next") ||
  "agendar-viagem.html";

function show(msg, error = false) {
  if (feedback) {
    feedback.textContent = msg;
    feedback.className = error ? "feedback erro" : "feedback";
  }
}

function irParaAgendamento() {
  location.href = nextPage;
}

// LOGIN
document
  .getElementById("loginForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      show("Login efetuado com sucesso.");
      irParaAgendamento();
    } catch (err) {
      show("Erro no login: " + err.message, true);
    }
  });

// REGISTO
document
  .getElementById("registerForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      show("Conta criada com sucesso.");
      irParaAgendamento();
    } catch (err) {
      show("Erro no registo: " + err.message, true);
    }
  });

// LOGOUT
export async function logout() {
  await signOut(auth);
  location.href = "conta.html";
}

// PROTEGER PÁGINAS
export function requireUser(callback) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      location.href =
        "conta.html?next=" +
        encodeURIComponent(
          `${location.pathname.split("/").pop() || "agendar-viagem.html"}${location.search}`
        );
    } else {
      callback(user);
    }
  });
}

