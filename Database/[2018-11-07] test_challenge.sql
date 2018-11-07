-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 07, 2018 at 12:11 PM
-- Server version: 10.1.30-MariaDB
-- PHP Version: 7.2.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test_challenge`
--

-- --------------------------------------------------------

--
-- Table structure for table `mata_uang`
--

CREATE TABLE `mata_uang` (
  `mata_uang` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `mata_uang`
--

INSERT INTO `mata_uang` (`mata_uang`) VALUES
('AUD'),
('CAD'),
('CHF'),
('CNY'),
('DKK'),
('EUR'),
('GBP'),
('HKD'),
('JPY'),
('MYR'),
('NZD'),
('SAR'),
('SEK'),
('SGD'),
('THB'),
('USD');

-- --------------------------------------------------------

--
-- Table structure for table `bank_notes`
--

CREATE TABLE `bank_notes` (
  `id` int(11) NOT NULL,
  `mata_uang` varchar(10) NOT NULL,
  `jual` float NOT NULL,
  `beli` float NOT NULL,
  `last_update` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bank_notes`
--

INSERT INTO `bank_notes` (`id`, `mata_uang`, `jual`, `beli`, `last_update`) VALUES
(65, 'USD', 15050, 14750, '2018-11-06 11:28:00'),
(66, 'SGD', 10951, 10725, '2018-11-06 11:28:00'),
(67, 'EUR', 17208, 16788, '2018-11-06 11:28:00'),
(68, 'AUD', 10895, 10613, '2018-11-06 11:28:00'),
(69, 'DKK', 2341, 2210, '2018-11-06 11:28:00'),
(70, 'SEK', 1702, 1583, '2018-11-06 11:28:00'),
(71, 'CAD', 11513, 11208, '2018-11-06 11:28:00'),
(72, 'CHF', 15029, 14644, '2018-11-06 11:28:00'),
(73, 'NZD', 10053, 9784, '2018-11-06 11:28:00'),
(74, 'GBP', 19685, 19224, '2018-11-06 11:28:00'),
(75, 'HKD', 1935, 1867, '2018-11-06 11:28:00'),
(76, 'JPY', 134.78, 128.27, '2018-11-06 11:28:00'),
(77, 'SAR', 4052, 3882, '2018-11-06 11:28:00'),
(78, 'CNY', 2215, 2088, '2018-11-06 11:28:00'),
(79, 'MYR', 0, 0, '2018-11-06 11:28:00'),
(80, 'THB', 461, 432, '2018-11-06 11:28:00'),
(227, 'USD', 14950, 14650, '2018-11-07 10:51:00'),
(228, 'SGD', 10890, 10663, '2018-11-07 10:51:00'),
(229, 'EUR', 17131, 16710, '2018-11-07 10:51:00'),
(230, 'AUD', 10849, 10567, '2018-11-07 10:51:00'),
(231, 'DKK', 2331, 2200, '2018-11-07 10:51:00'),
(232, 'SEK', 1695, 1576, '2018-11-07 10:51:00'),
(233, 'CAD', 11424, 11119, '2018-11-07 10:51:00'),
(234, 'CHF', 14975, 14590, '2018-11-07 10:51:00'),
(235, 'NZD', 10105, 9833, '2018-11-07 10:51:00'),
(236, 'GBP', 19629, 19166, '2018-11-07 10:51:00'),
(237, 'HKD', 1923, 1855, '2018-11-07 10:51:00'),
(238, 'JPY', 134, 127.49, '2018-11-07 10:51:00'),
(239, 'SAR', 4025, 3855, '2018-11-07 10:51:00'),
(240, 'CNY', 2199, 2071, '2018-11-07 10:51:00'),
(241, 'MYR', 0, 0, '2018-11-07 10:51:00'),
(242, 'THB', 458, 429, '2018-11-07 10:51:00'),
(243, 'USD', 1803.5, 177355, '2018-05-15 17:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `e_rate`
--

CREATE TABLE `e_rate` (
  `id` int(11) NOT NULL,
  `mata_uang` varchar(10) NOT NULL,
  `jual` float NOT NULL,
  `beli` float NOT NULL,
  `last_update` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `e_rate`
--

INSERT INTO `e_rate` (`id`, `mata_uang`, `jual`, `beli`, `last_update`) VALUES
(82, 'USD', 14818, 14788, '2018-11-06 09:12:00'),
(83, 'SGD', 10799.2, 10751.2, '2018-11-06 09:12:00'),
(84, 'EUR', 16958, 16858, '2018-11-06 09:12:00'),
(85, 'AUD', 10755.2, 10675.2, '2018-11-06 09:12:00'),
(86, 'DKK', 2296.72, 2236.72, '2018-11-06 09:12:00'),
(87, 'SEK', 1655.65, 1615.65, '2018-11-06 09:12:00'),
(88, 'CAD', 11331.4, 11251.4, '2018-11-06 09:12:00'),
(89, 'CHF', 14792.6, 14692.6, '2018-11-06 09:12:00'),
(90, 'NZD', 9921.01, 9841.01, '2018-11-06 09:12:00'),
(91, 'GBP', 19404.9, 19304.9, '2018-11-06 09:12:00'),
(92, 'HKD', 1904.89, 1874.89, '2018-11-06 09:12:00'),
(93, 'JPY', 132.44, 129.04, '2018-11-06 09:12:00'),
(94, 'SAR', 3986.43, 3906.43, '2018-11-06 09:12:00'),
(95, 'CNY', 2200.3, 2080.3, '2018-11-06 09:12:00'),
(96, 'MYR', 3585.21, 3505.21, '2018-11-06 09:12:00'),
(97, 'THB', 453.46, 445.46, '2018-11-06 09:12:00'),
(182, 'USD', 14593, 14563, '2018-11-07 09:30:00'),
(183, 'SGD', 10669.2, 10621.2, '2018-11-07 09:30:00'),
(184, 'EUR', 16795.8, 16695.8, '2018-11-07 09:30:00'),
(185, 'AUD', 10654.2, 10574.2, '2018-11-07 09:30:00'),
(186, 'DKK', 2275.18, 2215.18, '2018-11-07 09:30:00'),
(187, 'SEK', 1640.73, 1600.73, '2018-11-07 09:30:00'),
(188, 'CAD', 11169.9, 11089.9, '2018-11-07 09:30:00'),
(189, 'CHF', 14663.8, 14563.8, '2018-11-07 09:30:00'),
(190, 'NZD', 9918.05, 9838.05, '2018-11-07 09:30:00'),
(191, 'GBP', 19233.2, 19133.2, '2018-11-07 09:30:00'),
(192, 'HKD', 1876.68, 1846.68, '2018-11-07 09:30:00'),
(193, 'JPY', 130.62, 127.23, '2018-11-07 09:30:00'),
(194, 'SAR', 3926.3, 3846.3, '2018-11-07 09:30:00'),
(195, 'CNY', 2167.32, 2047.32, '2018-11-07 09:30:00'),
(196, 'MYR', 3538.03, 3458.03, '2018-11-07 09:30:00'),
(197, 'THB', 448.46, 440.46, '2018-11-07 09:30:00'),
(199, 'USD', 1803.5, 177355, '2018-05-15 17:00:00');


-- --------------------------------------------------------

--
-- Table structure for table `tt_counter`
--

CREATE TABLE `tt_counter` (
  `mata_uang` varchar(10) NOT NULL,
  `jual` float NOT NULL,
  `beli` float NOT NULL,
  `last_update` timestamp NULL DEFAULT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tt_counter`
--

INSERT INTO `tt_counter` (`mata_uang`, `jual`, `beli`, `last_update`, `id`) VALUES
('USD', 14990, 14690, '2018-11-06 09:13:00', 65),
('SGD', 10879.3, 10726.3, '2018-11-06 09:13:00', 66),
('EUR', 17149.9, 16762.9, '2018-11-06 09:13:00', 67),
('AUD', 10882.8, 10605.8, '2018-11-06 09:13:00', 68),
('DKK', 2312, 2243.1, '2018-11-06 09:13:00', 69),
('SEK', 1670.4, 1615.4, '2018-11-06 09:13:00', 70),
('CAD', 11451.2, 11178.2, '2018-11-06 09:13:00', 71),
('CHF', 14958.7, 14615.7, '2018-11-06 09:13:00', 72),
('NZD', 10047.8, 9758.75, '2018-11-06 09:13:00', 73),
('GBP', 19649.2, 19167.2, '2018-11-06 09:13:00', 74),
('HKD', 1918, 1871.2, '2018-11-06 09:13:00', 75),
('JPY', 133.49, 128.78, '2018-11-06 09:13:00', 76),
('SAR', 4009.55, 3903.55, '2018-11-06 09:13:00', 77),
('CNY', 2229, 2064, '2018-11-06 09:13:00', 78),
('MYR', 3602.8, 3501.8, '2018-11-06 09:13:00', 79),
('THB', 455.3, 446.3, '2018-11-06 09:13:00', 80),
('USD', 14730, 14430, '2018-11-07 09:31:00', 163),
('SGD', 10723.9, 10569.9, '2018-11-07 09:31:00', 164),
('EUR', 16951.1, 16563.1, '2018-11-07 09:31:00', 165),
('AUD', 10758.8, 10481.8, '2018-11-07 09:31:00', 166),
('DKK', 2285.3, 2216.2, '2018-11-07 09:31:00', 167),
('SEK', 1651.4, 1596.3, '2018-11-07 09:31:00', 168),
('CAD', 11263.8, 10990.8, '2018-11-07 09:31:00', 169),
('CHF', 14796.5, 14451.5, '2018-11-07 09:31:00', 170),
('NZD', 10023.6, 9733.6, '2018-11-07 09:31:00', 171),
('GBP', 19430.6, 18947.6, '2018-11-07 09:31:00', 172),
('HKD', 1885.35, 1838.55, '2018-11-07 09:31:00', 173),
('JPY', 131.33, 126.63, '2018-11-07 09:31:00', 174),
('SAR', 3940.05, 3834.05, '2018-11-07 09:31:00', 175),
('CNY', 2191.4, 2026.4, '2018-11-07 09:31:00', 176),
('MYR', 3547.2, 3447.2, '2018-11-07 09:31:00', 177),
('THB', 449.35, 440.35, '2018-11-07 09:31:00', 178),
('USD', 1803.5, 177355, '2018-05-15 17:00:00', 179);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bank_notes`
--
ALTER TABLE `bank_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mata_uang` (`mata_uang`);

--
-- Indexes for table `e_rate`
--
ALTER TABLE `e_rate`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_mata_uang` (`mata_uang`);

--
-- Indexes for table `mata_uang`
--
ALTER TABLE `mata_uang`
  ADD PRIMARY KEY (`mata_uang`),
  ADD UNIQUE KEY `mata_uang` (`mata_uang`);

--
-- Indexes for table `tt_counter`
--
ALTER TABLE `tt_counter`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mata_uang` (`mata_uang`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bank_notes`
--
ALTER TABLE `bank_notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=244;

--
-- AUTO_INCREMENT for table `e_rate`
--
ALTER TABLE `e_rate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=200;

--
-- AUTO_INCREMENT for table `tt_counter`
--
ALTER TABLE `tt_counter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=180;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bank_notes`
--
ALTER TABLE `bank_notes`
  ADD CONSTRAINT `bank_notes_ibfk_1` FOREIGN KEY (`mata_uang`) REFERENCES `mata_uang` (`mata_uang`);

--
-- Constraints for table `e_rate`
--
ALTER TABLE `e_rate`
  ADD CONSTRAINT `e_rate_ibfk_1` FOREIGN KEY (`mata_uang`) REFERENCES `mata_uang` (`mata_uang`);

--
-- Constraints for table `tt_counter`
--
ALTER TABLE `tt_counter`
  ADD CONSTRAINT `tt_counter_ibfk_1` FOREIGN KEY (`mata_uang`) REFERENCES `mata_uang` (`mata_uang`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
