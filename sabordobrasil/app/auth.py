from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token
from .models import get_user_by_email, create_user
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/cadastro', methods=['POST'])
def cadastro():
    nome = request.form.get("nome")
    email = request.form.get("email")
    senha = generate_password_hash(request.form.get("senha"))
    admin = int(request.form.get("admin", 0))
    foto = request.files.get("foto")
    foto_path = ""

    if foto:
        filename = secure_filename(foto.filename)
        foto_path = f"imgs/{filename}"
        foto.save(os.path.join("app", "static", "imgs", filename))

    if get_user_by_email(email):
        return jsonify({"sucesso": False, "mensagem": "Usuário já existe"}), 400

    try:
        create_user(nome, email, senha, admin, foto_path)
        return jsonify({"sucesso": True}), 201
    except Exception as e:
        return jsonify({"sucesso": False, "mensagem": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")

    user = get_user_by_email(email)
    if not user or not check_password_hash(user[3], senha):
        return jsonify({"sucesso": False, "mensagem": "Credenciais inválidas"}), 401

    # user = (id, nome, email, senha, foto, admin)
    usuario_dict = {
        "id": user[0],
        "nome": user[1],
        "email": user[2],
        "foto": user[4],  # <-- já está aqui!
        "admin": bool(user[5])
    }
    return jsonify({"sucesso": True, "usuario": usuario_dict})
