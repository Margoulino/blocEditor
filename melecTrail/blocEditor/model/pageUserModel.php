<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/model/DBModel.php";

class PageUserModel
{
    public $idPage;
    public $idUser;

    public function __construct($data = null)
    {
        if (is_array($data)) {
            $this->idPage = $data['idPage'];
            $this->idUser = $data['idUser'];
        }
    }


    /** 
     * Find all function :
     * Selects all the existing pageUser
     * 
     */
    public static function findAll()
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * FROM edit_pageuser
        ');
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'PageUserModel');
        return $stmt->fetchAll();
    }

    /** 
     * Save function :
     * Creates and saves a pageUser in the database
     * 
     */
    public static function save(\PageUserModel $pageUser)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            INSERT INTO edit_pageuser 
                (idPage,idUser) 
            VALUES 
                (:idPage,:idUser)
        ');
        $stmt->bindParam(':idPage', $pageUser->idPage);
        $stmt->bindParam(':idUser', $pageUser->idUser);

        return $stmt->execute();
    }

}