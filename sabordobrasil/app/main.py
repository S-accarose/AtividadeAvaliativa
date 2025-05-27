from flask import Flask, request, jsonify
import mysql.connector
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

def get_mysql_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',  # Altere para seu usuário MySQL
        password='1234',  # Altere para sua senha MySQL
        database='mydb'
    )

@app.route('/cadastro', methods=['POST'])
def cadastro():
    nome = request.form.get('nome')
    email = request.form.get('email')
    senha = request.form.get('senha')
    foto = request.files.get('foto')

    if not nome or not email or not senha:
        return jsonify({'sucesso': False, 'mensagem': 'Preencha todos os campos.'})

    foto_path_db = None
    if foto:
        # Cria a pasta se não existir
        pasta_fotos = os.path.join(app.root_path, 'static', 'fotos')
        os.makedirs(pasta_fotos, exist_ok=True)
        # Gera um nome seguro para o arquivo
        filename = secure_filename(email + '_' + foto.filename)
        foto_path = os.path.join(pasta_fotos, filename)
        foto.save(foto_path)
        # Caminho relativo para salvar no banco
        foto_path_db = f'fotos/{filename}'

    try:
        conn = get_mysql_connection()
        cursor = conn.cursor()
        if foto_path_db:
            cursor.execute(
                'INSERT INTO Usuario (nome, email, senha, foto) VALUES (%s, %s, %s, %s)',
                (nome, email, senha, foto_path_db)
            )
        else:
            cursor.execute(
                'INSERT INTO Usuario (nome, email, senha) VALUES (%s, %s, %s)',
                (nome, email, senha)
            )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'sucesso': True})
    except mysql.connector.IntegrityError:
        return jsonify({'sucesso': False, 'mensagem': 'Email já cadastrado.'})
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': str(e)})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    conn = get_mysql_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id_usuario, nome, email, adm FROM Usuario WHERE email=%s AND senha=%s", (email, senha))
    usuario = cursor.fetchone()
    cursor.close()
    conn.close()

    if usuario:
        return jsonify({
            'sucesso': True,
            'usuario': {
                'id': usuario[0],
                'nome': usuario[1],
                'email': usuario[2],
                'adm': bool(usuario[3])
            }
        })
    else:
        return jsonify({'sucesso': False, 'mensagem': 'Email ou senha incorretos!'})

if __name__ == '__main__':
    app.run(debug=True)