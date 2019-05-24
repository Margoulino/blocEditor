<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/model/DBModel.php";

class PageCategoryModel
{
    public $idPage;
    public $idCategory;

    public function __construct($data = null)
    {
        if (is_array($data)) {
            $this->idPage = $data['idPage'];
            $this->idCategory = $data['idCategory'];
        }
    }

    /** 
     * Find all function :
     * Selects all the existing categories
     * 
     */
    public static function findAll()
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * FROM edit_pagecategory
        ');
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'PageCategoryModel');
        return $stmt->fetchAll();
    }

    /** 
     * Save function :
     * Creates and saves a category in the database
     * 
     */
    public static function save(\PageCategoryModel $category)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            INSERT INTO edit_pagecategory 
                (idPage,idCategory) 
            VALUES 
                (:idPage,:idCategory)
        ');
        $stmt->bindParam(':idPage', $category->idPage);
        $stmt->bindParam(':idCategory', $category->idCategory);

        return $stmt->execute();
    }
}
