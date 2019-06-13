<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/model/DBModel.php";

class BlockTypeModel
{
    public $id;
    public $name;
    public $templateBlock;
    public $js;
    public $subLevels;

    public function __construct($data = null)
    {
        if (is_array($data)) {
            if (isset($data['id'])) $this->id = $data['id'];
            $this->name = $data['name'];
            $this->templateBlock = $data['templateBlock'];
            $this->js = $data['js'];
            $this->subLevels = $data['subLevels'];
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
            SELECT * FROM edit_blocktype
        ');
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'BlockTypeModel');
        return $stmt->fetchAll();
    }

    public static function findByName($name)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * 
             FROM edit_blocktype
             WHERE name = :name
        ');
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'BlockTypeModel');
        return $stmt->fetchAll();
    }

    public static function findById($id)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT *
            FROM edit_blocktype
            WHERE id = :id
        ');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'BlockTypeModel');
        return $stmt->fetchAll();
    }
}
