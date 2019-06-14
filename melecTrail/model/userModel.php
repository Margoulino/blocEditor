<?php

require_once __DIR__ . "/DBModel.php";

class UserModel
{
    // properties

    public $id;
    public $username;
    public $password;
    public $email;
    public $role;
    public $alert;


    public function __construct($data = null)
    {
        if (is_array($data)) {
            if (isset($data['id'])) $this->id = $data['id'];
            $this->username = $data['username'];
            $this->password = $data['password'];
            $this->email = $data['email'];
            $this->role = $data['role'];
            $this->alert = $data['alert'];
        }
    }
    /** 
     * Find by username function :
     * Selects a user according to the given username
     * 
     */
    public static function findByUsername($username)
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT "User", user.* 
             FROM user
             WHERE username = :username
        ');
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'UserModel');
        return $stmt->fetch();
    }

    public static function findAll()
    {
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            SELECT * FROM user
        ');
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'User');
        return $stmt->fetchAll();
    }
    /** 
     * Save function :
     * Creates and saves a user in the database
     * 
     */
    public static function save(\UserModel $user)
    {
        $options = [
            'cost' => 15
        ];
        $hashPassword = password_hash($user->password, PASSWORD_BCRYPT, $options);
        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare('
            INSERT INTO user
                (username, password, email, role, alert) 
            VALUES 
                (:username, :password, :email, :role, :alert)
        ');
        $stmt->bindParam(':username', $user->username);
        $stmt->bindParam(':password', $hashPassword);
        $stmt->bindParam(':email', $user->email);
        $stmt->bindParam(':role', $user->role);
        $stmt->bindParam(':alert', $user->alert);
        return $stmt->execute();
    }

    /** 
     * Update function :
     * Updates and saves a user in the database
     * The password is encoded in bcrypt
     * 
     */
    public function update($hashPassword = null)
    {

        $dbConn = DBModel::getConnection();
        $stmt = $dbConn->prepare(
            '
        UPDATE `user`
         SET `username` = :username,
             `email`    = :email,
             `password` = :password,
             `alert`    = :alert
         WHERE `id` = :id'
        );
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':alert', $this->alert);
        if (!$hashPassword) {
            $hashPassword = password_hash($this->password, PASSWORD_BCRYPT, ['cost' => 15]);
        }
        $stmt->bindParam(':password', $hashPassword);
        return $stmt->execute();
    }
}
