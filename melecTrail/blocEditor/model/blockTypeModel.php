<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/model/DBModel.php";

class BlockTypeModel
{
    public $id;
    public $name;
    public $templateBlock;
    public $style;

    public function __construct($data = null)
    {
        if (is_array($data)) {
            if (isset($data['id'])) $this->id = $data['id'];
            $this->name = $data['name'];
            $this->templateBlock = $data['templateBlock'];
            $this->style = $data['style'];
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
}
