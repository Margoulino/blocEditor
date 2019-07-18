<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/model/userModel.php';
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';
use \Firebase\JWT\JWT;
use PHPMailer\PHPMailer\PHPMailer;

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
        try {
            $this->setHeader();
            $data = json_decode(file_get_contents("php://input"));
            $key = hash('sha256', ",92Uh|");
            $iv = substr(hash('sha256', "xf"), 0, 16);
            $code2check = openssl_decrypt($data->code, "AES-256-CBC", $key, 0, $iv);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(array("message" => $e));
            return;
        }
        if ($code2check === $data->email) {
            try {
                $user = new UserModel;
                $user->username = $data->username;
                $user->email = $data->email;
                $user->password = $data->password;
                $user->role = "USER";
                $user->tel = $data->tel;
                if(isset($data->filepond))
                {$user->pic = json_decode($data->filepond)->data;}
                if (isset($data->alertnews)) {
                    $user->alert = true;
                } else {
                    $user->alert = 0;
                }
                UserModel::save($user);
            } catch (Exception $e) {
                http_response_code(401);
                echo json_encode(array("message" => $e));
                return;
            }
            http_response_code(200);
            echo json_encode(array(
                "message" => "User succesfully created."
            ));
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "error while decoding code"));
            return;
        }
    }

    /** 
     * Login function :
     * Gets the form from the client and opens a session for the user if the informations are true
     * 
     */
    function login()
    {
        if ($user = UserModel::findByUsername($_POST['username'])) {
            if (password_verify($_POST['password'], $user->password)) {
                $token = array(
                    "exp" => time() + 5000,
                    "data" => array(
                        "username" => $user->username,
                        "email" => $user->username,
                        "role" => $user->role
                    )
                );
                $jwt = JWT::encode($token, "63-trUY^f4ER");
                setcookie("jwt", $jwt, time()+7000,"/",'',false,true);
                header("location: /page");
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "Login Failed, please try again."));
                header("Location: /home.php");
            }
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Login failed."));
        }
    }

    function showUsers()
    {
        try {
            $user = $this->validateJWT($_COOKIE['jwt']);
        } catch (Exception $e) {
            http_response_code(403);
            echo json_encode(array("message" => "Bad credentials."));
            header("Location: /jogging");
        }
        try {
        $u = UserModel::findByUsername($user);
            $users = UserModel::findAll();
            require(__DIR__ . "/../view/user/listUsers.php");
        } catch (Exception $e) {
            http_response_code(403);
            echo json_encode(array("message" => "error when loading users"));
            header("Location: /jogging");
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
            $username = $this->validateJWT($_COOKIE['jwt']);
        } catch (Exception $e) {
            http_response_code(403);
            echo json_encode(array("message" => "bad credentials"));
            return;
        }
        try
    {    $userdb = UserModel::findByUsername($username);
        if (isset($_POST['alertnews'])) {
            $userdb->alert = true;
        } else {
            $userdb->alert = 0;
        }
        if ($_POST['email'] != $userdb->email || $_POST['username'] != $userdb->username) {
            $userdb->email = $_POST['email'];
            $userdb->username = $_POST['username'];
            $token = JWT::encode(array(
                "exp" => time() + 5000,
                "data" => array(
                    "username" => $_POST['username'],
                    "email" => $_POST['username']
                )
            ), "63-trUY^f4ER");
            setcookie("jwt", $token, time()+7000,"/",'',false,true);
        } 
        if($_POST['tel'] != $userdb->tel) {
            $userdb->tel =$_POST['tel'];
        }
        if($_POST['filepond'] != ""){
            $userdb->pic = json_decode($_POST['filepond'])->data;
        }
        if ($_POST['password'] != "") {
            $userdb->password = $_POST['password'];
            $userdb->update();
        } else {
            $userdb->update($userdb->password);
        }header('Location: /user/update_redirect');} catch (Exception $e) {
            echo json_encode(array("message" => $e));
        }

    }

    function encryptEmailAES($email){
        $key = hash('sha256', ",92Uh|");
        $iv = substr(hash('sha256', "xf"), 0, 16);
        $code = openssl_encrypt($email, "AES-256-CBC", $key, 0, $iv);
        return $code;
    }
    function addUserAdmin()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        try {
            $username = $this->validateJWT($_COOKIE['jwt']);
        } catch (Exception $e) {
            http_response_code(403);
            echo "bad credentials";
            return;
        }
        $user = UserModel::findByUsername($username);
        if ($user->role === "ADMIN") {
            try {
                $code = $this->encryptEmailAES($data->email);
                $to = $data->email;
                $mail = new PHPMailer(true);
                $mail->CharSet = "utf-8";
                $mail->IsSMTP();
                $mail->SMTPDebug = 0;
                $mail->SMTPAuth = true;
                $mail->SMTPSecure = 'ssl';
                $mail->Host = 'smtp.gmail.com';
                $mail->Port = 465;
                $mail->Username = "melectrail@gmail.com";
                $mail->Password = "3sJbY:5!P";
                $mail->SetFrom("melectrail@gmail.com", "Melec Trail");
                $mail->Subject = "Inscription couriraplumelec.fr";
                $mail->Body = "Bonjour,
                Voici votre code pour vous inscrire au site http://www.couriraplumelec.fr/ .
                                Email : " . $to . "
                                Code : " . $code;
                $mail->AddAddress($to);
                $mail->send();
            } catch (Exception $e) {
                http_response_code(404);
                echo json_encode(array("message" => $e));
                return;
            }
            http_response_code(200);
            echo json_encode(array("message" => "done."));
        } else {
            http_response_code(403);
            echo "bad credentials";
            return;
        }
    }

    /** 
     * Update redirect function :
     * Redirects to the update account view 
     * 
     */
    function update_redirect()
    {
        try {
            $username = $this->validateJWT($_COOKIE['jwt']);
        } catch (Exception $e) {
            http_response_code(403);
            echo json_encode(array("message" => "Bad credentials."));
            header("Location: /jogging");
        }
        try {
            $user = UserModel::findByUsername($username);
        } catch (Exception $e) {
            echo json_encode(array("message" => $e));
        }
        require $_SERVER['DOCUMENT_ROOT'] . '/view/user/update_account.php';
    }

    function delete() {
            $data = json_decode(file_get_contents("php://input"));
            try {
                $username = $this->validateJWT($_COOKIE['jwt']);
            } catch (Exception $e) {
                http_response_code(403);
                echo json_encode(array("message" => $e));
                return ;
            }
            try {
                $user2Delete = UserModel::findById($data->id);
                $user2Delete->delete();
                http_response_code(200);
                echo json_encode(array("message" => "User successfully deleted"));
            } catch (Exception $e) {
                http_response_code(404);
                echo json_encode(array("message" => $e));
                return;
            }
    }

    function logoutUser() {
        unset($_COOKIE['jwt']); 
        setcookie('jwt', null, -1, '/'); 
        header('Location: /jogging');
    }
    function updatePassword() {
        $data = json_decode(file_get_contents('php://input'));
        try {
            $username = $this->validateJWT($_COOKIE['jwt']);
            $user = UserModel::findByUsername($username);
            if($user->role !== 'ADMIN'){
                throw new Exception("Bad Credentials", 1);
            }
        } catch (Exception $e) {
            http_response_code(403);
            echo json_encode(array("message" => "Bad Credentials"));
            return ;
        }
        try{
            $user2Update = UserModel::findById($data->id);
            $user2Update->password = $data->password;
            $user2Update->update();
            http_response_code(200);
            echo json_encode(array("message" => "Password successfully updated"));
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode((array("message" => "Error.")));
        }

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
