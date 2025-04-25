// Collapse do botão

document.addEventListener("DOMContentLoaded", function () {
    const botaoComentario = document.querySelector(".comentario");
    const secaoComentario = document.querySelector(".comentario_usuario");

    botaoComentario.addEventListener("click", function () {
    if (secaoComentario.style.display === "none" || secaoComentario.style.display === "") {
        secaoComentario.style.display = "block";
    } else {
        secaoComentario.style.display = "none";
    }
    });
});

// Adicionar novo comentário

document.addEventListener("DOMContentLoaded", function () {
    const botaoComentar = document.querySelector(".comentar");
    const textarea = document.getElementById("comentarioInput");
    const lista = document.getElementById("listaComentarios");
    const usuarioLogado = true;
    const nomeUsuario = "Usuário_Logado";
    botaoComentar.addEventListener("click", function () {
    const texto = textarea.value.trim();
    if (!usuarioLogado) {
        alert("Você precisa estar logado para comentar.");
        return;
    }
    if (texto === "") {
        alert("Digite algo para comentar.");
        return;
    }
    const novoComentario = document.createElement("li");
    novoComentario.className = "list-group-item d-flex justify-content-between align-items-start";
    novoComentario.innerHTML = `
        <div class="ms-2 me-auto">
        <div class="fw-bold">${nomeUsuario}</div>
        ${texto}
        </div>
    `;
    lista.appendChild(novoComentario);
    textarea.value = "";
    });
});

// Sistema Login e Cadastro

let usuarios = []; 
let usuarioLogado = null;

document.getElementById("cadastroForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nomeCadastro").value.trim();
    const email = document.getElementById("emailCadastro").value.trim();
    const senha = document.getElementById("senhaCadastro").value;
    const foto = document.getElementById("fotoCadastro").files[0];

    if (usuarios.find(u => u.email === email)) {
    alert("Email já cadastrado.");
    return;
    }

    usuarios.push({ nome, email, senha, foto });
    alert("Cadastro realizado com sucesso!");
    document.getElementById("cadastroForm").reset();
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value;

    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    if (usuario) {
    usuarioLogado = usuario;
    alert("Login realizado com sucesso!");
    document.getElementById("loginForm").reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
    modal.hide();
    } else {
    alert("Email ou senha inválidos.");
    }
});

// Validação de login e bloqueio de interações para usuários deslogados

function mostrarModalLoginObrigatorio() {
const modal = new bootstrap.Modal(document.getElementById("loginRequiredModal"));
modal.show();
}
document.querySelectorAll(".botao-like").forEach(btn => {
btn.addEventListener("click", function (e) {
    if (!usuarioLogado) {
    e.preventDefault();
    mostrarModalLoginObrigatorio();
    }
});
});
const botaoComentar = document.querySelector(".comentar");
if (botaoComentar) {
botaoComentar.addEventListener("click", function (e) {
    if (!usuarioLogado) {
    e.preventDefault();
    mostrarModalLoginObrigatorio();
    }
});
}