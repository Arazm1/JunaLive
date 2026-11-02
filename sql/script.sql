CREATE DATABASE junalive;

USE junalive;


-- Unsure currently if the last line is required.
CREATE TABLE closing_trains
(
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  station_code VARCHAR(10) NOT NULL,
  date DATE NOT NULL,
  arrival_time TIME NOT NULL,
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




-- Test
INSERT INTO closing_trains (station_code, date, train_code, train_line, arrival_time) VALUES
('HKI', '2026-10-31', 8735, 'P', '22:01:00'),
('HKI', '2026-10-31', 9348, 'K', '22:06:00'),
('HKI', '2026-10-31', 8737, 'P', '22:21:00'),
('HKI', '2026-10-31', 8936, 'I', '22:38:00'),
('HKI', '2026-10-31', 8504, 'U', '23:03:00'),
('HKI', '2026-11-01', 8765, 'P', '01:51:00'),
('PSL', '2026-10-31', 8739, 'P', '22:45:00'),
('PSL', '2026-11-01', 8741, 'K', '00:30:00');