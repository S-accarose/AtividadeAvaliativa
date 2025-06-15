DROP DATABASE sabordobrasil_luiz;

CREATE DATABASE sabordobrasil_luiz;

use sabordobrasil_luiz;

CREATE TABLE IF NOT EXISTS usuario (
	id_usuario int not null auto_increment primary key,
    nome varchar(100) not null default '',
    email varchar(100) not null default '',
    senha varchar (100) not null default '',
    foto varchar (250) not null default '',
    adm bool default false
);

CREATE TABLE IF NOT EXISTS prato (
  id_prato int not null auto_increment primary key,
  nome varchar(100) not null,
  descricao text null default null,
  foto varchar(250) not null default '',
  localizacao varchar(200),
  criado_por int not null,
	foreign key (criado_por) references usuario (id_usuario)
  );
  
CREATE TABLE IF NOT EXISTS comentario (
	id_comentario int not null auto_increment primary key,
    id_usuario int not null,
    id_prato int not null,
    comentario text not null,
    data_comentario datetime null default current_timestamp,
		foreign key (id_usuario) references usuario (id_usuario),
        foreign key (id_prato) references prato (id_prato)
);

CREATE TABLE IF NOT EXISTS reacao (
  id_reacao int not null auto_increment primary key,
  id_usuario int not null,
  id_prato int not null,
  tipo enum('like', 'deslike') not null,
  data_reacao datetime null default current_timestamp,
    foreign key (id_usuario) references usuario (id_usuario),
    foreign key (id_prato) references prato (id_prato)
);
