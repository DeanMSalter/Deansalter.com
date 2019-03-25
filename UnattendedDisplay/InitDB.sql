DROP DATABASE UnattendedDisplay;

CREATE DATABASE IF NOT EXISTS UnattendedDisplay;

create table UnattendedDisplay.messagesSettings (
  id int primary key,
  city varchar(281) not null,
  building varchar(281) not null,
  gameInfo BOOLEAN not null,
  buildingInfo BOOLEAN not null,
  mainInfo BOOLEAN not null
	
)
