<?php

require_once __DIR__ . "/DBModel.php";

class BlockModel
{
    public $id;
    public $name;
    public $type;
    public $content;
    public $idPage;
    //public $order;

    public function __construct($data = null)
    {
        if (is_array($data)) {
            if (isset($data['id'])) {
                $this->id = $data['id'];
                $this->name = $data['name'];
                $this->type = $data['type'];
                $this->content = $data['content'];
                $this->idPage = $data['idPage'];
                $this->order = $data['order'];
            }
        }
    }

    public function findByIdPage($pageId)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * FROM block WHERE pageId = :pageId
        ');
        $stmt->bindParam(':pageId', $pageId);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'BlockModel');
        return $stmt->fetchAll();
    }
}