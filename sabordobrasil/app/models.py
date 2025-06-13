from . import mysql

def get_user_by_email(email):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM usuario WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    return user

def create_user(nome, email, senha, adm=0, foto=None):
    cursor = mysql.connection.cursor()
    if foto:
        cursor.execute(
            "INSERT INTO usuario (nome, email, senha, adm, foto) VALUES (%s, %s, %s, %s, %s)",
            (nome, email, senha, adm, foto)
        )
    else:
        cursor.execute(
            "INSERT INTO usuario (nome, email, senha, adm) VALUES (%s, %s, %s, %s)",
            (nome, email, senha, adm)
        )
    mysql.connection.commit()
    cursor.close()

def insert_comment(usuario_id, texto, post_id):
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO comentario (usuario_id, texto, post_id) VALUES (%s, %s, %s)", (usuario_id, texto, post_id))
    mysql.connection.commit()
    cursor.close()

def insert_like(usuario_id, post_id, tipo):
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO like (usuario_id, post_id, tipo) VALUES (%s, %s, %s)", (usuario_id, post_id, tipo))
    mysql.connection.commit()
    cursor.close()
