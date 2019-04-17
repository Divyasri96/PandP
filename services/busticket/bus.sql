-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2018 at 04:24 AM
-- Server version: 10.1.30-MariaDB
-- PHP Version: 5.6.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bus`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `cat_id` int(3) NOT NULL,
  `cat_title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`cat_id`, `cat_title`) VALUES
(3, 'Daily Buses'),
(4, 'Weekly Buses'),
(5, 'Night Buses');

-- --------------------------------------------------------

--
-- Table structure for table `cost`
--

CREATE TABLE `cost` (
  `start` varchar(255) NOT NULL,
  `stopage` varchar(255) NOT NULL,
  `category` int(3) NOT NULL,
  `cost` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cost`
--

INSERT INTO `cost` (`start`, `stopage`, `category`, `cost`) VALUES
('Fairview', 'Conestoga College - Door 3', 5, 3.25),
('Conestoga College - Rec Center', 'Fairview', 5, 3.25);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(3) NOT NULL,
  `bus_id` int(3) NOT NULL,
  `user_id` int(3) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_age` int(3) NOT NULL,
  `source` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `cost` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `bus_id`, `user_id`, `user_name`, `user_age`, `source`, `destination`, `date`, `cost`) VALUES
(5, 2, 2, 'Malhan', 20, 'Fairview', 'Conestoga College - Door 3', '2018-04-23', 0),
(6, 2, 2, 'Riyanka', 52, 'Fairview', 'Conestoga College - Door 3', '2018-03-29', 0),
(7, 2, 2, 'Divya', 10, 'Fairview', 'Conestoga College - Door 3', '2018-04-14', 0),
(10, 2, 2, 'Ankita', 10, 'Cambridge Center Station', 'Fairview', '2018-04-14', 0),
(11, 4, 3, 'Fahim', 52, 'Cambridge Center Station', 'Fairview', '2018-04-17', 0),
(14, 4, 3, 'MD', 45, 'Cambridge Center Station', 'Conestoga College - Door 3', '2018-04-17', 0),
(15, 6, 2, 'Ankit', 45, 'Waterloo', 'Cambridge', '2018-04-17', 0),
(16, 6, 2, 'Vishal', 12, 'Cambridge', 'Kitchener', '2018-04-17', 0),
(17, 3, 2, 'Faizan', 20, 'Kitchener', 'Hamilton', '2018-04-17', 0),
(21, 7, 3, 'Avi', 20, 'Hamilton', 'Toronto', '2018-04-17', 0);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `post_id` int(3) NOT NULL,
  `post_category_id` int(3) NOT NULL,
  `post_title` varchar(255) NOT NULL,
  `post_author` varchar(255) NOT NULL,
  `post_date` date NOT NULL,
  `post_image` text NOT NULL,
  `post_content` text NOT NULL,
  `post_source` varchar(255) NOT NULL,
  `post_destination` varchar(255) NOT NULL,
  `post_via` varchar(255) NOT NULL,
  `post_via_time` varchar(255) NOT NULL,
  `post_query_count` int(3) NOT NULL,
  `max_seats` int(3) NOT NULL,
  `available_seats` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`post_id`, `post_category_id`, `post_title`, `post_author`, `post_date`, `post_image`, `post_content`, `post_source`, `post_destination`, `post_via`, `post_via_time`, `post_query_count`, `max_seats`, `available_seats`) VALUES
(2, 3, 'Kitchener to Toronto', 'Malhan', '2018-04-26', 'bus2.jpg', 'Runs daily except Tuesday\r\nA/C Bus', 'Kitchener', 'Toronto', 'Kitchener Toronto Waterloo', '6:00 8:00 11:00', 2, 20, 10),
(3, 3, 'Toronto to Waterloo', 'Riyanka', '2018-04-26', 'bus3.jpg', 'Runs daily \r\nLowest Fare among all', 'Toronto', 'Waterloo', 'Toronto Cambridge Kithcener Waterloo', '3:00 5:00 7:00 12:00 18:00 20:00', 1, 30, 17),
(4, 5, 'Hamilton to Niagara', 'Divya', '2018-05-18', 'bus4.jpg', 'Runs only on Tuesday', 'Hamliton', 'Niagara', 'Hamliton Waterloo Kitchener Niagara', '12:00 2:00 5:00 7:00', 6, 0, -2),
(5, 3, 'Niagara to Toronto', 'Ankita', '2019-06-03', 'bus5.jpg', 'Runs daily', 'Niagara', 'Toronto', 'Niagara Waterloo Cambridge Toronto', '12:00 2:00 5:00 7:00 8:00', 0, 0, 0),
(6, 4, 'Niagara to Kitchener', 'Fahim', '2018-04-26', 'bus1.jpg', 'Weekly', 'Niagara', 'Kitchener', 'Niagara Kitchener', '5:00 7:00', 0, 0, 0),
(7, 4, 'Berry to Kitchener', 'Vishal', '2018-04-26', 'bus2.jpg', 'Runs Weekly', 'Berry', 'Kitchener', 'Berry Scarborough Cambridge Waterloo London Kitchener', '12:00 2:00 5:00 7:00 8:00 9:00 10:00 11:00', 0, 10, 9),
(8, 3, 'Guelph to London', 'Faizan', '2018-04-30', 'bus2.jpg', 'Runs daily except Tuesday\r\nA/C Bus', 'Guelph', 'Lucknow', 'Guelph Waterloo London', '6:00 8:00 11:00', 0, 20, 10);

-- --------------------------------------------------------

--
-- Table structure for table `query`
--

CREATE TABLE `query` (
  `query_id` int(3) NOT NULL,
  `query_bus_id` int(3) NOT NULL,
  `query_user` varchar(255) NOT NULL,
  `query_email` varchar(255) NOT NULL,
  `query_date` date NOT NULL,
  `query_content` text NOT NULL,
  `query_replied` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `query`
--

INSERT INTO `query` (`query_id`, `query_bus_id`, `query_user`, `query_email`, `query_date`, `query_content`, `query_replied`) VALUES
(6, 2, 'Vishal', 'Vishal@gmail.com', '2018-03-17', 'Great Services', 'no'),
(7, 3, 'Avi', 'Avi@gmail.com', '2018-03-19', 'Great Services', 'no'),
(8, 4, 'Malhan', 'Malhan@gmail.com', '2018-03-23', 'Nice Staff', 'no'),
(9, 2, 'Riyanka', 'Riyanka@gmail.com', '2018-03-17', 'Good', 'no'),
(10, 2, 'Faizan', 'Faizan@yahoo.in', '2018-03-18', 'Keep Going', 'no'),
(11, 3, 'Divya', 'Divya@hotmail.in', '2018-03-18', 'Good', 'no'),
(13, 4, 'Ankita', 'Ankita@yahoo.in', '2018-03-18', 'Excellent', 'no');

-- --------------------------------------------------------

--
-- Table structure for table `seats`
--

CREATE TABLE `seats` (
  `bus_id` int(3) NOT NULL,
  `max_seats` int(3) NOT NULL,
  `available_seats` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(3) NOT NULL,
  `username` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_firstname` varchar(255) NOT NULL,
  `user_lastname` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_phoneno` varchar(255) NOT NULL,
  `user_image` text NOT NULL,
  `user_role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `user_password`, `user_firstname`, `user_lastname`, `user_email`, `user_phoneno`, `user_image`, `user_role`) VALUES
(2, 'Malhan', 'Malhan', 'Malhan', 'Ach', 'Malhan@gmail.com', '0123456789', 'user_default.jpg', 'admin'),
(3, 'Riyanka', 'Riyanka', 'Riyanka', 'Manik', 'Riyanka@gmail.com', '9457862135', 'user_default.jpg', 'subscriber'),
(4, 'Divya', 'Divya', 'Divya', 'Sri', 'Divya@hotmail.in', '6475896232', 'user_default_girl.jpg', 'subscriber'),
(5, 'Faizan', 'Faizan', 'Faizan', 'Gori', 'Faizan@yahoo.in', '9784512659', 'user_default.jpg', 'admin'),
(26, 'Vishal', 'Vishal', 'Vishal', 'Prajapati', 'Vishal@gmail.com', '9784584566', 'user_default.jpg', 'subscriber'),
(28, 'Ankita', 'Ankita', 'Ankita', 'Ankita', 'Ankita@yahoo.in', '9456213654', 'user_default.jpg', 'subscriber'),
(29, 'Avi', 'Avi', 'Avi', 'Patel', 'Avi@gmail.com', '9456213654', 'user_default_girl.jpg', 'subscriber'),
(30, 'Fahim', 'Fahim', 'Fahim', 'Con', 'Fahim@gmail.com', '9457865214', 'user_default.jpg', 'subscriber');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`cat_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`post_id`);

--
-- Indexes for table `query`
--
ALTER TABLE `query`
  ADD PRIMARY KEY (`query_id`);

--
-- Indexes for table `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`bus_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `cat_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `post_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `query`
--
ALTER TABLE `query`
  MODIFY `query_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
