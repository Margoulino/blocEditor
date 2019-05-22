<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/model/DBModel.php";

class PageModel
{
    public $id;
    public $name;
    public $parentId;
    public $editable;


    public function __construct($data = null)
    {
        if (is_array($data)) {
            if (isset($data['id'])) $this->id = $data['id'];
            $this->name = $data['name'];
            $this->parentId = $data['parentId'];
        }
        $this->editable = 0;
    }

    /** 
     * Find all function :
     * Selects all the existing joggings
     * 
     */
    public static function findAll()
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * FROM page
        ');
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'PageModel');
        return $stmt->fetchAll();
    }

    public static function delete($id)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            DELETE FROM page WHERE id = :id;
        ');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    }

    /** 
     * Find by id function :
     * Selects a jogging according to the given id 
     * 
     */
    public static function findById($id)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * 
             FROM page
             WHERE id = :id
        ');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'PageModel');
        return $stmt->fetch();
    }

    /** 
     * Find by name function :
     * Selects a jogging according to its name
     * 
     */
    public static function findByname($name)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * 
             FROM page
             WHERE name = :name
        ');
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'PageModel');
        return $stmt->fetchAll();
    }

    /** 
     * Save function :
     * Creates and saves a jogging in the database
     * 
     */
    public static function save(\Page $page)
    {
        if (isset($page->id)) {
            return update($page);
        }
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            INSERT INTO page 
                (name, parentId, editable) 
            VALUES 
                (:name, :parentId, :editable)
        ');
        $stmt->bindParam(':name', $page->name);
        $stmt->bindParam(':parentId', $page->parentId);
        $stmt->bindParam(':editable', $page->editable);

    
        return $stmt->execute();
    }

    /** 
     * Update function :
     * Updates and saves a jogging in the database
     * 
     */
    public function update()
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare(
            '
        UPDATE `page`
         SET `parentId`    = :parentId,
             `editable`    = :editable,
             `name`      = :name
         WHERE `id` = :id'
        );
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':parentId', $this->parentId);
        $stmt->bindParam(':editable', $this->editable);
        $stmt->bindParam(':id', $this->id);
        return $stmt->execute();
    }
}
