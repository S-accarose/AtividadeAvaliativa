-- MySQL Script generated by MySQL Workbench
-- Tue Apr 22 21:24:15 2025
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Usuario` (
  `id_usuario` INT NULL DEFAULT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `foto` VARCHAR(255) NULL DEFAULT NULL,
  `admin` TINYINT NULL DEFAULT FALSE,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX (`email` ASC) VISIBLE);


-- -----------------------------------------------------
-- Table `mydb`.`Localidade`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Localidade` (
  `id_localidade` INT NULL DEFAULT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_localidade`));


-- -----------------------------------------------------
-- Table `mydb`.`Prato`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Prato` (
  `id_prato` INT NULL DEFAULT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `descricao` TEXT NULL DEFAULT NULL,
  `foto` VARCHAR(255) NULL DEFAULT NULL,
  `id_localidade` INT NULL DEFAULT NULL,
  `criado_por` INT NOT NULL,
  PRIMARY KEY (`id_prato`),
  INDEX (`criado_por` ASC) VISIBLE,
  INDEX (`id_localidade` ASC) VISIBLE,
  CONSTRAINT ``
    FOREIGN KEY (`criado_por`)
    REFERENCES `mydb`.`Usuario` (`id_usuario`),
  CONSTRAINT ``
    FOREIGN KEY (`id_localidade`)
    REFERENCES `mydb`.`Localidade` (`id_localidade`));


-- -----------------------------------------------------
-- Table `mydb`.`Comentario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Comentario` (
  `id_comentario` INT NULL DEFAULT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `id_prato` INT NOT NULL,
  `texto` TEXT NOT NULL,
  `data_comentario` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_comentario`),
  INDEX `idx_comentario_prato` (`id_prato` ASC) VISIBLE,
  INDEX (`id_usuario` ASC) VISIBLE,
  INDEX (`id_prato` ASC) VISIBLE,
  CONSTRAINT ``
    FOREIGN KEY (`id_usuario`)
    REFERENCES `mydb`.`Usuario` (`id_usuario`),
  CONSTRAINT ``
    FOREIGN KEY (`id_prato`)
    REFERENCES `mydb`.`Prato` (`id_prato`));


-- -----------------------------------------------------
-- Table `mydb`.`Reacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Reacao` (
  `id_reacao` INT NULL DEFAULT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `id_prato` INT NOT NULL,
  `tipo` ENUM('like', 'deslike') NOT NULL,
  `data_reacao` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_reacao`),
  UNIQUE INDEX (`id_usuario` ASC, `id_prato` ASC) VISIBLE,
  INDEX `idx_reacao_prato` (`id_prato` ASC) VISIBLE,
  INDEX (`id_usuario` ASC) VISIBLE,
  INDEX (`id_prato` ASC) VISIBLE,
  CONSTRAINT ``
    FOREIGN KEY (`id_usuario`)
    REFERENCES `mydb`.`Usuario` (`id_usuario`),
  CONSTRAINT ``
    FOREIGN KEY (`id_prato`)
    REFERENCES `mydb`.`Prato` (`id_prato`));


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

INSERT INTO `mydb`.`Usuario` (`nome`, `email`, `senha`, `admin`)
VALUES 
('Ana Souza', 'ana.souza@example.com', 'senha123', FALSE),
('Carlos Lima', 'carlos.lima@example.com', 'senha456', TRUE),
('Mariana Silva', 'mariana.silva@example.com', 'senha789', FALSE),
('João Pedro', 'joao.pedro@example.com', 'senha321', FALSE),
('Lucia Alves', 'lucia.alves@example.com', 'senha654', TRUE),
('Paulo Costa', 'paulo.costa@example.com', 'senha987', FALSE),
('Fernanda Rocha', 'fernanda.rocha@example.com', 'senha147', FALSE),
('Bruno Marques', 'bruno.marques@example.com', 'senha258', FALSE),
('Patricia Gomes', 'patricia.gomes@example.com', 'senha369', FALSE),
('Renato Dias', 'renato.dias@example.com', 'senha159', FALSE),
('Juliana Pinto', 'juliana.pinto@example.com', 'senha753', FALSE),
('Thiago Moreira', 'thiago.moreira@example.com', 'senha852', FALSE),
('Amanda Melo', 'amanda.melo@example.com', 'senha951', FALSE),
('Felipe Andrade', 'felipe.andrade@example.com', 'senha1234', FALSE),
('Camila Ribeiro', 'camila.ribeiro@example.com', 'senha4321', FALSE),
('Gabriel Freitas', 'gabriel.freitas@example.com', 'senha5678', FALSE),
('Lorena Teixeira', 'lorena.teixeira@example.com', 'senha8765', FALSE),
('Diego Barbosa', 'diego.barbosa@example.com', 'senha0001', FALSE),
('Aline Fernandes', 'aline.fernandes@example.com', 'senha1000', FALSE),
('Rodrigo Neves', 'rodrigo.neves@example.com', 'senha2222', FALSE);

INSERT INTO `mydb`.`Localidade` (`nome`)
VALUES 
('São Paulo'),
('Rio de Janeiro'),
('Belo Horizonte'),
('Salvador'),
('Fortaleza'),
('Curitiba'),
('Manaus'),
('Recife'),
('Porto Alegre'),
('Brasília'),
('Belém'),
('Goiânia'),
('São Luís'),
('Natal'),
('Maceió'),
('Campo Grande'),
('João Pessoa'),
('Cuiabá'),
('Teresina'),
('Aracaju');

INSERT INTO `mydb`.`Prato` (`nome`, `descricao`, `id_localidade`, `criado_por`)
VALUES 
('Feijoada', 'Prato tradicional brasileiro com feijão preto e carnes.', 1, 1),
('Moqueca', 'Peixe cozido com leite de coco e dendê.', 4, 2),
('Pão de Queijo', 'Pão feito com polvilho e queijo.', 3, 3),
('Acarajé', 'Bola de feijão-frita no azeite de dendê.', 4, 4),
('Tacacá', 'Caldo típico amazônico com jambu.', 7, 5),
('Barreado', 'Carne cozida por horas em panela de barro.', 6, 6),
('Churrasco Gaúcho', 'Carnes assadas na brasa.', 9, 7),
('Vatapá', 'Prato cremoso feito com pão, camarão e dendê.', 4, 8),
('Cuscuz Paulista', 'Prato de milho com legumes e sardinha.', 1, 9),
('Escondidinho', 'Purê de mandioca com carne seca.', 3, 10),
('Tapioca', 'Massa de goma recheada.', 5, 11),
('Carne de Sol com Macaxeira', 'Tradicional do Nordeste.', 2, 12),
('Dobradinha', 'Bucho de boi cozido com feijão branco.', 1, 13),
('Rabada', 'Rabo de boi cozido com agrião.', 10, 14),
('Baião de Dois', 'Arroz com feijão verde e carne seca.', 5, 15),
('Quibebe', 'Purê de abóbora temperado.', 8, 16),
('Galinhada', 'Arroz com pedaços de frango.', 12, 17),
('Sururu', 'Molusco típico do litoral nordestino.', 15, 18),
('Caldeirada', 'Sopa grossa de peixes variados.', 14, 19),
('Peixada Cearense', 'Peixe cozido com legumes.', 5, 20);

INSERT INTO `mydb`.`Comentario` (`id_usuario`, `id_prato`, `texto`)
VALUES 
(1, 1, 'Delicioso!'),
(2, 2, 'Muito bem temperado.'),
(3, 3, 'Perfeito no café da manhã.'),
(4, 4, 'Bem autêntico.'),
(5, 5, 'Experiência única.'),
(6, 6, 'Ótimo prato tradicional.'),
(7, 7, 'Sabor incrível.'),
(8, 8, 'Muito gostoso.'),
(9, 9, 'Bom, mas podia estar mais quente.'),
(10, 10, 'Uma delícia.'),
(11, 11, 'Simples e saboroso.'),
(12, 12, 'Amei!'),
(13, 13, 'Bem servido.'),
(14, 14, 'Diferente e gostoso.'),
(15, 15, 'Me surpreendeu.'),
(16, 16, 'Vale a pena experimentar.'),
(17, 17, 'Muito bom mesmo!'),
(18, 18, 'Bem temperado.'),
(19, 19, 'Super recomendo.'),
(20, 20, 'Muito bom, nota 10!');

INSERT INTO `mydb`.`Reacao` (`id_usuario`, `id_prato`, `tipo`)
VALUES 
(1, 1, 'like'),
(2, 2, 'like'),
(3, 3, 'deslike'),
(4, 4, 'like'),
(5, 5, 'like'),
(6, 6, 'like'),
(7, 7, 'deslike'),
(8, 8, 'like'),
(9, 9, 'like'),
(10, 10, 'like'),
(11, 11, 'deslike'),
(12, 12, 'like'),
(13, 13, 'like'),
(14, 14, 'like'),
(15, 15, 'deslike'),
(16, 16, 'like'),
(17, 17, 'like'),
(18, 18, 'like'),
(19, 19, 'like'),
(20, 20, 'like');
