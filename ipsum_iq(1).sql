-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 12. Jan 2023 um 16:29
-- Server-Version: 10.4.27-MariaDB
-- PHP-Version: 8.2.0

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
  `licht` int(10) NOT NULL,
  `user` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `eintraege`
--

INSERT INTO `eintraege` (`eintraege_id`, `Zeitpunkt`, `Datum`, `Status`, `licht`, `user`) VALUES
(12, '17:06:22', '11-01-2023', 'aus', 1, 'admin'),
(13, '17:08:14', '11-01-2023', 'aus', 1, 'user');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `licht`
--

CREATE TABLE `licht` (
  `licht_id` int(11) NOT NULL,
  `licht_name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `licht`
--

INSERT INTO `licht` (`licht_id`, `licht_name`) VALUES
(1, 'Wohnzimmer Licht'),
(2, 'Schlafzimmer Licht');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indizes für die Tabelle `licht`
--
ALTER TABLE `licht`
  ADD PRIMARY KEY (`licht_id`);

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
  MODIFY `eintraege_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT für Tabelle `licht`
--
ALTER TABLE `licht`
  MODIFY `licht_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
