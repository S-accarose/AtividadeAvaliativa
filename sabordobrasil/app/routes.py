from flask import Blueprint, request, jsonify, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import insert_comment, insert_like

routes_bp = Blueprint('routes', __name__)

@routes_bp.route('/')
def index():
    return render_template('index.html')

@routes_bp.route('/comentar', methods=['POST'])
@jwt_required()
def comentar():
    data = request.get_json()
    usuario_id = get_jwt_identity()
    texto = data.get("comentario")
    post_id = data.get("post_id", 1)

    insert_comment(usuario_id, texto, post_id)
    return jsonify({"msg": "Comentário enviado com sucesso!", "sucesso": True})

@routes_bp.route('/like', methods=['POST'])
@jwt_required()
def like():
    data = request.get_json()
    usuario_id = get_jwt_identity()
    post_id = data.get("post_id")
    tipo = data.get("tipo", 1)

    insert_like(usuario_id, post_id, tipo)
    return jsonify({"msg": "Like registrado", "sucesso": True})
