drop database company;
create database company;
use company;

create table staff(
    account char(40) primary key,
    password char(40) not null ,
    sort char(10)
);

create table task(
    id int primary key auto_increment,
    sort char(40) not null ,
    orderid int not null ,
    project int not null, #项目流水
    done int not null #是否被做
);

create table admin(
    account char(40) primary key ,
    password char(40) not null
);

create table perform(
    account char(40) not null ,
    id int not null ,
    executor char(40) not null ,
    deadline timestamp,
    transfer int not null,
    constraint FK_account foreign key (account) references staff (account),
    constraint FK_id foreign key (id) references task(id),
    constraint FK_executor foreign key (account) references staff(account)
);

create table participate(
    account char(40) not null,
    project int not null,
    done int not null
);

create table messageBox(
    msg char(180),
    receiver char(40) not null,
    theSender char(40),
    theKind char(40)
);

create table projectName(
    name char(100),
    project int not null
);
