CREATE DATABASE IF NOT EXISTS UnattendedDisplay;

create table UnattendedDisplay.messagesSettings (
  id int primary key,
  city varchar(281) not null,
  building int not null,
  buildingInfo BOOLEAN not null,
  mainInfo BOOLEAN not null
);
create table UnattendedDisplay.messages (
  uniqueID int auto_increment primary key,
  id int not null,
  message varchar(281) not null
);
create table UnattendedDisplay.buildings (
  uniqueID int auto_increment primary key,
  building varchar(281) not null
);
create table UnattendedDisplay.buildingMessages (
  uniqueID int auto_increment primary key,
  id int not null,
  message varchar(281) not null
);
