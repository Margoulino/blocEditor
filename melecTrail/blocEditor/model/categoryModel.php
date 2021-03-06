<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/model/DBModel.php";

class CategoryModel
{
    public $id;
    public $name;

    public function __construct($data = null)
    {
        if (is_array($data)) {
            if (isset($data['id'])) $this->id = $data['id'];
            $this->name = $data['name'];
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
            SELECT * FROM edit_category
        ');
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'CategoryModel');
        return $stmt->fetchAll();
    }

    /** 
     * Save function :
     * Creates and saves a category in the database
     * 
     */
    public static function save(\CategoryModel $category)
    {
        if (isset($category->id)) {
            return update($category);
        }
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            INSERT INTO edit_category 
                (name) 
            VALUES 
                (:name)
        ');
        $stmt->bindParam(':name', $category->name);


        return $stmt->execute();
    }

    /** 
     * Find by id function :
     * Selects a category according to the given id 
     * 
     */
    public static function findById($id)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * 
             FROM edit_category
             WHERE id = :id
        ');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'CategoryModel');
        return $stmt->fetch();
    }

    /** 
     * Find by name function :
     * Selects a page according to its name
     * 
     */
    public static function findByname($name)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * 
             FROM edit_category
             WHERE name = :name
        ');
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'CategoryModel');
        return $stmt->fetchAll();
    }

    public function delete(){
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
        delete from edit_category
        where name = :name');
        $stmt->bindParam(':name' , $this->name);
        $stmt->execute();
    }


}