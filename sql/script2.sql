CREATE DATABASE junalive;

USE junalive;

CREATE TABLE users(
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  email      VARCHAR(50) NOT NULL UNIQUE,
  password   VARCHAR(50) NOT NULL UNIQUE,
  role       VARCHAR(50) NOT NULL DEFAULT 'GUARD',
  station_code VARCHAR(10) NOT NULL
);



CREATE TABLE shifts(
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    station_code VARCHAR(10) NOT NULL,
    window_start DATETIME NOT NULL,
    window_end   DATETIME NOT NULL,
    created_by   INT NULL
);


CREATE TABLE mandatory_trains(
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    shift_id INT NOT NULL,
    departure_date DATE NOT NULL,
    train_code INT NOT NULL,
    train_line VARCHAR(10) NULL,
    UNIQUE KEY uq_shift_train (shift_id, departure_date, train_code),
    FOREIGN KEY (shift_id) REFERENCES closing_shifts(id) ON DELETE CASCADE
);

