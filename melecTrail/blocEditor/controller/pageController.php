<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageModel.php';
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';
use \Firebase\JWT\JWT;

class PageController
{
    /** 
     * Set header function :
     * Sets HTTP headers 
     * 
     */
    public function setHeader()
    {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Max-Age: 3600");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    }

    function setTree()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        // try {
        //     $user = $this->validateJWT($data->jwt);
        // } catch (Exception $e) {
        //     http_response_code(403);
        //     echo "bad credentials";
        //     return;
        // }
        try {
            for ($i = 0; $i < count($data->name); $i++) {
                $page = new PageModel();
                $page->name = $data->name[$i];
                $page->parentId = $data->parent[$i];
                PageModel::save($page);
            }
        } catch (Exception $e) {
            http_response_code(418);
            echo json_encode(array("message" => $e));
        }
    }

    function buildTree(array $elements, $parentId = 0) {
        $branch = array();
    
        foreach ($elements as $element) {
            if ($element['parentId'] == $parentId) {
                $children = $this->buildTree($elements, $element['id']);
                if ($children) {
                    $element['children'] = $children;
                }
                $branch[] = $element;
            }
        }
    
        return $branch;
    }

    function index()
    {
        $pages = null;
        try {
            $pages = PageModel::findAll();
            $treePages = $this->buildTree($pages);
            //echo json_encode(array("message" => $pages[0]->name));
            
            require(__DIR__ . '/../view/editorView.php');
        } catch (Exception $e) {
            echo e;
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
