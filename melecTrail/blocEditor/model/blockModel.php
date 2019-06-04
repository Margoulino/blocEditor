<?php

require_once __DIR__ . "/../../model/DBModel.php";

class BlockModel
{
    public $id;
    public $name;
    public $content;
    public $pageId;
    public $orderBlock;
    public $idBlockType;
    public $dateCreation;
    public $nombreCol;
    public $innerBlocks;

    public function __construct($data = null)
    {
        if (is_array($data)) {
            if (isset($data['id'])) {
                $this->id = $data['id'];
                $this->name = $data['name'];
                $this->content = $data['content'];
                $this->pageId = $data['pageId'];
                $this->orderBlock = $data['orderBlock'];
                $this->idBlockType = $data['idBlockType'];
                $this->dateCreation = $data['dateCreation'];
                $this->nombreCol = $data['nombreCol'];
                $this->innerBlocks = $data['innerBlocks'];
            }
        }
    }

    public static function findById($id)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * FROM edit_block WHERE id = :id
        ');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'BlockModel');
        return $stmt->fetchAll();
    }

    public static function findByIdPage($idPage)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * FROM edit_block WHERE idPage = :idPage
        ');
        $stmt->bindParam(':idPage', $idPage);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'BlockModel');
        return $stmt->fetchAll();
    }

    public static function findByName($name)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * FROM edit_block WHERE name = :name
        ');
        $stmt->bindParam(':name', $name);
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
            INSERT INTO edit_block 
                (name, content, pageId, orderBlock, idBlockType, nombreCol, innerBlocks) 
            VALUES 
                (:name, :content, :pageId, :orderBlock, :idBlockType, :nombreCol, :innerBlocks)
        ');
        $stmt->bindParam(':name', $block->name);
        $stmt->bindParam(':content', $block->content);
        $stmt->bindParam(':pageId', $block->pageId);
        $stmt->bindParam(':orderBlock', $block->orderBlock);
        $stmt->bindParam(':idBlockType', $block->idBlockType);
        $stmt->bindParam(':nombreCol', $block->nombreCol);
        $stmt->bindParam(':innerBlocks', $block->innerBlocks);
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
        UPDATE `edit_block`
         SET `name`           = :name,
             `content`        = :content,
             `pageId`         = :pageId,
             `orderBlock`     = :orderBlock,
             `idBlockType`    = :idBlockType,
             `nombreCol`      = :nombreCol,
             `innerBlocks`    = :innerBlocks
         WHERE `id` = :id'
        );
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':content', $this->content);
        $stmt->bindParam(':pageId', $this->pageId);
        $stmt->bindParam(':orderBlock', $this->orderBlock);
        $stmt->bindParam(':idBlockType', $this->idBlockType);
        $stmt->bindParam(':nombreCol', $this->nombreCol);
        $stmt->bindParam(':innerBlocks', $this->innerBlocks);
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
            DELETE FROM edit_block WHERE id = :id;
        ');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    }

    public static function getBlocksByPageIdOrderGt($pageId, $orderBlock)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * FROM edit_block WHERE pageId = :pageId AND orderBlock > :orderBlock;
        ');
        $stmt->bindParam(':pageId', $pageId);
        $stmt->bindParam(':orderBlock', $orderBlock);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'BlockModel');
        return $stmt->fetchAll();
    }
}
