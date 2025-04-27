from flask import Flask, request, jsonify, session
from flask_mysqldb import MySQL
from flask_cors import CORS
import MySQLdb.cursors
import hashlib

app = Flask(__name__)
CORS(app)

# Chave secreta para sessão
app.secret_key = 'chave_secreta_super_segura'

# Configuração do MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'  # seu usuário do MySQL
app.config['MYSQL_PASSWORD'] = ''  # sua senha do MySQL
app.config['MYSQL_DB'] = 'sabordobrasil'  # nome do banco

mysql = MySQL(app)

# Função para criptografar senha
def criptografar_senha(senha):
    return hashlib.sha256(senha.encode()).hexdigest()

# Cadastro de usuário
@app.route('/cadastro', methods=['POST'])
def cadastro():
    dados = request.get_json()
    nome = dados['nome']
    email = dados['email']
    senha = criptografar_senha(dados['senha'])

    cursor = mysql.connection.cursor()
    try:
        cursor.execute('INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s)', (nome, email, senha))
        mysql.connection.commit()
        return jsonify({'sucesso': True})
    except Exception as e:
        print(e)
        return jsonify({'sucesso': False})

# Login de usuário
@app.route('/login', methods=['POST'])
def login():
    dados = request.get_json()
    email = dados['email']
    senha = criptografar_senha(dados['senha'])

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('SELECT * FROM usuarios WHERE email = %s AND senha = %s', (email, senha))
    usuario = cursor.fetchone()

    if usuario:
        session['usuario'] = usuario
        return jsonify({'sucesso': True, 'usuario': {'id': usuario['id_usuario'], 'nome': usuario['nome']}})
    else:
        return jsonify({'sucesso': False})

# Criar comentário
@app.route('/comentar', methods=['POST'])
def comentar():
    if 'usuario' not in session:
        return jsonify({'sucesso': False, 'mensagem': 'Não logado'})

    dados = request.get_json()
    id_usuario = session['usuario']['id_usuario']
    id_receita = dados['id_receita']
    texto = dados['comentario']

    cursor = mysql.connection.cursor()
    cursor.execute('INSERT INTO comentarios (id_usuario, id_receita, texto) VALUES (%s, %s, %s)', (id_usuario, id_receita, texto))
    mysql.connection.commit()

    return jsonify({'sucesso': True})

# Dar like
@app.route('/like', methods=['POST'])
def like():
    if 'usuario' not in session:
        return jsonify({'sucesso': False, 'mensagem': 'Não logado'})

    dados = request.get_json()
    id_usuario = session['usuario']['id_usuario']
    id_receita = dados['id_receita']

    cursor = mysql.connection.cursor()
    cursor.execute('INSERT INTO likes (id_usuario, id_receita) VALUES (%s, %s)', (id_usuario, id_receita))
    mysql.connection.commit()

    return jsonify({'sucesso': True})

# Logout
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('usuario', None)
    return jsonify({'sucesso': True})

if __name__ == '__main__':
    app.run(debug=True)