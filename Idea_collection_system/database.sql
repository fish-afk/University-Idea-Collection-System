
-- DATABASE CREATION

CREATE DATABASE IF NOT EXISTS Idea_Collection_System;
USE Idea_Collection_System;

-- TABLES CREATION 


-- ************************************** `idea_categories`

CREATE TABLE IF NOT EXISTS `idea_categories`
(
 `category_id` int AUTO_INCREMENT  NOT NULL ,
 `name`        varchar(255) NOT NULL ,
 `description` text NOT NULL ,

PRIMARY KEY (`category_id`)
);


-- ************************************** `staff_type`

CREATE TABLE IF NOT EXISTS `staff_type`
(
 `type_id`     int AUTO_INCREMENT  NOT NULL ,
 `type`        varchar(255) NOT NULL ,
 `description` varchar(255) NOT NULL ,

PRIMARY KEY (`type_id`)
);

-- ************************************** `departments`

CREATE TABLE IF NOT EXISTS `departments`
(
 `department_id` int AUTO_INCREMENT  NOT NULL ,
 `name`          varchar(255) NOT NULL ,
 `description`   text NOT NULL ,

PRIMARY KEY (`department_id`)
);


-- ************************************** `user_roles`

CREATE TABLE IF NOT EXISTS `user_roles`
(
 `role_id`   int AUTO_INCREMENT  NOT NULL ,
 `role_name` varchar(255) NOT NULL ,

PRIMARY KEY (`role_id`)
);

-- ************************************** `users`

CREATE TABLE IF NOT EXISTS `users`
(
 `username`                  varchar(255) NOT NULL ,
 `firstname`                 varchar(255) NOT NULL ,
 `lastname`                  varchar(255) NOT NULL ,
 `email`                     varchar(255) NOT NULL ,
 `password`                  text NOT NULL ,
 `auth_refresh_token`        text NULL ,
 `account_active`            tinyint NOT NULL DEFAULT 1,
 `registration_timestamp`    datetime NOT NULL ,
 `last_log_in`               datetime NULL,
 `hidden_posts_and_comments` tinyint NOT NULL ,
 `role_id`                   int NULL ,
 `staff_type_id`             int NULL ,
 `department_id`             int NULL ,

PRIMARY KEY (`username`),
KEY `FK_1` (`staff_type_id`),
CONSTRAINT `FK_1` FOREIGN KEY `FK_1` (`staff_type_id`) REFERENCES `staff_type` (`type_id`),
KEY `FK_2` (`department_id`),
CONSTRAINT `FK_8` FOREIGN KEY `FK_2` (`department_id`) REFERENCES `departments` (`department_id`),
KEY `FK_3` (`role_id`),
CONSTRAINT `FK_12_2` FOREIGN KEY `FK_3` (`role_id`) REFERENCES `user_roles` (`role_id`)
);


-- ************************************** `ideas`

CREATE TABLE IF NOT EXISTS `ideas`
(
 `idea_id`                 int AUTO_INCREMENT NOT NULL,
 `idea_title`              text NOT NULL ,
 `idea_body`               text NOT NULL,
 `date_and_time_posted_on` datetime NOT NULL ,
 `category_id`             int NOT NULL ,
 `post_is_anonymous`       tinyint NOT NULL ,
 `username`                varchar(255) NOT NULL ,

PRIMARY KEY (`idea_id`),
KEY `FK_1` (`username`),
CONSTRAINT `FK_3` FOREIGN KEY `FK_1` (`username`) REFERENCES `users` (`username`),
KEY `FK_2` (`category_id`),
CONSTRAINT `FK_9` FOREIGN KEY `FK_2` (`category_id`) REFERENCES `idea_categories` (`category_id`)
);



-- ************************************** `idea_documents`

CREATE TABLE IF NOT EXISTS `idea_documents`
(
 `document_id`  int AUTO_INCREMENT NOT NULL ,
 `filename` text NOT NULL ,
 `idea_id`      int NOT NULL ,

PRIMARY KEY (`document_id`),
KEY `FK_1` (`idea_id`),
CONSTRAINT `FK_6` FOREIGN KEY `FK_1` (`idea_id`) REFERENCES `ideas` (`idea_id`)
);


-- ************************************** `comments`

CREATE TABLE IF NOT EXISTS `comments`
(
 `comment_id`        int AUTO_INCREMENT NOT NULL ,
 `comment`           text NOT NULL ,
 `date_and_time_posted_on` datetime NOT NULL ,
 `post_is_anonymous` tinyint NOT NULL ,
 `idea_id`           int NOT NULL ,
 `username`          varchar(255) NOT NULL ,

PRIMARY KEY (`comment_id`),
KEY `FK_1` (`idea_id`),
CONSTRAINT `FK_2` FOREIGN KEY `FK_1` (`idea_id`) REFERENCES `ideas` (`idea_id`),
KEY `FK_2` (`username`),
CONSTRAINT `FK_12` FOREIGN KEY `FK_2` (`username`) REFERENCES `users` (`username`)
);

-- ************************************** `likes_and_dislikes`

CREATE TABLE IF NOT EXISTS `likes_and_dislikes`
(
 `impression_id`   int AUTO_INCREMENT  NOT NULL ,
 `like_or_dislike` tinyint NOT NULL ,
 `idea_id`         int NOT NULL ,
 `username`        varchar(255) NOT NULL ,

PRIMARY KEY (`impression_id`),
KEY `FK_1` (`idea_id`),
CONSTRAINT `FK_4` FOREIGN KEY `FK_1` (`idea_id`) REFERENCES `ideas` (`idea_id`),
KEY `FK_2` (`username`),
CONSTRAINT `FK_5` FOREIGN KEY `FK_2` (`username`) REFERENCES `users` (`username`)
);


-- ************************************** `reported_posts`

CREATE TABLE IF NOT EXISTS `reported_posts`
(
 `report_id`        int AUTO_INCREMENT  NOT NULL ,
 `report`           text NOT NULL ,
 `report_date_time` datetime NOT NULL ,
 `idea_id`          int NOT NULL ,
 `username`         varchar(255) NOT NULL ,

PRIMARY KEY (`report_id`),
KEY `FK_1` (`idea_id`),
CONSTRAINT `FK_10` FOREIGN KEY `FK_1` (`idea_id`) REFERENCES `ideas` (`idea_id`),
KEY `FK_2` (`username`),
CONSTRAINT `FK_12_1` FOREIGN KEY `FK_2` (`username`) REFERENCES `users` (`username`)
);








