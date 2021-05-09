INSERT INTO areas (id) VALUES
('1'),
('2');

INSERT INTO parameter_types (type) VALUES
('capacity'   ),
('temperature'),
('humidity'   ),
('pressure'   );

INSERT INTO silos (id, area_id) VALUES
('1', '1'),
('2', '1'),
('3', '1'),
('4', '1'),
('5', '2'),
('6', '2'),
('7', '2');

INSERT INTO thresholds (maximum, minimum, type, silo_id) VALUES
(70,   20,   'temperature', '1'),
(100,  0,    'capacity',    '1'),
(1200, 1050, 'pressure',    '1'),
(80,   40,   'humidity',    '1');
