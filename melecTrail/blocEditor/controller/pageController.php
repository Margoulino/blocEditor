<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageCategoryModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/categoryModel.php';
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

    function sortViews()
    {
        $categories = CategoryModel::findAll();
        $pageByCategory = PageCategoryModel::findAll();
        $sortedPages = array();
        foreach ($categories as $cat) {
            $sortedPages[$cat->name] = array();
            foreach ($pageByCategory as $pc) {
                if ($cat->id == $pc->idCategory) {
                    $page = PageModel::findById($pc->idPage);
                    array_push($sortedPages[$cat->name], $page->name);
                }
            }
        }
        return $sortedPages;
    }

    function index()
    {
        $pages = null;
        try {
            $pages = PageModel::findAll();
            $sortedViews = $this->sortViews();
            //echo json_encode(array("message" => $pages[0]->name));
            require(__DIR__ . '/../view/indexEditor.php');
        } catch (Exception $e) {
            echo $e;
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

    function addpage()
    {
        $data = json_decode(file_get_contents("php://input"));
        try {
            $newpage = new PageModel;
            $newpage->name=$data->name;
            PageModel::save($newpage);
            $pageCat = new PageCategoryModel;
            $pageCat->idPage=PageModel::findByname($newpage->name)[0]->id;
            $pageCat->idCategory=CategoryModel::findByname($data->category)[0]->id;
            var_dump($pageCat);
            PageCategoryModel::save($pageCat);
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array('message'=>'an error ocurred when adding the page'));
        }
        http_response_code(200);
    }
    function editPage($name)
    {
        try {
            $page = PageModel::findByname($name[0]);
            $pagePath = $this->rsearch($_SERVER['DOCUMENT_ROOT'], '/^.+\\' . $page[0]->name . '.php$/');
            $pageCode = new DOMDocument();
            libxml_use_internal_errors(true);
            $pageCode->loadHTMLFile($pagePath[0]);
            libxml_use_internal_errors(false);
            $xpath = new DomXPath($pageCode);
            $document = $pageCode->documentElement;
            $nodeList = $xpath->query("//div[@class='phpTag']");
            foreach ($nodeList as $node) {
                $node->parentNode->removeChild($node);
            }
        } catch (Exception $e) {
            http_response_code(403);
            echo $e;
        }
        http_response_code(200);
        require($_SERVER['DOCUMENT_ROOT'] . '/blocEditor/view/pageEditor.php');
    }
}
