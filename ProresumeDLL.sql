create database proresume;

use proresume;

create table users (
    user_id int auto_increment primary key,
    firstname varchar(30) not null,
    lastname varchar(30) not null,
    email varchar(70) not null,
        password varchar(255),
        role varchar(20) default 'normal',
    registered_date timestamp default NOW()
);


create table resumes (
    resume_id int auto_increment primary key,
    title varchar(200),
    description varchar(10000),
    date timestamp default NOW(),
    user_id int not null,
    constraint fk_resume_user foreign key (user_id) references users(user_id)
                     on update cascade
                     on delete cascade
);

create table experiences(
    experience_id int auto_increment primary key,
    title varchar(200),
    description varchar(10000) not null,
    start_date date,
    end_date date,
    resume_id int not null,
    constraint fk_exp_resume foreign key (resume_id) references resumes(resume_id)
                        on update cascade
                        on delete cascade
);


create table educations(
    education_id int auto_increment primary key,
    title varchar(200),
    description varchar(10000) not null,
     start_date date,
    end_date date,
    resume_id int not null,
    constraint fk_edu_resume foreign key (resume_id) references resumes(resume_id)
                       on update cascade
                       on delete cascade
);

create table skills(
    skill_id int auto_increment primary key,
    title varchar(200),
    level text not null,
    resume_id int not null,
    constraint fk_skill_resume foreign key (resume_id) references resumes(resume_id)
                   on update cascade
                   on delete cascade
);

-- drop table resumes;
-- drop table users;
-- drop table experiences;
-- drop table educations;
-- drop table skills;
