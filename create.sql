drop database company;
create database company;
use company;

create table staff(
    account char(40) primary key,
    password char(40) not null ,
    sort char(10),
    userName char(40)
);

create table task(
    id int primary key auto_increment,
    sort char(40) not null ,
    project int not null, #项目流水
    done int not null #是否被做
);
create table sequence(
    thisTask int not null ,
    nextTask int
);

create table admin(
    account char(40) primary key ,
    password char(40) not null,
    userName char(40)
);

create table perform(
    account char(40) not null ,
    id int not null ,
    executor char(40) not null ,
    deadline long ,
    transfer int not null
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
    theKind int
);

create table projectName(
    name char(100),
    project int not null
);

create table superAdmin(
    account char(40) not null,
    password char(40) not null,
    userName char(40)
);

create table charge(
    account char(40) not null ,
    project int not null
);


insert into staff values ('1','111111','A','大娃');
insert into staff values ('2','111111','A','二娃');
insert into staff values ('3','111111','B','三娃');
insert into staff values ('4','111111','B','四娃');
insert into staff values ('5','111111','C','五娃');
insert into staff values ('6','111111','C','六娃');

insert into admin values ('admin','111111','老逼登');
insert into admin values ('sxc','111111','孙狗');

insert into superAdmin values ('super','111111','波多野结衣');

insert into task values (null,'A',1,0);
insert into perform values ('1',1,'1',null,0);
insert into task values (null,'B',1,0);
insert into perform values ('3',2,'3',null,0);
insert into task values (null,'A',1,0);
insert into perform values ('2',3,'2',null,0);
insert into task values (null,'A',1,0);
insert into perform values ('2',4,'2',null,0);
insert into task values (null,'C',1,0);
insert into perform values ('5',5,'5',null,0);
insert into task values (null,'C',1,0);
insert into perform values ('6',6,'6',null,0);
insert into task values (null,'A',1,0);
insert into perform values ('1',7,'1',null,0);
insert into task values (null,'A',1,0);
insert into perform values ('1',8,'1',null,0);
insert into task values (null,'A',1,0);
insert into perform values ('2',9,'2',null,0);

insert into task values (null,'B',2,0);
insert into perform values ('3',10,'3',null,0);
insert into task values (null,'B',2,0);
insert into perform values ('4',11,'4',null,0);
insert into task values (null,'B',2,0);
insert into perform values ('4',12,'4',null,0);
insert into task values (null,'C',2,0);
insert into perform values ('6',13,'6',null,0);
insert into task values (null,'C',2,0);
insert into perform values ('5',14,'5',null,0);
insert into task values (null,'B',2,0);
insert into perform values ('3',15,'3',null,0);
insert into task values (null,'B',2,0);
insert into perform values ('4',16,'4',null,0);
insert into task values (null,'B',2,0);
insert into perform values ('4',17,'4',null,0);
insert into task values (null,'C',2,0);
insert into perform values ('5',18,'5',null,0);
insert into task values (null,'A',2,0);
insert into perform values ('1',19,'1',null,0);
insert into task values (null,'A',2,0);
insert into perform values ('2',20,'2',null,0);
insert into task values (null,'A',2,0);
insert into perform values ('1',21,'1',null,0);
insert into task values (null,'A',2,0);
insert into perform values ('1',22,'1',null,0);
insert into task values (null,'B',2,0);
insert into perform values ('4',23,'4',null,0);
insert into task values (null,'A',2,0);
insert into perform values ('2',24,'2',null,0);
insert into task values (null,'C',2,0);
insert into perform values ('5',25,'5',null,0);

insert into task values (null,'A',3,0);
insert into perform values ('2',26,'2',null,0);
insert into task values (null,'B',3,0);
insert into perform values ('3',27,'4',1603721061428,1);
insert into task values (null,'C',3,0);
insert into perform values ('6',28,'5',1603731061428,1);
insert into task values (null,'B',3,0);
insert into perform values ('4',29,'4',null,0);
insert into task values (null,'A',3,0);
insert into perform values ('1',30,'1',null,0);
insert into task values (null,'A',3,0);
insert into perform values ('2',31,'2',null,0);
insert into task values (null,'C',3,0);
insert into perform values ('5',32,'5',null,0);
insert into task values (null,'C',3,0);
insert into perform values ('6',33,'6',null,0);
insert into task values (null,'C',3,0);
insert into perform values ('5',34,'5',null,0);
insert into task values (null,'C',3,0);
insert into perform values ('6',35,'6',null,0);
insert into task values (null,'B',3,0);
insert into perform values ('4',36,'4',null,0);
insert into task values (null,'B',3,0);
insert into perform values ('4',37,'4',null,0);
insert into task values (null,'B',3,0);
insert into perform values ('3',38,'3',null,0);
insert into task values (null,'B',3,0);
insert into perform values ('3',39,'3',null,0);

insert into projectname values ('zjn',1);
insert into projectname values ('lw',2);
insert into projectname values ('lmx',3);

insert into participate values ('1',1,0);
insert into participate values ('2',1,0);
insert into participate values ('3',1,0);
insert into participate values ('5',1,0);
insert into participate values ('6',1,0);
insert into participate values ('1',2,0);
insert into participate values ('2',2,0);
insert into participate values ('3',2,0);
insert into participate values ('4',2,0);
insert into participate values ('5',2,0);
insert into participate values ('6',2,0);
insert into participate values ('1',3,0);
insert into participate values ('2',3,0);
insert into participate values ('3',3,0);
insert into participate values ('4',3,0);
insert into participate values ('5',3,0);
insert into participate values ('6',3,0);

insert into sequence values (1,2);
insert into sequence values (1,3);
insert into sequence values (2,3);
insert into sequence values (2,4);
insert into sequence values (3,null);
insert into sequence values (4,5);
insert into sequence values (5,6);
insert into sequence values (6,7);
insert into sequence values (7,8);
insert into sequence values (8,9);
insert into sequence values (9,null);

insert into sequence values(10,11);
insert into sequence values(10,13);
insert into sequence values(10,12);
insert into sequence values(14,11);
insert into sequence values(12,15);
insert into sequence values(13,null);
insert into sequence values(14,17);
insert into sequence values(11,16);
insert into sequence values(15,16);
insert into sequence values(15,20);
insert into sequence values(16,17);
insert into sequence values(17,18);
insert into sequence values(18,19);
insert into sequence values(19,20);
insert into sequence values(18,22);
insert into sequence values(19,21);
insert into sequence values(20,23);
insert into sequence values(23,21);
insert into sequence values(21,24);
insert into sequence values(22,24);
insert into sequence values(24,25);
insert into sequence values(25,null);

insert into sequence values(26,29);
insert into sequence values(27,30);
insert into sequence values(28,31);
insert into sequence values(29,20);
insert into sequence values(31,32);
insert into sequence values(30,32);
insert into sequence values(32,33);
insert into sequence values(33,34);
insert into sequence values(33,35);
insert into sequence values(33,36);
insert into sequence values(34,37);
insert into sequence values(35,37);
insert into sequence values(36,37);
insert into sequence values(37,38);
insert into sequence values(38,39);
insert into sequence values(39,null);

insert into charge values ('admin',1);
insert into charge values ('admin',3);
insert into charge values ('sxc',2);


