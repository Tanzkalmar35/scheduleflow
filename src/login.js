import {invoke} from "@tauri-apps/api/tauri";

let loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", submitLoginForm)

export async function submitLoginForm(event) {
    event.preventDefault();
    const loginUsername = document.getElementById("login-modal-username"),
        loginEmail = document.getElementById("login-modal-email"),
        loginPassword = document.getElementById("login-modal-password")

    await invoke("attempt_login", {
        username: loginUsername.value,
        email: loginEmail.value,
        password: loginPassword.value
    })
        .then(m => console.log(m))
        .catch(e => console.log(e))
}
