<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/model/DBModel.php";

class PageModel
{
    public $id;
    public $name;
    public $public;


    public function __construct($data = null)
    {
        if (is_array($data)) {
            if (isset($data['id'])) $this->id = $data['id'];
            $this->name = $data['name'];
            $this->parentId = $data['public'];
        }
    }

    /** 
     * Find all function :
     * Selects all the existing pages
     * 
     */
    public static function findAll()
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * FROM edit_page
        ');
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'PageModel');
        return $stmt->fetchAll();
    }

    public static function emptyTable()
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            DELETE FROM `edit_page`;
        ');
        $stmt->execute();
    }

    public static function delete($id)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            DELETE FROM edit_page WHERE id = :id;
        ');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    }

    /** 
     * Find by id function :
     * Selects a page according to the given id 
     * 
     */
    public static function findById($id)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * 
             FROM edit_page
             WHERE id = :id
        ');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'PageModel');
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
             FROM edit_page
             WHERE name = :name
        ');
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'PageModel');
        return $stmt->fetchAll();
    }

    /** 
     * Save function :
     * Creates and saves a page in the database
     * 
     */
    public static function save(\PageModel $page)
    {
        if (isset($page->id)) {
            return update($page);
        }
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            INSERT INTO edit_page 
                (name, public) 
            VALUES 
                (:name, :public)
        ');
        $stmt->bindParam(':name', $page->name);
        $stmt->bindParam(':public', $page->public);


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
        UPDATE `edit_page`
         SET `public`    = :public,
             `name`      = :name
         WHERE `id` = :id'
        );
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':public', $this->public);
        $stmt->bindParam(':id', $this->id);
        return $stmt->execute();
    }

    public function publish()
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            UPDATE `edit_page`
            SET `public` = :public
            WHERE `id` = :id
        ');
        $stmt->bindParam(':public', 1);
        $stmt->bindParam(':id', $this->public);
        return $stmt->execute();
    }

    public function depublish()
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            UPDATE `edit_page`
            SET `public` = :public
            WHERE `id` = :id
        ');
        $stmt->bindParam(':public', 0);
        $stmt->bindParam(':id', $this->public);
        return $stmt->execute();
    }
}
