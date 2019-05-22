<?php

/** 
 * Data Base Model class :
 * Creates a connection with the database when called
 * 
 */
class DBModel
{
    public $connection;
    public static function getConnection()
    {
        $connection = new PDO(
            'mysql:host=localhost;dbname=melectrail',
            'root',
            ''
        );
        $connection->setAttribute(
            PDO::ATTR_ERRMODE,
            PDO::ERRMODE_EXCEPTION
        );
        return $connection;
    }
}
