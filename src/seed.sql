CREATE TABLE
    IF NOT EXISTS Product (
        id binary(16) PRIMARY KEY NOT NULL,
        slug varchar(10) UNIQUE NOT NULL,
        name varchar(25) NOT NULL,
        description text,
        stock int NOT NULL
    );