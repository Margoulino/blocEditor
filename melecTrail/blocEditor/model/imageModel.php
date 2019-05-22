<?php

require_once __DIR__ . "/DBModel.php";

class ImageModel
{
    public $id;
    public $name;
    public $path;
    public $height;
    public $width;
    public $extension;

    public function __construct($data = null)
    {
        if (is_array($data)) {
            if (isset($data['id'])) {
                $this->id = $data['id'];
                $this->name = $data['name'];
                $this->path = $data['path'];
                $this->height = $data['height'];
                $this->width = $data['width'];
                $this->extension = $data['extension'];
            }
        }
    }

    public function findById($id)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * FROM image WHERE id = :id
        ');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'ImageModel');
        return $stmt->fetchAll();
    }

    /** 
     * Save function :
     * Creates and saves a image in the database
     * 
     */
    public static function save(\ImageModel $image)
    {
        if (isset($image->id)) {
            return update($image);
        }
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            INSERT INTO image 
                (name, path, height, width, extension) 
            VALUES 
                (:name, :path, :height, :width, :extension)
        ');
        $stmt->bindParam(':name', $image->name);
        $stmt->bindParam(':path', $image->path);
        $stmt->bindParam(':height', $image->height);
        $stmt->bindParam(':width', $image->width);
        $stmt->bindParam(':extension', $image->extension);
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
        UPDATE `image`
         SET `name`    = :name,
             `path`    = :path,
             `height` = :height,
             `width`  = :width,
             `extension`   = :extension
         WHERE `id` = :id'
        );
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':path', $this->path);
        $stmt->bindParam(':height', $this->height);
        $stmt->bindParam(':width', $this->width);
        $stmt->bindParam(':extension', $this->extension);
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
            DELETE FROM image WHERE id = :id;
        ');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    }
}