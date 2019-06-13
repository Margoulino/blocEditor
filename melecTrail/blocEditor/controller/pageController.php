<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageCategoryModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/categoryModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/blockModel.php';
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

    public function addPage() {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        try {
            $newpage = new PageModel;
            $newpage->name=$data->name;
            $pageCat = new PageCategoryModel();
            if(count(PageModel::findByName($data->name)) == 0) {
                if(PageModel::save($newpage)) {
                    $pageCat->idPage=PageModel::findByName($newpage->name)[0]->id;
                    $pageCat->idCategory=CategoryModel::findByname($data->category)[0]->id;
                    if(PageCategoryModel::save($pageCat)) {
                        http_response_code(200);
                        echo json_encode(array("message" => "new page saved"));
                    } else {
                        throw new Exception("error while saving the category");
                        //Suppression de la page pour ne pas conserver la page sans la catégorie voulue
                        PageModel::delete(PageModel::findByName($data->name)[0]->id);
                    }
                } else {
                    throw new Exception("error while saving the page");
                }
            } else {
                throw new Exception("another page already has this name");
            }
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array('message'=> $e->getMessage()));
        }
    }

    function deletepage(){
        $data = json_decode(file_get_contents("php://input"));
        try{
            $page = PageModel::findByName($data->page);
            $category = CategoryModel::findByname($data->category);
            PageCategoryModel::delete($page[0]->id,$category[0]->id);
            PageModel::delete($page[0]->id);
            BlockModel::deleteByPageID($page[0]->id);
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array('message'=>'error'.$e));
        }
        http_response_code(200);
    }

    public function editionPage($name)
    {
        try {
            $page = PageModel::findByName($name[0]);
            if(!empty($page)) {
                $blocks = PageModel::getAllBlocksByIdPage($page[0]->id);
                $categoriesPage = PageCategoryModel::findByIdPage($page[0]->id);
                $allCategories = CategoryModel::findAll();
                require($_SERVER['DOCUMENT_ROOT'] . '/blocEditor/view/pageEdit.php');
            } else {
                throw new Exception("Page does not exists, you must create it first");
            }
        } catch(Exception $e) {
            $blocks = NULL;
            http_response_code(404);
            echo json_encode(array('message' => $e->getMessage()));
            require($_SERVER['DOCUMENT_ROOT'] . '/blocEditor/view/pageEdit.php');
        }
    }

    public function addCategory()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        try {
            $pageCat = new PageCategoryModel();
            if(!empty(PageModel::findById($data->pageId))) {
                $pageCat->idPage = $data->pageId;
                if(!empty(CategoryModel::findById($data->categoryId))) {
                    $pageCat->idCategory = $data->categoryId;
                    if(PageCategoryModel::save($pageCat)) {
                        http_response_code(200);
                        echo json_encode(array("message" => "new category added"));
                    } else {
                        throw new Exception("Error while saving the category");
                    }
                } else {
                    throw new Exception("Error category does not exists");
                }
            } else {
                throw new Exception("Error page does not exists");
            }
        } catch(Exception $e) {
            http_response_code(404);
            echo json_encode(array('message' => $e->getMessage()));
        }
    }

    public function previewPage($name)
    {
        try {
            $page = PageModel::findByName($name[0]);
            if(!empty($page)) {
                $blocks = PageModel::getAllBlocksByIdPage($page[0]->id);
                require($_SERVER['DOCUMENT_ROOT'] . '/blocEditor/view/pagePreview.php');
            } else {
                throw new Exception("Page does not exists, you must create it first");
            }
        } catch(Exception $e) {
            $blocks = NULL;
            http_response_code(404);
            echo json_encode(array('message' => $e->getMessage()));
            require($_SERVER['DOCUMENT_ROOT'] . '/blocEditor/view/pagePreview.php');
        }
    }
}
