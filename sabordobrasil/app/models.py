from . import mysql

def get_user_by_email(email):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    return user

def create_user(nome, email, senha):
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s)", (nome, email, senha))
    mysql.connection.commit()
    cursor.close()

def insert_comment(usuario_id, texto, post_id):
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO comentarios (usuario_id, texto, post_id) VALUES (%s, %s, %s)", (usuario_id, texto, post_id))
    mysql.connection.commit()
    cursor.close()

def insert_like(usuario_id, post_id, tipo):
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO likes (usuario_id, post_id, tipo) VALUES (%s, %s, %s)", (usuario_id, post_id, tipo))
    mysql.connection.commit()
    cursor.close()
