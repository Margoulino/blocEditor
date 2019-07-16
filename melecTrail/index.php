<?php
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use \Firebase\JWT\JWT;

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

error_reporting(E_ALL);
ini_set('display_errors', 'on');
//var_dump($_GET);
if (isset($_SERVER["PATH_INFO"])) {
    $path = $_SERVER["PATH_INFO"];
    $path_split = explode('/', ltrim($path));
} else {
    $path_split = '/';
}
//var_dump($path_split);
if ($path_split === '/') {
    require_once __DIR__ . '/model/indexModel.php';
    require_once __DIR__ . '/controller/indexController.php';
    $req_model = new IndexModel();
    $req_controller = new IndexController($req_model);
    /**
     *Model and Controller assignment with first letter as UPPERCASE
     *@return Class;
     */
    $model = $req_model;
    $controller = $req_controller;
    /**
     *Creating an Instance of the  model and the controller each
     *@return Object;
     */
    $ModelObj = new $model;
    $ControllerObj = new $controller($req_model);
    /**
     *Assigning Object of Class Init to a Variable, to make it Usable
     *@return Method Name;
     */
    $req_method = "";
    $method = $req_method;
    /**
     *Check if Controller Exist is not empty, then performs an
     *action on the method;
     *@return true;
     */
    if ($req_method != '') {
        /**
         *Outputs The Required controller and the req *method respectively
         *@return Required Method;
         */
        print $ControllerObj->$method($req_param);
    } else {
        /**
         *This works in only when the Url doesnt have a parameter
         */
        print $ControllerObj->index();
    }
} else {
    // Controllers other than Index Will be handled here
    $req_controller = $path_split[1];
    /**
     *Set Required Model name
     *@return model;
     */
    $req_model = $path_split[1];
    /**
     *Set Required Method name
     *@return method;
     */
    $req_method = isset($path_split[2]) ? $path_split[2] : '';
    /**
     *Set Required Params
     *@return params;
     */
    $req_param = array_slice($path_split, 3);
    /**
     *Check if Controller Exist
     *@return void;
     */
    if ($req_controller == "page" || $req_controller == "category" || $req_controller == "block" || $req_controller == "blockType") {
        if ($req_method !== 'index' && $req_method !== '') {
            if ($req_method === 'editionPage' || $req_method === 'previewPage' || $req_method === '') {
                $jwt = $_GET['jwt'];
            } elseif($req_method === 'uploadImage' || $req_method === 'uploadFile') {
                $jwt = $_POST['jwt'];
            } else {
                $data = json_decode(file_get_contents("php://input"));
                $jwt = $data->jwt;
            }
            if(validateJWT($jwt) !== 'admin'){
                http_response_code(403);
                echo json_encode(array("message" => "bad credentials"));
                return;
            }
        }
        $req_controller_exist =  __DIR__ . '/blocEditor/controller/' . $req_controller . 'Controller.php';
        require_once __DIR__ . '/blocEditor/model/' . $req_controller . 'Model.php';
        require_once __DIR__ . '/blocEditor/controller/' . $req_controller . 'Controller.php';
        $model = ucfirst($req_controller) . 'Model';
        $controller = ucfirst($req_controller) . 'Controller';
        $ModelObj = new $model;
        $ControllerObj = new $controller(ucfirst($req_controller . 'Model'));
        $method = $req_method;
        if ($req_method != '') {
            /**
             *Outputs The Required controller and the req *method respectively
             *@return Required Method;
             */
            print $ControllerObj->$method($req_param);
        } else {
            /**
             *This works in only when the Url doesnt have a parameter
             *@return void;
             */
            print $ControllerObj->index();
        }
    } elseif ($req_controller == "nav") {
        $req_controller_exist =  __DIR__ . '/blocEditor/controller/' . $req_controller . 'Controller.php';
        require_once __DIR__ . '/blocEditor/model/' . $req_controller . 'Model.php';
        require_once __DIR__ . '/blocEditor/controller/' . $req_controller . 'Controller.php';
        $model = ucfirst($req_controller) . 'Model';
        $controller = ucfirst($req_controller) . 'Controller';
        $ModelObj = new $model;
        $ControllerObj = new $controller(ucfirst($req_controller . 'Model'));
        $method = $req_method;
        print $ControllerObj->index($method);
    } else {
        $req_controller_exists = __DIR__ . '/controller/' . $req_controller . 'Controller.php';
        if (file_exists($req_controller_exists)) {
            /**
             *Requiring all the files needed i.e The Corresponding Model and Controller
             *@return corresponding class respectively;
             */
            require_once __DIR__ . '/model/' . $req_model . 'Model.php';
            require_once __DIR__ . '/controller/' . $req_controller . 'Controller.php';
            /**
             *Model and Controller assignment with first letter as UPPERCASE
             *@return Class;
             */
            $model = ucfirst($req_model) . 'Model';
            $controller = ucfirst($req_controller) . 'Controller';
            /**
             *Creating an Instance of the the model and the controller each
             *@return Object;
             */
            $ModelObj = new $model;
            $ControllerObj = new $controller(ucfirst($req_model . 'Model'));
            /**
             *Assigning Object of Class Init to a Variable, to make it Usable
             *@return Method Name;
             */
            $method = $req_method;
            /**
             *Check if Controller Exist is not empty, then performs an
             *action on the method;
             *@return true;
             */
            if ($req_method != '') {
                /**
                 *Outputs The Required controller and the req *method respectively
                 *@return Required Method;
                 */
                print $ControllerObj->$method($req_param);
            } else {
                /**
                 *This works in only when the Url doesnt have a parameter
                 *@return void;
                 */
                print $ControllerObj->index();
            }
        } else {
            header('HTTP/1.1 404 Not Found');
            die('404 - The file was not found');
        }
    }
}
