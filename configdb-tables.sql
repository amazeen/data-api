CREATE TABLE areas (
  id character varying(16) PRIMARY KEY
);

CREATE TABLE silos (
  id      character varying(16) PRIMARY KEY,
  area_id character varying(16) REFERENCES areas(id) NOT NULL
);

CREATE TABLE parameter_types (
  type character varying(32) PRIMARY KEY
);

CREATE TABLE thresholds (
  id             serial PRIMARY KEY,
  maximum        decimal NOT NULL,
  minimum        decimal NOT NULL,
  type           character varying(32) REFERENCES parameter_types(type) NOT NULL,
  silo_id        character varying(16) REFERENCES silos(id) NOT NULL
);
