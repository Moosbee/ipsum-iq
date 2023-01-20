-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 19. Jan 2023 um 08:38
-- Server-Version: 10.4.21-MariaDB
-- PHP-Version: 8.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `ipsum_iq`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `eintraege`
--

CREATE TABLE `eintraege` (
  `eintraege_id` int(11) NOT NULL,
  `Zeitpunkt` text NOT NULL,
  `Datum` varchar(60) NOT NULL,
  `Status` varchar(10) NOT NULL,
  `licht` varchar(10) NOT NULL,
  `user` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `eintraege`
--

INSERT INTO `eintraege` (`eintraege_id`, `Zeitpunkt`, `Datum`, `Status`, `licht`, `user`) VALUES
(19, '13:02', '17-01-2023', 'an', 'ESP2', 'admin'),
(20, '13:02', '17-01-2023', 'aus', 'ESP2', 'admin'),
(21, '13:02', '17-01-2023', 'an', 'ESP2', 'admin'),
(22, '13:02', '17-01-2023', 'aus', 'ESP2', 'admin'),
(23, '16:15', '17-01-2023', 'an', 'ESP2', 'admin'),
(24, '16:15', '17-01-2023', 'aus', 'ESP2', 'admin'),
(25, '16:15', '17-01-2023', 'an', 'ESP2', 'admin'),
(26, '16:15', '17-01-2023', 'aus', 'ESP2', 'admin'),
(27, '16:15', '17-01-2023', 'an', 'ESP2', 'admin'),
(28, '16:15', '17-01-2023', 'an', 'ESP1', 'admin'),
(29, '16:15', '17-01-2023', 'aus', 'ESP1', 'admin'),
(30, '16:15', '17-01-2023', 'an', 'ESP1', 'admin'),
(31, '16:15', '17-01-2023', 'aus', 'ESP1', 'admin'),
(32, '8:34', '19-01-2023', 'an', 'ESP2', 'user'),
(33, '8:34', '19-01-2023', 'aus', 'ESP2', 'user'),
(34, '8:34', '19-01-2023', 'an', 'ESP2', 'user');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`user_id`, `username`, `password`) VALUES
(6, 'admin', '$2b$10$eX.NrD1O0AQ2f0T9wPAeXeb9qQWN1Lj7QME.fczrHPn5FoarqX8TS'),
(7, 'user', '$2b$10$nperthoAOe69oiXkC5ghz.nDaM27PFqtPU0Ryjuixtuwu3VwQoXia');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `eintraege`
--
ALTER TABLE `eintraege`
  ADD PRIMARY KEY (`eintraege_id`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `eintraege`
--
ALTER TABLE `eintraege`
  MODIFY `eintraege_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
