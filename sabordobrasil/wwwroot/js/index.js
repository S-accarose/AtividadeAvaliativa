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
    carregarPublicacoes();
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

    const response = await fetch(`${SERVER_URL}/api/usuario/cadastro`, {
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

    const response = await fetch(`${SERVER_URL}/api/usuario/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (data.sucesso) {
        // Salva o usuário no localStorage
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        // Atualiza a página para refletir o login
        location.reload();
    } else {
        alert(data.mensagem || "Erro ao fazer login!");
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

    // Garante que o campo adm é booleano
    if (usuario && (usuario.adm === true || usuario.adm === "true" || usuario.adm === 1)) {
        botaoAddPub.style.display = "inline-block";
    } else {
        botaoAddPub.style.display = "none";
    }
}

// Chame essa função após login/cadastro e ao carregar a página
document.addEventListener("DOMContentLoaded", ocultarBotaoAddPubParaNaoAdmin);

const botaoAddPub = document.querySelector(".botaoaddpub");
if (botaoAddPub) {
    botaoAddPub.addEventListener("click", function () {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        // Garante que só admin pode abrir o modal
        if (usuario && (usuario.adm === true || usuario.adm === "true" || usuario.adm === 1)) {
            // Preenche o campo "Criado por" com o nome do admin logado
            const criadoPorInput = document.getElementById("criadoPor");
            if (criadoPorInput) criadoPorInput.value = usuario.nome;
            // Abre o modal de cadastro de publicação
            const modal = new bootstrap.Modal(document.getElementById('cadastroPubModal'));
            modal.show();
        } else {
            alert("Apenas administradores podem criar publicações.");
        }
    });
}

// Cadastro de publicação
document.addEventListener("DOMContentLoaded", function () {
    const formPub = document.getElementById("cadastroPubForm");
    if (formPub) {
        formPub.addEventListener("submit", async function (e) {
            e.preventDefault();

            const usuario = JSON.parse(localStorage.getItem("usuario"));
            if (!usuario || !(usuario.adm === true || usuario.adm === "true" || usuario.adm === 1)) {
                alert("Apenas administradores podem criar publicações.");
                return;
            }

            const nome = document.getElementById("nomePrato").value;
            const descricao = document.getElementById("descricaoPrato").value;
            const localizacao = document.getElementById("localizacaoPrato").value;
            const fotoInput = document.getElementById("fotoPrato");
            const criadoPor = usuario.id;

            const formData = new FormData();
            formData.append("Nome", nome);
            formData.append("Descricao", descricao);
            formData.append("Localizacao", localizacao);
            formData.append("CriadoPor", criadoPor);
            if (fotoInput.files.length > 0) {
                formData.append("Foto", fotoInput.files[0]);
            }

            const resp = await fetch("/api/publicacao/cadastro", {
                method: "POST",
                body: formData
            });

            const data = await resp.json();

            if (data.sucesso) {
                // Fecha o modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('cadastroPubModal'));
                if (modal) modal.hide();
                // Limpa o formulário
                formPub.reset();
                // Atualiza a lista de publicações
                carregarPublicacoes();
                alert("Publicação criada com sucesso!");
            } else {
                alert(data.mensagem || "Erro ao criar publicação.");
            }
        });
    }
});


function criarCardPublicacao(pub) {
    const card = document.createElement("div");
    card.className = "card card-publicacao";

    const qtdLikes = pub.qtdLikes ?? 0;
    const qtdDislikes = pub.qtdDislikes ?? 0;
    const qtdComentarios = pub.qtdComentarios ?? 0;

    const publicacaoId = pub.id ?? 0;

    card.innerHTML = `
        <div class="titulo titulo-publicacao" style="margin: 0 0 20px 0;"><h5>${pub.nome}</h5></div>
        <div class="container">
            <img src="${pub.foto}" style="width:590px; height: 390px; border-radius:2%;" alt="...">
        </div>
        <div class="card-body corpo-publicacao">
            <div class="descricao descricao-publicacao" style="margin: 0 0 30px 0;">
                <div class="hstack">
                    <div class="p-2"><h6 style="word-break: break-word; overflow-wrap: break-word; max-height: 150px; overflow: hidden;">${pub.descricao}</h6></div>
                    <div class="p-2 ms-auto"><h6>${pub.localizacao || ""}</h6></div>
                </div>
            </div>

            <div class="hstack align-items-center mt-3">
                <div class="p-2 d-flex align-items-center">
                    <i class="fa-solid fa-thumbs-up fa-2x botao-like" style="cursor:pointer;"></i>
                    <span class="contador contador-like ms-2"></span>
                </div>
                <div class="p-2 d-flex align-items-center">
                    <i class="fa-solid fa-thumbs-down fa-2x botao-dislike" style="cursor:pointer;"></i>
                    <span class="contador contador-dislike ms-2"></span>
                </div>
                <div class="p-2 ms-auto d-flex align-items-center">
                    <i class="fa-solid fa-comment fa-2x comentario" style="cursor:pointer;"></i>
                    <span class="contador contador-comentario ms-2">${qtdComentarios}</span>
                </div>
            </div>

            <!-- Aba oculta de comentários -->
            <div class="comentarios-section mt-3" style="display: none;">
                <ul class="list-group mb-2 lista-comentarios"></ul>
                <div class="input-group">
                    <input type="text" class="form-control input-comentario" placeholder="Escreva um comentário...">
                    <button class="btn btn-primary btn-comentar comentar" type="button">Comentar</button>
                </div>
            </div>
        </div>
    `;

    // Referências internas ao card (não usar document.querySelector!)
    const likeIcon = card.querySelector(".botao-like");
    const dislikeIcon = card.querySelector(".botao-dislike");
    const likeCounter = card.querySelector(".contador-like");
    const dislikeCounter = card.querySelector(".contador-dislike");
    const comentarioIcon = card.querySelector(".comentario");
    const abaComentarios = card.querySelector(".comentarios-section");
    const listaComentarios = card.querySelector(".lista-comentarios");
    const inputComentario = card.querySelector(".input-comentario");
    const btnComentar = card.querySelector(".btn-comentar");
    const comentarioCounter = card.querySelector(".contador-comentario");

    // Alternar visibilidade da aba
    comentarioIcon.addEventListener("click", () => {
        abaComentarios.style.display = abaComentarios.style.display === "none" ? "block" : "none";
    });

    // Comentário
    btnComentar.addEventListener("click", () => {
        const texto = inputComentario.value.trim();
        if (!usuarioLogado) {
            mostrarModalLoginObrigatorio();
            return;
        }
        if (texto === "") {
            alert("Digite um comentário válido.");
            return;
        }

        // Criação no DOM
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "align-items-start", "justify-content-between");
        li.setAttribute("data-autor-id", usuarioLogado.id);
        li.innerHTML = `
            <div class="d-flex">
                <img src="${usuarioLogado.foto || '/imgs/nonsigneduser.png'}" alt="avatar" width="45" height="45" class="rounded-circle me-2">
                <div class="ms-2">
                    <strong>${usuarioLogado.nome}</strong><br>
                    ${texto}
                </div>
            </div>
            <div class="d-flex gap-2">
                <span class="editarcom text-primary" style="cursor:pointer;">Editar</span>
                <span class="apagarcom text-danger" style="cursor:pointer;">Apagar</span>
            </div>
        `;
        listaComentarios.appendChild(li);
        inputComentario.value = "";

        comentarioCounter.textContent = parseInt(comentarioCounter.textContent) + 1;

        li.querySelector(".editarcom").addEventListener("click", editarComentario);
        li.querySelector(".apagarcom").addEventListener("click", apagarComentario);
    });

    // Like
    likeIcon.addEventListener("click", async () => {
        if (!usuarioLogado) {
            mostrarModalLoginObrigatorio();
            return;
        }

        const response = await fetch(`${SERVER_URL}/api/publicacao/like`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuarioId: usuarioLogado.id,
                pratoId: publicacaoId
            })
        });

        const data = await response.json();

        if (data.sucesso) {
            if (data.removido) {
                // Like removido
                likeIcon.classList.remove("ativo");
                
            } else {
                // Like adicionado
                likeIcon.classList.add("ativo");

                if (!dislikeIcon.classList.contains("ativo")) {
                    
                }

                if (dislikeIcon.classList.contains("ativo")) {
                    dislikeIcon.classList.remove("ativo");
                    
                }
            }
        } else {
            alert(data.mensagem || "Erro ao dar/remover like.");
        }
    });


    // Dislike
    dislikeIcon.addEventListener("click", async () => {
        if (!usuarioLogado) {
            mostrarModalLoginObrigatorio();
            return;
        }

        const response = await fetch(`${SERVER_URL}/api/publicacao/dislike`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuarioId: usuarioLogado.id,
                pratoId: publicacaoId
            })
        });

        const data = await response.json();

        if (data.sucesso) {
            if (data.removido) {
                // Dislike removido
                dislikeIcon.classList.remove("ativo");
            } else {
                // Dislike adicionado
                dislikeIcon.classList.add("ativo");


                if (likeIcon.classList.contains("ativo")) {
                    likeIcon.classList.remove("ativo");
                }
            }
        } else {
            alert(data.mensagem || "Erro ao dar/remover dislike.");
        }
    });


    return card;
}


async function carregarPublicacoes() {
    const resp = await fetch("/api/publicacao/listar");
    if (!resp.ok) {
        alert("Erro ao carregar publicações!");
        return;
    }
    const lista = await resp.json();
    const container = document.getElementById("publicacoesContainer");
    container.innerHTML = "";
    lista.forEach(pub => {
        container.appendChild(criarCardPublicacao(pub));
    });
}