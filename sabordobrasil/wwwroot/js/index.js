const SERVER_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", function () {
    const botaoComentario = document.querySelector(".comentario");
    const secaoComentario = document.querySelector(".comentario_usuario");

    if (botaoComentario) {
        botaoComentario.addEventListener("click", function () {
            secaoComentario.style.display = secaoComentario.style.display === "none" || secaoComentario.style.display === "" ? "block" : "none";
        });
    }

    carregarUsuario();
    controlarBotoesEdicao();
    atualizarContadorComentarios();
    configurarBotaoEntrar();
    atualizarPerfilUsuario();
    ocultarBotaoAddPubParaNaoAdmin();
});

// Usuário logado global
let usuarioLogado = null;

// LocalStorage
function salvarUsuario(usuario) {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    usuarioLogado = usuario;
}

function carregarUsuario() {
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
        usuarioLogado = JSON.parse(usuario);
    }
}

// Cadastro
document.getElementById("cadastroForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nomeCadastro").value;
    const email = document.getElementById("emailCadastro").value;
    const senha = document.getElementById("senhaCadastro").value;
    const fotoInput = document.getElementById("fotoCadastro");
    const formData = new FormData();

    formData.append("nome", nome);
    formData.append("email", email);
    formData.append("senha", senha);
    if (fotoInput.files.length > 0) {
        formData.append("foto", fotoInput.files[0]);
    }

    const response = await fetch("/api/usuario/cadastro", {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    if (data.sucesso) {
        // Mostra mensagem de sucesso
        alert("Cadastro realizado com sucesso! Agora faça login.");
        // Fecha o modal de cadastro (usando Bootstrap 5)
        const cadastroModal = bootstrap.Modal.getInstance(document.getElementById('cadastroModal'));
        if (cadastroModal) cadastroModal.hide();
        // Limpa o formulário
        document.getElementById("cadastroForm").reset();
        // (Opcional) Abre o modal de login automaticamente:
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    } else {
        alert(data.mensagem || "Erro ao cadastrar!");
    }
});

// LOGIN
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;

    const response = await fetch("/api/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (data.sucesso) {
        // Salva o usuário no localStorage
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        // Fecha o modal de login
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (loginModal) loginModal.hide();
        // Atualiza a tela com os dados do usuário
        atualizarPerfilUsuario();
        // (Opcional) Mostra mensagem de boas-vindas
        alert(`Bem-vindo(a), ${data.usuario.nome}!`);
    } else {
        alert(data.mensagem || "Email ou senha incorretos!");
    }
});

// Comentar
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

    const response = await fetch(`${SERVER_URL}/api/comentario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            usuarioId: usuarioLogado.id,
            texto: textoComentario
        })
    });

    const data = await response.json();
    if (data.sucesso) {
        alert("Comentário enviado!");
        document.getElementById("comentarioInput").value = "";

        // Criação do novo comentário no DOM
        const novoComentario = document.createElement("li");
        novoComentario.classList.add("list-group-item", "d-flex", "align-items-start", "justify-content-between");
        novoComentario.setAttribute("data-autor-id", usuarioLogado.id);

        novoComentario.innerHTML = `
            <div class="d-flex">
                <img src="${usuarioLogado.foto || '/imgs/nonsigneduser.png'}" alt="avatar" width="45" height="45" class="rounded-circle me-2">
                <div class="ms-2">
                    <strong>${usuarioLogado.nome}</strong><br>
                    ${textoComentario}
                </div>
            </div>
            <div class="d-flex gap-2">
                <span class="editarcom text-primary" style="cursor:pointer;">Editar</span>
                <span class="apagarcom text-danger" style="cursor:pointer;">Apagar</span>
            </div>
        `;

        document.getElementById("listaComentarios").appendChild(novoComentario);

        novoComentario.querySelector(".editarcom").addEventListener("click", editarComentario);
        novoComentario.querySelector(".apagarcom").addEventListener("click", apagarComentario);

        atualizarContadorComentarios();
    } else {
        alert(data.mensagem || "Erro ao comentar.");
    }
});

// Like
document.querySelector(".likes").addEventListener("click", async function () {
    if (!usuarioLogado) {
        mostrarModalLoginObrigatorio();
        return;
    }

    const response = await fetch(`${SERVER_URL}/api/publicacao/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            usuarioId: usuarioLogado.id,
            publicacaoId: 1 // Troque para o id correto da publicação/prato
        })
    });

    const data = await response.json();
    if (data.sucesso) {
        alert("Like registrado!");
        // Atualize o contador de likes na tela, se necessário
        if (typeof atualizarPerfilUsuario === "function") atualizarPerfilUsuario();
    } else {
        alert(data.mensagem || "Erro ao dar like.");
    }
});

// Dislike
document.querySelector(".dislikes").addEventListener("click", async function () {
    if (!usuarioLogado) {
        mostrarModalLoginObrigatorio();
        return;
    }

    const response = await fetch(`${SERVER_URL}/api/publicacao/dislike`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            usuarioId: usuarioLogado.id,
            publicacaoId: 1 // Troque para o id correto da publicação/prato
        })
    });

    const data = await response.json();
    if (data.sucesso) {
        alert("Dislike registrado!");
        // Atualize o contador de dislikes na tela, se necessário
        if (typeof atualizarPerfilUsuario === "function") atualizarPerfilUsuario();
    } else {
        alert(data.mensagem || "Erro ao dar dislike.");
    }
});

// Mostrar modal login obrigatório
function mostrarModalLoginObrigatorio() {
    const modal = new bootstrap.Modal(document.getElementById("loginRequiredModal"));
    modal.show();
}

// Edição/remoção de comentário
function controlarBotoesEdicao() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return;

    const botoesEditar = document.querySelectorAll(".editarcom");
    const botoesApagar = document.querySelectorAll(".apagarcom");

    botoesEditar.forEach(botao => {
        const li = botao.closest("li");
        const autorId = parseInt(li.getAttribute("data-autor-id"));
        if (autorId === usuario.id) {
            botao.style.display = "inline";
            botao.addEventListener("click", editarComentario);
        } else {
            botao.style.display = "none";
        }
    });

    botoesApagar.forEach(botao => {
        const li = botao.closest("li");
        const autorId = parseInt(li.getAttribute("data-autor-id"));
        if (autorId === usuario.id) {
            botao.style.display = "inline";
            botao.addEventListener("click", apagarComentario);
        } else {
            botao.style.display = "none";
        }
    });
}

function editarComentario(event) {
    const comentarioItem = event.target.closest("li");
    const comentarioTexto = comentarioItem.querySelector("div.ms-2");

    const novoTexto = prompt("Edite seu comentário:", comentarioTexto.innerText.trim());
    if (novoTexto !== null && novoTexto.trim() !== "") {
        comentarioTexto.childNodes[2].nodeValue = " " + novoTexto;
    }
}

function apagarComentario(event) {
    const comentarioItem = event.target.closest("li");
    if (confirm("Tem certeza que deseja apagar este comentário?")) {
        comentarioItem.remove();
        atualizarContadorComentarios();
    }
}

// Botão Entrar vira Sair
function configurarBotaoEntrar() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const botaoEntrar = document.querySelector(".botao");

    if (usuario) {
        botaoEntrar.textContent = "SAIR";
        botaoEntrar.classList.remove("btn-primary");
        botaoEntrar.classList.add("btn-danger");

        botaoEntrar.removeAttribute("data-bs-toggle");
        botaoEntrar.removeAttribute("data-bs-target");

        botaoEntrar.addEventListener("click", function () {
            localStorage.removeItem("usuario");
            alert("Você foi deslogado.");
            location.reload();
        });
    } else {
        botaoEntrar.textContent = "ENTRAR";
        botaoEntrar.classList.remove("btn-danger");
        botaoEntrar.classList.add("btn-primary");

        botaoEntrar.setAttribute("data-bs-toggle", "modal");
        botaoEntrar.setAttribute("data-bs-target", "#loginModal");
    }
}

// Exibir nome, foto, likes e dislikes
function atualizarPerfilUsuario() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return;

    const nomeEl = document.querySelector(".nome");
    if (nomeEl) nomeEl.innerHTML = `<h5>${usuario.nome}</h5>`;

    const fotoEl = document.querySelector(".foto img");
    if (fotoEl) {
        fotoEl.src = usuario.foto && usuario.foto !== "" ? usuario.foto : "/imgs/nonsigneduser.png";
    }

    // Se likes/dislikes vierem do backend, atualize aqui
    const qtdLikesEl = document.querySelector(".qtdlikes h5");
    if (qtdLikesEl) qtdLikesEl.textContent = usuario.likes ?? 0;

    const qtdDislikesEl = document.querySelector(".qtddislikes h5");
    if (qtdDislikesEl) qtdDislikesEl.textContent = usuario.dislikes ?? 0;
}

// Contador de comentários
function atualizarContadorComentarios() {
    const listaComentarios = document.querySelectorAll("#listaComentarios li");
    const contadorEl = document.querySelector(".numcomentarios");

    if (contadorEl) {
        contadorEl.textContent = listaComentarios.length;
    }
}

function ocultarBotaoAddPubParaNaoAdmin() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const botaoAddPub = document.querySelector(".botaoaddpub");
    if (!botaoAddPub) return;

    // Supondo que o administrador tem o email "admin@sabordobrasil.com"
    // ou uma propriedade usuario.admin === true
    if (!usuario || (usuario.email !== "admin@sabordobrasil.com" && !usuario.admin)) {
        botaoAddPub.style.display = "none";
    } else {
        botaoAddPub.style.display = "inline-block";
    }
}
