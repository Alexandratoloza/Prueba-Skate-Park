DROP TABLE IF EXISTS skaters;


CREATE TABLE skaters (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL, 
    anos_experiencia INT NOT NULL,
    especialidad VARCHAR(50) NOT NULL,
    foto VARCHAR(255) NOT NULL, 
    estado BOOLEAN NOT NULL DEFAULT TRUE 
);


SELECT * FROM skaters

INSERT INTO skaters ( email, name, password, anos_experiencia, especialidad, foto, estado)
VALUES
    ('maria.lopez@example.com', 'Maria Lopez', 'password123', 5, 'Street', 'foto1.jpg', TRUE),
    ('juan.perez@example.com', 'Juan Perez', 'securepass456', 10, 'Vert', 'foto2.jpg', TRUE),
    ('ana.gomez@example.com', 'Ana Gomez', 'mypassword789', 3, 'Freestyle', 'foto3.jpg', FALSE);