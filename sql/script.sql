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




29.10.2026	P	8765	1.51.00	HKI
29.10.2026	P	8735	22.01.00	HKI
29.10.2026	K	9348	22.06.00	HKI
29.10.2026	I	8936	22.08.00	HKI
29.10.2026	I	8937	22.18.00	HKI
29.10.2026	U	8502	22.19.00	HKI
29.10.2026	P	8739	22.31.00	HKI
29.10.2026	E	8372	22.35.00	HKI
29.10.2026	I	8940	22.38.00	HKI
29.10.2026	P	8740	22.41.00	HKI
29.10.2026	U	8504	22.49.00	HKI
29.10.2026	K	9366	23.03.00	HKI


INSERT INTO closing_trains
    (station_code, date, train_code, train_line, arrival_time)
VALUES
    ('HKI', '2026-10-29', 8765, 'P', '01:51:00'),
    ('HKI', '2026-10-29', 8735, 'P', '22:01:00'),
    ('HKI', '2026-10-29', 9348, 'K', '22:06:00'),
    ('HKI', '2026-10-29', 8936, 'I', '22:08:00'),
    ('HKI', '2026-10-29', 8937, 'I', '22:18:00'),
    ('HKI', '2026-10-29', 8502, 'U', '22:19:00'),
    ('HKI', '2026-10-29', 8739, 'P', '22:31:00'),
    ('HKI', '2026-10-29', 8372, 'E', '22:35:00'),
    ('HKI', '2026-10-29', 8940, 'I', '22:38:00'),
    ('HKI', '2026-10-29', 8740, 'P', '22:41:00'),
    ('HKI', '2026-10-29', 8504, 'U', '22:49:00'),
    ('HKI', '2026-10-29', 9366, 'K', '23:03:00');