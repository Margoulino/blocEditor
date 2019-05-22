<?php

require_once __DIR__ . "/../../model/DBModel.php";

class BlockModel
{
    public $id;
    public $name;
    public $type;
    public $content;
    public $idPage;
    public $order;

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

    public function findByIdPage($idPage)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * FROM block WHERE idPage = :idPage
        ');
        $stmt->bindParam(':idPage', $idPage);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'BlockModel');
        return $stmt->fetchAll();
    }

    /** 
     * Save function :
     * Creates and saves a block in the database
     * 
     */
    public static function save(\BlockModel $block)
    {
        if (isset($block->id)) {
            return update($block);
        }
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            INSERT INTO block 
                (name, type, content, idPage, order) 
            VALUES 
                (:name, :type, :content, :idPage, :order)
        ');
        $stmt->bindParam(':name', $block->name);
        $stmt->bindParam(':type', $block->type);
        $stmt->bindParam(':content', $block->content);
        $stmt->bindParam(':idPage', $block->idPage);
        $stmt->bindParam(':order', $block->order);
        return $stmt->execute();
    }

    /** 
     * Update function :
     * Updates and saves a block in the database
     * 
     */
    public function update()
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare(
            '
        UPDATE `block`
         SET `name`    = :name,
             `type`    = :type,
             `content` = :content,
             `idPage`  = :idPage,
             `order`   = :order
         WHERE `id` = :id'
        );
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':type', $this->type);
        $stmt->bindParam(':content', $this->content);
        $stmt->bindParam(':idPage', $this->idPage);
        $stmt->bindParam(':order', $this->order);
        $stmt->bindParam(':id', $this->id);
        return $stmt->execute();
    }

    /**
     * Delete function
     * Deletes a block from Database
     * 
     */
    public static function delete($id)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            DELETE FROM block WHERE id = :id;
        ');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    }
}