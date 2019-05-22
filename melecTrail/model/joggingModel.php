<?php

require_once __DIR__ . "/DBModel.php";

class JoggingModel
{
    public $id;
    public $creator;
    public $attendees;
    public $departure;
    public $date;
    public $description;

    public function __construct($data = null)
    {
        if (is_array($data)) {
            if (isset($data['id'])) $this->id = $data['id'];
            $this->creator = $data['creator'];
            $this->attendees = $data['attendees'];
            $this->departure = $data['departure'];
            $this->date = $data['date'];
        }
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
            SELECT * FROM jogging
        ');
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'Jogging');
        return $stmt->fetchAll();
    }

    public static function delete($id)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            DELETE FROM jogging WHERE id = :id;
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
             FROM jogging
             WHERE id = :id
        ');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'JoggingModel');
        return $stmt->fetch();
    }

    /** 
     * Find by creator function :
     * Selects a jogging according to its creator
     * 
     */
    public static function findByCreator($creator)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * 
             FROM jogging
             WHERE creator = :creator
        ');
        $stmt->bindParam(':creator', $creator);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'JoggingModel');
        return $stmt->fetchAll();
    }

    /** 
     * Save function :
     * Creates and saves a jogging in the database
     * 
     */
    public static function save(\JoggingModel $jogging)
    {
        if (isset($jogging->id)) {
            return update($jogging);
        }
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            INSERT INTO jogging 
                (creator, attendees, departure, date, description) 
            VALUES 
                (:creator, :attendees, :departure, :date, :description)
        ');
        $stmt->bindParam(':creator', $jogging->creator);
        $stmt->bindParam(':attendees', $jogging->attendees);
        $stmt->bindParam(':departure', $jogging->departure);
        $stmt->bindParam(':date', $jogging->date);
        $stmt->bindParam(':description', $jogging->description);
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
        UPDATE `jogging`
         SET `attendees`    = :attendees,
             `departure`    = :departure,
             `date`         = :date,
             `description`  = :description,
             `creator`      = :creator
         WHERE `id` = :id'
        );
        $stmt->bindParam(':creator', $this->creator);
        $stmt->bindParam(':attendees', $this->attendees);
        $stmt->bindParam(':departure', $this->departure);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':date', $this->date);
        $stmt->bindParam(':id', $this->id);
        return $stmt->execute();
    }
}
