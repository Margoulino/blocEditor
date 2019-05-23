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
        try {
            $this->setHeader();
            $data = json_decode(file_get_contents("php://input"));
            PageModel::emptyTable();
            for ($i = 0; $i < count($data->name); $i++) {

                $page = new PageModel();
                $page->id = $data->id[$i];
                $page->name = $data->name[$i];
                $page->parentId = $data->parent[$i];
                PageModel::save($page);
            }
        } catch (Exception $e) {
            http_response_code(418);
            echo json_encode(array("message" => $e));
        }

        http_response_code(200);
        echo json_encode(array("Message" => "arborescence construite"));
    }

    function buildTree(array $elements, $parentId = 0)
    {
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

            require(__DIR__ . '/../view/indexEditor.php');
        } catch (Exception $e) {
            echo e;
        }
    }

    function rsearch($folder, $pattern)
    {
        $dir = new RecursiveDirectoryIterator($folder);
        $ite = new RecursiveIteratorIterator($dir);
        $files = new RegexIterator($ite, $pattern, RegexIterator::GET_MATCH);
        $fileList = array();
        foreach ($files as $file) {
            $fileList = array_merge($fileList, $file);
        }
        return $fileList;
    }

    function editPage()
    {
        $data = json_decode(file_get_contents("php://input"));
        try {
            $page = PageModel::findById($data->id);
            $pagePath = $this->rsearch($_SERVER['DOCUMENT_ROOT'],'/^.+\\'.$page->name.'.php$/');
        } catch (Exception $e) {
            http_response_code(403);
            echo $e;
        }
        http_response_code(200);
        require($_SERVER['DOCUMENT_ROOT'] . '/blocEditor/view/pageEditor.php');
    }
}
