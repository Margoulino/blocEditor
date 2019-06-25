<?php


require_once $_SERVER['DOCUMENT_ROOT'] . '/model/joggingModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/model/UserModel.php';
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';
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
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        try {
            $creator = $this->validateJWT($data->jwt);
        } catch (Exception $e) {
            http_response_code(403);
            echo "bad credentials";
            return;
        }
        try {
            $jogging = new JoggingModel();
            $jogging->creator = $creator;
            $jogging->departure = $data->departure;
            $jogging->date = date("Y-m-d", strtotime($data->date));
            $jogging->description = $data->description;
            $joggers = array();
            array_push($joggers, $jogging->creator);
            $jogging->attendees = implode("", $joggers);
            JoggingModel::save($jogging);
            $users = UserModel::findAll();
            foreach ($users as $user) {
                if ($user['alert'] === '1') {
                    $mail = new PHPMailer(true);
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
                        "Date de la sortie : " . $jogging->date . "\n\n" .
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
        try {
            $tab_jog = JoggingModel::findAll();
            require(__DIR__ . '/../view/jogging/indexJog.php');
        } catch (Exception $e) {
            echo e;
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
            $user = $this->validateJWT($data->jwt);
        } catch (Exception $e) {
            http_response_code(403);
            echo "bad credentials";
            return;
        }
        try {
            $jogging = JoggingModel::findById($data->idJogging);
            $joggers = explode(" ; ", $jogging->attendees);
            if (in_array($user, $joggers)) {
                http_response_code(412);
                echo json_encode(array("message" => "Jogger already participating."));
            } else if (count($joggers) > 25) {
                http_response_code(418);
                echo json_encode(array("message" => "Joggers already full."));
            } else {
                array_push($joggers, $user);
                $jogging->attendees = implode(" ; ", $joggers);
                $jogging->update();
                http_response_code(200);
                echo json_encode(array("message" => "Jogger successfully added."));
            }
        } catch (Exception $e) {
            echo json_encode(array("message" => $e));
        }
    }

    function unparticipate()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        try {
            $user = $this->validateJWT($data->jwt);
        } catch (Exception $e) {
            http_response_code(403);
            echo "bad credentials";
            return;
        }
        $jog = JoggingModel::findById($data->id);
        $attendees = explode(" ; ", $jog->attendees);
        $newAttendees = array_diff($attendees, array($user));
        $jog->attendees = implode(" ; ", $newAttendees);
        $jog->update();
        http_response_code(200);
        echo json_encode(array("message" => "Jogger successfully deleted."));
    }

    function getJogsByCreator($jwt = null)
    {
        try {
            if (empty($jwt)) {
                $jwt = $_POST['jwt'];
            } else {
                $jwt = $jwt[0];
            }
            $user = $this->validateJWT($jwt);
        } catch (Exception $e) {
            http_response_code(403);
            echo json_encode(array("message" => "Bad credentials."));
            header("Location: /jogging");
            return ;
        }
        $jogsCreated = JoggingModel::findByCreator($user);
        $jogs = JoggingModel::findAll();
        $jogsParticipate = array();
        foreach ($jogs as $j) {
            if (in_array($user, array_slice(explode(' ; ', $j["attendees"]), 1))) {
                array_push($jogsParticipate, $j);
            }
        }
        require(__DIR__ . '/../view/jogging/myJogs.php');
    }

    function modifyJog()
    {
        try {
            $user = $this->validateJWT($_POST["jwt"]);
        } catch (Exception $e) {
            http_response_code(403);
            echo json_encode(array("message" => "bad credentials."));
        }
        try {
            $jog = JoggingModel::findById($_POST["id"]);
            if ($jog->creator != $user) {
                http_response_code(412);
                echo json_encode(array("message" => "bad credentials."));
                header("Location: /jogging/getJogsByCreator/" . $_POST['jwt']);
            } else {
                $jog->departure = $_POST["departure"];
                $jog->date = $_POST["date"];
                $jog->description = $_POST["description"];
                $jog->update();
                header("Location: /jogging/getJogsByCreator/" . $_POST['jwt']);
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
            $user = $this->validateJWT($data->jwt);
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
