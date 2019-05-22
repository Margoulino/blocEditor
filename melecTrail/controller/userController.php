<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/model/userModel.php';
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';
use \Firebase\JWT\JWT;

class UserController
{
    public function __construct()
    { }

    /** 
     * Sign up function
     * Gets the form from the client and creates a new user with the given informations
     * 
     */
    function signup()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        $user = new UserModel;
        $user->username = $data->username;
        $user->email = $data->email;
        $user->password = $data->password;
        UserModel::save($user);
        http_response_code(200);
        echo json_encode(array(
            "message" => "User succesfully created."
        ));
    }

    /** 
     * Login function :
     * Gets the form from the client and opens a session for the user if the informations are true
     * 
     */
    function login()
    {

        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));

        if ($user = UserModel::findByUsername($data->username)) {
            if (password_verify($data->password, $user->password)) {
                $token = array(
                    "exp" => time() + 5000,
                    "data" => array(
                        "username" => $user->username,
                        "email" => $user->username
                    )
                );
                http_response_code(200);

                $jwt = JWT::encode($token, "63-trUY^f4ER");

                echo json_encode(
                    array(
                        "message" => "Successful login.",
                        "jwt" => $jwt
                    )
                );
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "Login failed."));
            }
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Login failed."));
        }
    }

    /** 
     * Update account function :
     * Gets the form from the client and updates the user's account 
     * 
     */
    function update_account()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        try {
            $username = $this->validateJWT($data->jwt);
        } catch (Exception $e) {
            http_response_code(403);
            echo "bad credentials";
            return;
        }
        $userdb = UserModel::findByUsername($username);
        if ($data->email != "") {
            $userdb->email = $data->email;
        }
        if ($data->username != "") {
            $userdb->username = $data->username;
        }
        if ($data->password != "") {
            $userdb->password = $data->password;
            $userdb->update();
        } else {
            $userdb->update($userdb->password);
        }
        
        http_response_code(200);
        echo json_encode(array("message" => "user successfully updated"));
    }

    /** 
     * Update redirect function :
     * Redirects to the update account view 
     * 
     */
    function update_redirect()
    {
        require $_SERVER['DOCUMENT_ROOT'] . '/view/user/update_account.php';
    }

    /** 
     * Validate Json Web Token function :
     * Checks if the given JWT is valid and decodes it 
     * 
     */
    function validateJWT($jwt)
    {
        if ($decoded = JWT::decode($jwt, "63-trUY^f4ER", array('HS256'))) {
            return $decoded->data->username;
        } else return null;
    }

    /** 
     * Set header function :
     * Set HTTP headers 
     * 
     */
    function setHeader()
    {
        header("Access-Control-Allow-Origin: http://localhost:5000/");
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Max-Age: 3600");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    }
}
