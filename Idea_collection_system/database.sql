
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
CONSTRAINT `FK_1` FOREIGN KEY `FK_1` (`staff_type_id`) REFERENCES `staff_type` (`type_id`) ON UPDATE CASCADE ON DELETE SET NULL,
KEY `FK_2` (`department_id`),
CONSTRAINT `FK_8` FOREIGN KEY `FK_2` (`department_id`) REFERENCES `departments` (`department_id`) ON UPDATE CASCADE ON DELETE SET NULL,
KEY `FK_3` (`role_id`),
CONSTRAINT `FK_12_2` FOREIGN KEY `FK_3` (`role_id`) REFERENCES `user_roles` (`role_id`) ON UPDATE CASCADE ON DELETE SET NULL
);


-- ************************************** `ideas`

CREATE TABLE IF NOT EXISTS `ideas`
(
 `idea_id`                 int AUTO_INCREMENT NOT NULL,
 `idea_title`              text NOT NULL ,
 `idea_body`               text NOT NULL,
 `date_and_time_posted_on` datetime NOT NULL ,
 `category_id`             int NULL ,
 `post_is_anonymous`       tinyint NOT NULL ,
 `username`                varchar(255) NULL ,

PRIMARY KEY (`idea_id`),
KEY `FK_1` (`username`),
CONSTRAINT `FK_3` FOREIGN KEY `FK_1` (`username`) REFERENCES `users` (`username`) ON UPDATE CASCADE ON DELETE SET NULL,
KEY `FK_2` (`category_id`),
CONSTRAINT `FK_9` FOREIGN KEY `FK_2` (`category_id`) REFERENCES `idea_categories` (`category_id`) ON UPDATE CASCADE ON DELETE SET NULL
);



-- ************************************** `idea_documents`

CREATE TABLE IF NOT EXISTS `idea_documents`
(
 `document_id`  int AUTO_INCREMENT NOT NULL ,
 `filename` text NOT NULL ,
 `idea_id`      int NULL ,

PRIMARY KEY (`document_id`),
KEY `FK_1` (`idea_id`),
CONSTRAINT `FK_6` FOREIGN KEY `FK_1` (`idea_id`) REFERENCES `ideas` (`idea_id`) ON UPDATE CASCADE ON DELETE SET NULL
);


-- ************************************** `comments`

CREATE TABLE IF NOT EXISTS `comments`
(
 `comment_id`        int AUTO_INCREMENT NOT NULL ,
 `comment`           text NOT NULL ,
 `date_and_time_posted_on` datetime NOT NULL ,
 `post_is_anonymous` tinyint NOT NULL ,
 `idea_id`           int NULL ,
 `username`          varchar(255) NULL ,

PRIMARY KEY (`comment_id`),
KEY `FK_1` (`idea_id`),
CONSTRAINT `FK_2` FOREIGN KEY `FK_1` (`idea_id`) REFERENCES `ideas` (`idea_id`) ON UPDATE CASCADE ON DELETE SET NULL,
KEY `FK_2` (`username`),
CONSTRAINT `FK_12` FOREIGN KEY `FK_2` (`username`) REFERENCES `users` (`username`) ON UPDATE CASCADE ON DELETE SET NULL
);

-- ************************************** `likes_and_dislikes`

CREATE TABLE IF NOT EXISTS `likes_and_dislikes`
(
 `impression_id`   int AUTO_INCREMENT  NOT NULL ,
 `like_or_dislike` tinyint NOT NULL ,
 `idea_id`         int NULL ,
 `username`        varchar(255) NULL ,

PRIMARY KEY (`impression_id`),
KEY `FK_1` (`idea_id`),
CONSTRAINT `FK_4` FOREIGN KEY `FK_1` (`idea_id`) REFERENCES `ideas` (`idea_id`) ON UPDATE CASCADE ON DELETE SET NULL,
KEY `FK_2` (`username`),
CONSTRAINT `FK_5` FOREIGN KEY `FK_2` (`username`) REFERENCES `users` (`username`) ON UPDATE CASCADE ON DELETE SET NULL
);


-- ************************************** `reported_posts`

CREATE TABLE IF NOT EXISTS `reported_posts`
(
 `report_id`        int AUTO_INCREMENT  NOT NULL ,
 `report`           text NOT NULL ,
 `report_date_time` datetime NOT NULL ,
 `idea_id`          int NULL ,
 `username`         varchar(255) NULL ,

PRIMARY KEY (`report_id`),
KEY `FK_1` (`idea_id`),
CONSTRAINT `FK_10` FOREIGN KEY `FK_1` (`idea_id`) REFERENCES `ideas` (`idea_id`) ON UPDATE CASCADE ON DELETE SET NULL,
KEY `FK_2` (`username`),
CONSTRAINT `FK_12_1` FOREIGN KEY `FK_2` (`username`) REFERENCES `users` (`username`) ON UPDATE CASCADE ON DELETE SET NULL
);


-- -----------------------------------------------------------------------------------------------------




-- important default config inserts and some dummy data ------------------------------------------------

-- staff types

INSERT INTO staff_type (type, description) VALUES ('academic', 'academic staff type');
INSERT INTO staff_type (type, description) VALUES ('support', 'support staff type');

-- departments

INSERT INTO departments (name, description) VALUES ('Department of business', "Offers programs in business administration and management education, preparing students for various professional roles in the business world.");
INSERT INTO departments (name, description) VALUES ('Department of social science and technology', " Explores the intersection of society and technology, examining the impact of technological advancements on social structures and behaviors.");
INSERT INTO departments (name, description) VALUES ('Department of computing', "Focuses on computer science and related fields, providing education in programming, algorithms, and computer technology.");
INSERT INTO departments (name, description) VALUES ('Department of business', "Offers business administration and management education, preparing students for various professional roles in the business world.");

-- roles

INSERT INTO user_roles (role_name) VALUES ("staff");
INSERT INTO user_roles (role_name) VALUES ("qa_coordinator");
INSERT INTO user_roles (role_name) VALUES ("qa_manager");
INSERT INTO user_roles (role_name) VALUES ("admin");

-- idea categories

INSERT INTO idea_categories (name, description) VALUES ("Financial", "Financial ideas");
INSERT INTO idea_categories (name, description) VALUES ("Institutional", "Institutional ideas");
INSERT INTO idea_categories (name, description) VALUES ("Departmental", "Departmental ideas");
INSERT INTO idea_categories (name, description) VALUES ("Personal", "Personal ideas");

-- dummy users

INSERT INTO `users` (`username`, `firstname`, `lastname`, `email`, `password`, `auth_refresh_token`, `account_active`, `registration_timestamp`, `last_log_in`, `hidden_posts_and_comments`, `role_id`, `staff_type_id`, `department_id`) VALUES
	('coordinator_1', 'coordinator 1', 'coordinator 1', 'coordinator_1234444444@test.com', '$2b$10$L4imquUW5gD6/zzJfk9JNu.BGeiHJI7DZSlZqeMgP2ILVXksogGKO', '', 1, '2023-11-09 10:36:33', NULL, 0, 2, NULL, 1),
	('coordinator_2', 'coordinator 2', 'coordinator 2', 'coordinator_1234444444@test.com', '$2b$10$26ofT4jWAbtVh/72kdjgI.B2uLivebDjAOmlR7eXYfcjD9XLvYkI2', '', 1, '2023-11-09 10:37:02', NULL, 0, 2, NULL, 2),
	('coordinator_3', 'coordinator 3', 'coordinator 3', 'coordinator_1234444444@test.com', '$2b$10$14q78taM393c9eDlCs.fYO1we9CjDpBfIfkAQLEczSkrWiOYQua6.', '', 1, '2023-11-09 10:37:15', NULL, 0, 2, NULL, 3),
	('coordinator_4', 'coordinator 4', 'coordinator 4', 'coordinator_1234444444@test.com', '$2b$10$/vO3sQ9aQeiDnnXknNgJKOEtIn3R3xDYYUwFlyo64kQAwtu1cPpg.', '', 1, '2023-11-09 10:37:26', NULL, 0, 2, NULL, 4),
	('slide2', 'SHIHAB', 'MIRZA', 'mirzashihab2@outlook.com', '$2b$10$Zfs7WdQOgAzj.iraYNHmLeRF9paMrR/aBm/psMA2mVfj4sb13I8Z.', '', 1, '2023-11-09 09:00:20', '2023-11-09 09:01:39', 0, 1, 1, 1),
	('slide3', 'SHIHAB', 'MIRZA', 'mirzashihab2@outlook.com', '$2b$10$aOee7jGFmASesM9EcV/QzuvJfwfzlqgboHwmYBnHCPZZcl195Jrqi', '', 1, '2023-11-09 09:18:00', '2023-11-09 09:59:56', 0, 3, NULL, NULL),
	('staff_1', 'staff 1', 'staff 1', 'staff_1234444444@test.com', '$2b$10$ZdmVgPY4fkXuvfYVC0ptGelWkBBb//fFAUJwzwNHK/fa6Zfwv3n46', NULL, 1, '2023-11-09 10:41:17', NULL, 0, 1, 1, 1),
	('staff_2', 'staff 2', 'staff 2', 'staff_1234444444@test.com', '$2b$10$TIWJJ1Y6HHDG.fLUSSeh4.uZiaMtcXdgCHtYXANBZlhhh5Lked7Ou', NULL, 1, '2023-11-09 10:41:39', NULL, 0, 1, 2, 1),
	('staff_3', 'staff 3', 'staff 3', 'staff_1234444444@test.com', '$2b$10$H6p/2AtWRWndaRa5htXJSOBRQGnuKzIO96w/BRGJ95IhCJNpzVmmG', NULL, 1, '2023-11-09 10:41:52', NULL, 0, 1, 1, 2),
	('staff_4', 'staff 3', 'staff 3', 'staff_1234444444@test.com', '$2b$10$B9DQppTm2SFBgyDIYU4db.bTJnmJJe7koYb6JJWBY151Gb2hMdDuq', NULL, 1, '2023-11-09 10:42:00', NULL, 0, 1, 2, 2),
	('staff_5', 'staff 3', 'staff 3', 'staff_1234444444@test.com', '$2b$10$YJf7Alr9iU5.GRtsGrY21OLDzvsboSdH1Rei.o/4fll01cklRixEW', NULL, 1, '2023-11-09 10:42:10', NULL, 0, 1, 1, 3),
	('staff_6', 'staff 3', 'staff 3', 'staff_1234444444@test.com', '$2b$10$bk3FL3MwDm7IVaEa2KWd1./hXxenPy/nifZ35wcfK0NEJKbc/RHua', NULL, 1, '2023-11-09 10:42:19', NULL, 0, 1, 2, 3),
	('staff_7', 'staff 3', 'staff 3', 'staff_1234444444@test.com', '$2b$10$qg3q7nMAKSM1PbeU6ox16.kHC5bBBOgJjwxOu9pmBa02W8kboQxwu', NULL, 1, '2023-11-09 10:42:31', NULL, 0, 1, 1, 4),
	('staff_8', 'staff 3', 'staff 3', 'staff_1234444444@test.com', '$2b$10$foRorwesD9/1YksJWqj9MeGrS0FW1TFncMDedZmnIMDS5pmhfYTbK', NULL, 1, '2023-11-09 10:42:37', NULL, 0, 1, 2, 4);


-- dummy ideas

INSERT INTO `ideas` (`idea_id`, `idea_title`, `idea_body`, `date_and_time_posted_on`, `category_id`, `post_is_anonymous`, `username`) VALUES
	(1, 'sadasd', 'sadasdasdads', '2023-11-09 10:45:20', 2, 1, 'slide2'),
	(2, 'Test Idea', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic molestiae, voluptates repudiandae consequuntur animi iusto nemo maxime corrupti tenetur illum reprehenderit officiis illo aspernatur blanditiis, modi tempora commodi vel unde.       Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic molestiae, voluptates repudiandae consequuntur animi iusto nemo maxime corrupti tenetur illum reprehenderit officiis illo aspernatur blanditiis, modi tempora commodi vel unde.       Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic molestiae, voluptates repudiandae consequuntur animi iusto nemo maxime corrupti tenetur illum reprehenderit officiis illo aspernatur blanditiis, modi tempora commodi vel unde.', '2023-11-09 10:46:46', 1, 0, 'slide2'),
	(3, 'We should upgrade the IT infrastructure in ZCAS', 'We should upgrade the IT infrastructure in ZCASWe should upgrade the IT infrastructure in ZCAS We should upgrade the IT infrastructure in ZCASWe should upgrade the IT infrastructure in ZCASWe should upgrade the IT infrastructure in ZCAS We should upgrade the IT infrastructure in ZCASWe should upgrade the IT infrastructure in ZCASWe should upgrade the IT infrastructure in ZCASWe should upgrade the IT infrastructure in ZCAS', '2023-11-09 10:47:58', 1, 1, 'staff_1'),
	(4, 'We should paint the walls in the building to make it more attractive', 'We should paint the walls in the building to make it more attractiveWe should paint the walls in the building to make it more attractiveWe should paint the walls in the building to make it more attractiveWe should paint the walls in the building to make it more attractiveWe should paint the walls in the building to make it more attractiveWe should paint the walls in the building to make it more attractiveWe should paint the walls in the building to make it more attractiveWe should paint the walls in the building to make it more attractiveWe should paint the walls in the building to make it more attractive', '2023-11-09 10:48:26', 1, 0, 'staff_1'),
	(5, 'We should paint the walls in the building to make it more attractive', 'We should paint the walls in the building to make it more attractiveWe should paint the walls in the building to make it more attractiveWe should paint the walls in the building to make it more attractiveWe should paint the walls in the building to make it more attractiveWe should paint the walls in the building to make it more attractiveWe should paint the walls in the building to make it more attractiveWe should paint the walls in the building to make it more attractiveWe should paint the walls in the building to make it more attractiveWe should paint the walls in the building to make it more attractive', '2023-11-09 10:48:32', 3, 0, 'staff_1'),
	(6, 'I have an idea of how i can be more pucntual', 'I have an idea of how i can be more pucntualI have an idea of how i can be more pucntualI have an idea of how i can be more pucntualI have an idea of how i can be more pucntualI have an idea of how i can be more pucntualI have an idea of how i can be more pucntualI have an idea of how i can be more pucntualI have an idea of how i can be more pucntualI have an idea of how i can be more pucntual', '2023-11-09 10:49:26', 4, 0, 'staff_3'),
	(7, 'This instituition needs to work on morals so that people can be more prodcutive', 'This instituition needs to work on morals so that people can be more prodcutiveThis instituition needs to work on morals so that people can be more prodcutiveThis instituition needs to work on morals so that people can be more prodcutiveThis instituition needs to work on morals so that people can be more prodcutiveThis instituition needs to work on morals so that people can be more prodcutiveThis instituition needs to work on morals so that people can be more prodcutive', '2023-11-09 10:50:36', 2, 1, 'staff_5'),
	(8, 'This instituition needs to work on morals so that people can be more prodcutive', 'This instituition needs to work on morals so that people can be more prodcutiveThis instituition needs to work on morals so that people can be more prodcutiveThis instituition needs to work on morals so that people can be more prodcutiveThis instituition needs to work on morals so that people can be more prodcutiveThis instituition needs to work on morals so that people can be more prodcutiveThis instituition needs to work on morals so that people can be more prodcutive', '2023-11-09 10:50:49', 2, 0, 'staff_5'),
	(9, 'Just testing the new idea system', 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste aliquam optio harum laborum aut, alias ipsa, iure tempora eveniet omnis delectus ex voluptatem nam voluptas nemo debitis quibusdam asperiores quae.', '2023-11-09 10:52:02', 4, 0, 'staff_7'),
	(10, 'Just testing the new idea system (anonymous posting)', 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste aliquam optio harum laborum aut, alias ipsa, iure tempora eveniet omnis delectus ex voluptatem nam voluptas nemo debitis quibusdam asperiores quae.', '2023-11-09 10:52:16', 4, 1, 'staff_7');

-- dummy comments

INSERT INTO `comments` (`comment_id`, `comment`, `date_and_time_posted_on`, `post_is_anonymous`, `idea_id`, `username`) VALUES
	(3, 'Your idea is impressive and shows a deep understanding of the subject matter. I\'m looking forward to seeing more of your work. Keep it up!', '2023-11-09 11:12:30', 0, 5, 'staff_3'),
	(4, 'I find your idea truly fascinating and believe it has the potential to make a significant impact. Your dedication to innovation is commendable. Keep up the good work!', '2023-11-09 12:45:22', 1, 8, 'staff_4'),
	(5, 'Your idea is not only creative but also very practical. It\'s clear that you\'ve put a lot of thought into this. Well done!', '2023-11-09 13:22:18', 0, 3, 'staff_6'),
	(6, 'I\'m thoroughly impressed by your idea. The level of detail and originality is outstanding. I can\'t wait to see more from you!', '2023-11-09 14:07:59', 1, 10, 'staff_2'),
	(7, 'Your work is nothing short of impressive. The effort and dedication you\'ve put into your idea are evident. Keep up the great work!', '2023-11-09 15:30:45', 0, 7, 'staff_5'),
	(8, 'I find your idea to be a breath of fresh air. It\'s unique and shows your deep understanding of the subject. I look forward to more from you!', '2023-11-09 16:12:55', 1, 4, 'staff_7'),
	(11, 'Your idea is outstanding and very innovative. I\'m looking forward to more of your contributions. Keep it up!', '2023-11-09 19:15:27', 0, 9, 'staff_4'),
	(12, 'Well done! Your idea showcases your creativity and passion for the topic. I appreciate your hard work.', '2023-11-09 20:03:45', 1, 5, 'staff_2'),
	(13, 'I find your idea fascinating. It has the potential to make a significant impact. Keep up the good work!', '2023-11-09 21:28:14', 0, 3, 'staff_1'),
	(14, 'I\'m genuinely impressed by your idea. The level of detail and originality is outstanding. I can\'t wait to see more from you!', '2023-11-09 22:17:30', 1, 7, 'staff_8'),
	(16, 'Your work is impressive and reflects your creative thinking. I can see a bright future ahead for your idea. Well done!', '2023-11-09 23:52:55', 1, 8, 'staff_3'),
	(17, 'I\'m thoroughly impressed by your idea. It\'s a great example of creativity and originality. Keep up the excellent work!', '2023-11-10 00:41:10', 0, 4, 'staff_7'),
	(19, 'Your idea is a breath of fresh air. It\'s unique and shows your deep understanding of the subject. I\'m excited to see what comes next!', '2023-11-10 01:29:25', 1, 10, 'staff_8');


-- dummy likes and dislikes

INSERT INTO `likes_and_dislikes` (`impression_id`, `like_or_dislike`, `idea_id`, `username`) VALUES
	(1, 1, 1, 'slide2'),
	(2, 1, 9, 'slide2'),
	(3, 0, 3, 'slide2'),
	(4, 0, 5, 'slide2'),
	(5, 1, 10, 'slide2'),
	(6, 1, 7, 'slide2'),
	(8, 0, 8, 'slide2'),
	(9, 1, 2, 'slide2'),
	(10, 1, 4, 'slide2'),
	(11, 1, 1, 'staff_1'),
	(12, 1, 2, 'staff_2'),
	(13, 1, 3, 'staff_3'),
	(14, 1, 4, 'staff_4'),
	(15, 1, 5, 'staff_5'),
	(16, 1, 6, 'staff_6'),
	(17, 1, 7, 'staff_7'),
	(18, 1, 8, 'staff_8'),
	(19, 0, 9, 'staff_1'),
	(20, 0, 10, 'staff_2'),
	(21, 0, 1, 'staff_3'),
	(22, 0, 2, 'staff_4'),
	(23, 0, 3, 'staff_5'),
	(24, 0, 4, 'staff_6'),
	(25, 0, 5, 'staff_7'),
	(26, 0, 6, 'staff_8'),
	(27, 1, 7, 'staff_1'),
	(28, 1, 8, 'staff_2'),
	(29, 1, 9, 'staff_3'),
	(30, 1, 10, 'staff_4'),
	(31, 1, 1, 'staff_5'),
	(32, 1, 2, 'staff_6'),
	(33, 1, 3, 'staff_7'),
	(34, 1, 4, 'staff_8');


