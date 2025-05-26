from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

def criar_tabela_usuarios():
    conn = sqlite3.connect('usuario.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def criar_admin():
    conn = sqlite3.connect('usuario.db')
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(usuario)")
    colunas = [col[1] for col in cursor.fetchall()]
    if "admin" not in colunas:
        cursor.execute("ALTER TABLE usuario ADD COLUMN admin INTEGER DEFAULT 0")
        conn.commit()
    cursor.execute("SELECT * FROM usuario WHERE email = ?", ("admin@sabordobrasil.com",))
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO usuario (nome, email, senha, admin) VALUES (?, ?, ?, ?)",
            ("Administrador Sabor do Brasil", "admin@sabordobrasil.com", "admin123", 1)
        )
        conn.commit()
    conn.close()

criar_tabela_usuarios()
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
        conn = sqlite3.connect('usuario.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)', (nome, email, senha))
        conn.commit()
        conn.close()
        return jsonify({'sucesso': True})
    except sqlite3.IntegrityError:
        return jsonify({'sucesso': False, 'mensagem': 'Email já cadastrado.'})
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': str(e)})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    conn = sqlite3.connect('usuario.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, nome, email, admin FROM usuario WHERE email=? AND senha=?", (email, senha))
    usuario = cursor.fetchone()
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