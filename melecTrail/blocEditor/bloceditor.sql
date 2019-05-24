-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  ven. 24 mai 2019 à 13:20
-- Version du serveur :  5.7.24
-- Version de PHP :  7.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `bloceditor`
--

-- --------------------------------------------------------

--
-- Structure de la table `block`
--

DROP TABLE IF EXISTS `block`;
CREATE TABLE IF NOT EXISTS `block` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `content` longtext NOT NULL,
  `pageId` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  `idBlockType` int(11) NOT NULL,
  `dateCreation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nombreCol` int(11) NOT NULL,
  `innerBlocks` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `pageId` (`pageId`),
  KEY `idBlockType` (`idBlockType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `blocktype`
--

DROP TABLE IF EXISTS `blocktype`;
CREATE TABLE IF NOT EXISTS `blocktype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `templateBlock` longtext NOT NULL,
  `style` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `page`
--

DROP TABLE IF EXISTS `page`;
CREATE TABLE IF NOT EXISTS `page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `public` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `pagecategory`
--

DROP TABLE IF EXISTS `pagecategory`;
CREATE TABLE IF NOT EXISTS `pagecategory` (
  `idPage` int(11) NOT NULL,
  `idCategory` int(11) NOT NULL,
  PRIMARY KEY (`idPage`,`idCategory`),
  KEY `idCategory` (`idCategory`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `pageuser`
--

DROP TABLE IF EXISTS `pageuser`;
CREATE TABLE IF NOT EXISTS `pageuser` (
  `idPage` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `dateModif` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idPage`,`idUser`),
  KEY `idUser` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `role` varchar(100) NOT NULL,
  `mail` varchar(100) NOT NULL,
  `password` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `block`
--
ALTER TABLE `block`
  ADD CONSTRAINT `block_ibfk_1` FOREIGN KEY (`pageId`) REFERENCES `page` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `block_ibfk_2` FOREIGN KEY (`idBlockType`) REFERENCES `blocktype` (`id`);

--
-- Contraintes pour la table `pagecategory`
--
ALTER TABLE `pagecategory`
  ADD CONSTRAINT `pagecategory_ibfk_1` FOREIGN KEY (`idCategory`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `pagecategory_ibfk_2` FOREIGN KEY (`idPage`) REFERENCES `page` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `pageuser`
--
ALTER TABLE `pageuser`
  ADD CONSTRAINT `pageuser_ibfk_1` FOREIGN KEY (`idPage`) REFERENCES `page` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pageuser_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
