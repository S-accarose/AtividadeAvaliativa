const SERVER_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", function () {
    const botaoComentario = document.querySelector(".comentario");
    const secaoComentario = document.querySelector(".comentario_usuario");

    if (botaoComentario) {
        botaoComentario.addEventListener("click", function () {
            if (secaoComentario.style.display === "none" || secaoComentario.style.display === "") {
                secaoComentario.style.display = "block";
            } else {
                secaoComentario.style.display = "none";
            }
        });
    }

    carregarUsuario();
});

// Guarda usuário no localStorage
function salvarUsuario(usuario) {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    usuarioLogado = usuario;
}

// Pega usuário do localStorage
function carregarUsuario() {
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
        usuarioLogado = JSON.parse(usuario);
    }
}

let usuarioLogado = null;

// CADASTRO
document.getElementById("cadastroForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const nome = document.getElementById("nomeCadastro").value;
    const email = document.getElementById("emailCadastro").value;
    const senha = document.getElementById("senhaCadastro").value;

    const response = await fetch(`${SERVER_URL}/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha })
    });

    const data = await response.json();
    if (data.sucesso) {
        alert("Cadastro realizado com sucesso!");
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
    } else {
        alert(data.mensagem || "Erro ao cadastrar!");
    }
});

// LOGIN
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;

    const response = await fetch(`${SERVER_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });

    const data = await response.json();
    if (data.sucesso) {
        salvarUsuario(data.usuario);
        alert(`Bem-vindo(a), ${usuarioLogado.nome}!`);
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
    } else {
        alert(data.mensagem || "Email ou senha incorretos!");
    }
});

// COMENTAR
document.querySelector(".comentar").addEventListener("click", async function () {
    const textoComentario = document.getElementById("comentarioInput").value.trim();
    if (!usuarioLogado) {
        mostrarModalLoginObrigatorio();
        return;
    }

    if (textoComentario.length === 0) {
        alert("O comentário não pode estar vazio!");
        return;
    }

    const response = await fetch(`${SERVER_URL}/comentar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            usuario_id: usuarioLogado.id,
            comentario: textoComentario
        })
    });

    const data = await response.json();
    if (data.sucesso) {
        alert("Comentário enviado!");
        document.getElementById("comentarioInput").value = "";
        // Atualizar a lista de comentários aqui se quiser
    } else {
        alert(data.mensagem || "Erro ao comentar.");
    }
});

// DAR LIKE
document.querySelector(".likes").addEventListener("click", async function () {
    if (!usuarioLogado) {
        mostrarModalLoginObrigatorio();
        return;
    }

    const response = await fetch(`${SERVER_URL}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            usuario_id: usuarioLogado.id,
            post_id: 1 // Aqui seria o ID real da receita (mockado como 1 por enquanto)
        })
    });

    const data = await response.json();
    if (data.sucesso) {
        alert("Like registrado!");
    } else {
        alert(data.mensagem || "Erro ao dar like.");
    }
});

function mostrarModalLoginObrigatorio() {
    const modal = new bootstrap.Modal(document.getElementById("loginRequiredModal"));
    modal.show();
}