<?php


require_once __DIR__ . '/../model/joggingModel.php';
require_once __DIR__ . '/../model/userModel.php';

require __DIR__ . '/../vendor/autoload.php';

use \Firebase\JWT\JWT;
use PHPMailer\PHPMailer\PHPMailer;
//use PHPMailer\PHPMailer\Exception;

class JoggingController
{
    /** 
     * Set header function :
     * Sets HTTP headers 
     * 
     */
    function setHeader()
    {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Max-Age: 3600");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    }

    /** 
     * New jogging function :
     * Creates a jogging with the given form 
     * 
     */
    function newJogging()
    {
        $data = json_decode(file_get_contents("php://input"));
        try {
            $creator = $this->validateJWT($_COOKIE['jwt']);
        } catch (Exception $e) {
            http_response_code(403);
            echo "bad credentials";
            return;
        }
        try {
            setlocale(LC_TIME, 'fr', 'fr_FR', 'fr_FR.ISO8859-1');
            $jogging = new JoggingModel();
            $jogging->creator = $creator;
            $jogging->departure = $data->departure;
            $jogging->date = date("Y-m-d", strtotime($data->date));
            $jogging->description = $data->description;
            $jogging->type = $data->type;
            JoggingModel::save($jogging);
            $jogUser = new JogUserModel();
            $newUser = UserModel::findByUsername($jogging->creator);
            var_dump($newUser);
            $jogUser->idUser = $newUser->id;
            $jogsFromCreator = JoggingModel::findByCreator($jogging->creator);
            $jogUser->idJog = end($jogsFromCreator)->id;
            JogUserModel::save($jogUser);
            $users = UserModel::findAll();
            foreach ($users as $user) {
                if ($user['alert'] === '1') {
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
                    $mail->Subject = "Alerte Courir à Plumelec";
                    $mail->Body = 'Bonjour,' . "\n\n" .
                        'Une nouvelle sortie a été publiée par ' . $creator . "\n\n" .
                        "Date de la sortie : " . strftime("%A %d %B %Y", strtotime($jogging->date)) . "\n\n" .
                        "Lieu de Départ : " . $jogging->departure . "\n\n" .
                        "Description : " . $jogging->description;
                    $mail->AddAddress($user['email']);
                    $mail->send();
                }
            }
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => $e));
            return;
        }
        http_response_code(200);
        echo json_encode(array("message" => "Jogging successfully created."));
    }

    /** 
     * Index function :
     * Selects all the existing joggings and displays them
     * 
     */
    function index()
    {
        // try {
        //     $username = $this->validateJWT($_COOKIE['jwt']);
        // } catch (Exception $e) {
        //     http_response_code(403);
        //     echo json_encode(array("message" => "bad credentials"));
        //     header("Location: /");
        //     return;
        // }
        try {
            //header("Content-type: image/gif");
            // $tab_jog = JoggingModel::findAll();
            // $current_date = new DateTime(date('Y-m-d'));
            // foreach ($tab_jog as $j) {
            //     $jDate = new DateTime($j["date"]);
            //     $inter = $jDate->diff($current_date);
            //     if ($inter->d > 2 && $jDate < $current_date) {
            //         JoggingModel::delete($j["id"]);
            //     }
            // }
            // $tab_jog = JoggingModel::findAll();
            require(__DIR__ . '/../view/jogging/indexJog.php');
        } catch (Exception $e) {
            echo json_encode(array("message" => "error while loading index."));
        }
    }

    /** 
     * Add jogger function :
     * Adds a jogger to a jogging
     * 
     */
    function addJogger()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        try {
            $user = $this->validateJWT($_COOKIE['jwt']);
        } catch (Exception $e) {
            http_response_code(403);
            echo "bad credentials";
            return;
        }
        try {
            $jogUser = JogUserModel::findByIdJog($data->idJogging);
            foreach ($jogUser as $ju) {
                $u = UserModel::findById($ju->idUser);
                if ($u->username === $user) {
                    http_response_code(412);
                    echo json_encode(array("message" => "Jogger already participating."));
                    return;
                }
            }
            $newJogUser = new JogUserModel();
            $newJogUser->idJog = $data->idJogging;
            $u = UserModel::findByUsername($user);
            $newJogUser->idUser = $u->id;
            JogUserModel::save($newJogUser);
            http_response_code(200);
            echo json_encode(array("message" => "Jogger successfully added."));
        } catch (Exception $e) {
            echo json_encode(array("message" => $e));
        }
    }

    function unparticipate()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        try {
            $user = $this->validateJWT($_COOKIE['jwt']);
        } catch (Exception $e) {
            http_response_code(403);
            echo "bad credentials";
            return;
        }
        $u = UserModel::findByUsername($user);
        JogUserModel::delete($data->id,$u->id);
        http_response_code(200);
        echo json_encode(array("message" => "Jogger successfully deleted."));
    }

    function modifyJog()
    {
        try {
            $user = $this->validateJWT($_COOKIE['jwt']);
        } catch (Exception $e) {
            http_response_code(403);
            echo json_encode(array("message" => "bad credentials."));
        }
        try {
            $jog = JoggingModel::findById($_POST["id"]);
            if ($jog->creator != $user) {
                http_response_code(412);
                echo json_encode(array("message" => "bad credentials."));
                header("Location: /jogging/");
            } else {
                $jog->departure = $_POST["departure"];
                $jog->date = $_POST["date"];
                $jog->description = $_POST["description"];
                $jog->update();
                header("Location: /jogging/");
            }
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => $e));
        }
    }

    function deleteJog()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        try {
            $user = $this->validateJWT($_COOKIE['jwt']);
        } catch (Exception $e) {
            http_response_code(403);
            echo json_encode(array("message" => "bad credentials."));
            return;
        }
        try {
            if (JoggingModel::findById($data->id)->creator != $user) {
                http_response_code(412);
                echo json_encode(array("message" => "bad credentials."));
            } else {
                JoggingModel::delete($data->id);
                JogUserModel::deleteByIdJog($data->id);
                http_response_code(200);
                echo json_encode(array("message" => "Jogging successfully deleted."));
            }
        } catch (Exception $e) {
            echo json_encode(array("message" => $e));
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
}
