from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from .models import get_user_by_email, create_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/cadastro', methods=['POST'])
def cadastro():
    data = request.get_json()
    nome = data.get("nome")
    email = data.get("email")
    senha = generate_password_hash(data.get("senha"))

    if get_user_by_email(email):
        return jsonify({"msg": "Usuário já existe"}), 400

    create_user(nome, email, senha)
    return jsonify({"msg": "Cadastro realizado com sucesso!"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")

    user = get_user_by_email(email)
    if not user or not check_password_hash(user[3], senha):
        return jsonify({"msg": "Credenciais inválidas"}), 401

    access_token = create_access_token(identity=user[0])  # user[0] = id
    return jsonify({"access_token": access_token, "usuario": {"id": user[0], "nome": user[1]}})
