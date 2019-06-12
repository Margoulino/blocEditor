-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  ven. 24 mai 2019 à 13:41
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
-- Structure de la table `edit_block`
--

DROP TABLE IF EXISTS `edit_block`;
CREATE TABLE IF NOT EXISTS `edit_block` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `content` longtext NOT NULL,
  `pageId` int(11) NOT NULL,
  `orderBlock` int(11) NOT NULL,
  `idBlockType` int(11) NOT NULL,
  `dateCreation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `idParent` int(11) NOT NULL,
  `idChild` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `pageId` (`pageId`),
  KEY `idBlockType` (`idBlockType`),
  KEY `idChild` (`idChild`),
  KEY `idParent` (`idParent`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `edit_blocktype`
--

DROP TABLE IF EXISTS `edit_blocktype`;
CREATE TABLE IF NOT EXISTS `edit_blocktype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `templateBlock` longtext NOT NULL,
  `js` longtext NULL,
  `subLevels` int(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `edit_category`
--

DROP TABLE IF EXISTS `edit_category`;
CREATE TABLE IF NOT EXISTS `edit_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `edit_page`
--

DROP TABLE IF EXISTS `edit_page`;
CREATE TABLE IF NOT EXISTS `edit_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `public` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `edit_pagecategory`
--

DROP TABLE IF EXISTS `edit_pagecategory`;
CREATE TABLE IF NOT EXISTS `edit_pagecategory` (
  `idPage` int(11) NOT NULL,
  `idCategory` int(11) NOT NULL,
  PRIMARY KEY (`idPage`,`idCategory`),
  KEY `idCategory` (`idCategory`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `edit_pageuser`
--

DROP TABLE IF EXISTS `edit_pageuser`;
CREATE TABLE IF NOT EXISTS `edit_pageuser` (
  `idPage` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `dateModif` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idPage`,`idUser`),
  KEY `idUser` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `edit_pagecategory`
--
ALTER TABLE `edit_pagecategory`
  ADD CONSTRAINT `edit_pagecategory_ibfk_1` FOREIGN KEY (`idCategory`) REFERENCES `edit_category` (`id`),
  ADD CONSTRAINT `edit_pagecategory_ibfk_2` FOREIGN KEY (`idPage`) REFERENCES `edit_page` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `edit_pageuser`
--
ALTER TABLE `edit_pageuser`
  ADD CONSTRAINT `edit_pageuser_ibfk_1` FOREIGN KEY (`idPage`) REFERENCES `edit_page` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `edit_pageuser_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `edit_block`
--
ALTER TABLE `edit_block`
  ADD CONSTRAINT `edit_block_ibfk_1` FOREIGN KEY (`idChild`) REFERENCES `edit_block` (`id`),
  ADD CONSTRAINT `edit_block_ibfk_2` FOREIGN KEY (`idParent`) REFERENCES `edit_block` (`id`);
COMMIT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
