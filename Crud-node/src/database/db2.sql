--creando la base de datos

CREATE DATABASE Clientes;

--usando la base da datos
use Clientes;

--creando la tabla

CREATE TABLE admin{
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(70) NOT NULL,
    apellidos VARCHAR(70) NOT NULL,
    Nombre_usuario VARCHAR(20) NOT NULL,
    contraseña VARCHAR(500) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    
};

--para mostrar las tablas 
SHOW TABLES;

--para describir las  tablas 

describe admin;