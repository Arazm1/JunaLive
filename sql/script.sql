CREATE DATABASE junalive;

USE junalive;


-- Unsure currently if the last line is required.
CREATE TABLE closing_trains
(
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  station_code VARCHAR(10) NOT NULL,
  date DATE NOT NULL,
  train_code INT NOT NULL,
  train_line VARCHAR(10) NULL,
  UNIQUE KEY uq_closing (station_code, date, train_code)
);


CREATE TABLE users(
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL
);