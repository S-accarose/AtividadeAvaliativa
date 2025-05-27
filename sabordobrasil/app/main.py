from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

def get_mysql_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',           # Altere para seu usuário MySQL
        password='sua_senha',  # Altere para sua senha MySQL
        database='mydb'
    )

def criar_admin():
    conn = get_mysql_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Usuario WHERE email = %s", ("admin@sabordobrasil.com",))
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO Usuario (nome, email, senha, admin) VALUES (%s, %s, %s, %s)",
            ("Administrador Sabor do Brasil", "admin@sabordobrasil.com", "admin123", True)
        )
        conn.commit()
    cursor.close()
    conn.close()

criar_admin()

@app.route('/cadastro', methods=['POST'])
def cadastro():
    data = request.get_json()
    nome = data.get('nome')
    email = data.get('email')
    senha = data.get('senha')

    if not nome or not email or not senha:
        return jsonify({'sucesso': False, 'mensagem': 'Preencha todos os campos.'})

    try:
        conn = get_mysql_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO Usuario (nome, email, senha) VALUES (%s, %s, %s)', (nome, email, senha))
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
    cursor.execute("SELECT id_usuario, nome, email, admin FROM Usuario WHERE email=%s AND senha=%s", (email, senha))
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
                'admin': bool(usuario[3])
            }
        })
    else:
        return jsonify({'sucesso': False, 'mensagem': 'Email ou senha incorretos!'})

if __name__ == '__main__':
    app.run(debug=True)