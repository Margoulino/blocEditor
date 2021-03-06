<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageCategoryModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/categoryModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/blockModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/blockTypeModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/controller/blockController.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/controller/navController.php';
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
            require(__DIR__ . '/../view/indexEditor.php');
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function addPage()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        try {
            NavController::updateSitemap();
            $newpage = new PageModel;
            $newpage->name = $data->name;
            $pageCat = new PageCategoryModel();
            if (count(PageModel::findByName($data->name)) == 0) {
                if (PageModel::save($newpage)) {
                    $pageCat->idPage = PageModel::findByName($newpage->name)[0]->id;
                    $pageCat->idCategory = CategoryModel::findByname($data->category)[0]->id;
                    if (PageCategoryModel::save($pageCat)) {
                        NavController::updateSitemap();
                        $data = array();
                        $data['id'] = '1';
                        $data['name'] = $newpage->name . '_1';
                        $data['content'] = '';
                        $data['pageId'] = PageModel::findByName($newpage->name)[0]->id;
                        $data['orderBlock'] = null;
                        $data['idBlockType'] = '8';
                        $data['styleBlock'] = null;
                        $data['idParent'] = null;
                        $data['idColumn'] = null;
                        $data['dateCreation'] = null;

                        $banner = new BlockModel($data);
                        BlockModel::save($banner);
                        http_response_code(200);
                        echo json_encode(array("message" => "new page saved"));
                    } else {
                        throw new Exception("error while saving the category");
                        //Suppression de la page pour ne pas conserver la page sans la catégorie voulue
                        PageModel::delete(PageModel::findByName($data->name)[0]->id);
                        NavController::updateSitemap();
                    }
                } else {
                    throw new Exception("error while saving the page");
                }
            } else {
                throw new Exception("another page already has this name");
            }
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array('message' => $e->getMessage()));
        }
    }

    function deletepage()
    {
        $data = json_decode(file_get_contents("php://input"));
        try {
            $page = PageModel::findByName($data->page);
            $category = CategoryModel::findByname($data->category);
            PageCategoryModel::delete($page[0]->id, $category[0]->id);
            PageModel::delete($page[0]->id);
            BlockModel::deleteByPageID($page[0]->id);
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array('message' => 'error' . $e));
        }
        NavController::updateSitemap();
        http_response_code(200);
    }

    public function editionPage($name)
    {
        try {
            $page = PageModel::findByName($name[0]);
            if (!empty($page)) {
                $blocks = PageModel::getAllBlocksByIdPage($page[0]->id);
                $categJs = array();
                $categHTML = array();
                $subLevel = array();
                $categoriesPage = PageCategoryModel::findByIdPage($page[0]->id);
                $allCategories = CategoryModel::findAll();
                foreach ($blocks as $block) {
                    if (!array_key_exists($block->idBlockType, $categJs)) {
                        $blockType = BlockTypeModel::findById($block->idBlockType);
                        $categJs[$block->idBlockType] = $blockType[0]->js;
                        $categHTML[$block->idBlockType] = $blockType[0]->templateBlock;
                        $subLevel[$block->idBlockType] = $blockType[0]->subLevels;
                    }
                }
                $jsFile = $_SERVER['DOCUMENT_ROOT'] . "/blocEditor/js/blockInit.js";
                $fileHandler = fopen($jsFile, 'w');
                fwrite($fileHandler, "$(document).ready(function () {");
                fclose($fileHandler);
                $fileHandler = fopen($jsFile, 'a');
                foreach ($categJs as $js) {
                    fwrite($fileHandler, $js);
                }
                fwrite($fileHandler, "});");
                fclose($fileHandler);
                foreach ($blocks as $block) {
                    if ($block->idParent === null) {
                        if ($block->idBlockType === '1' || $block->idBlockType === '2') {
                            $block->content = BlockController::setColumnChildsEdit($block, $categHTML, 0);
                        } else if ($block->idBlockType === '3' || $block->idBlockType === '6') {
                            $block->content = BlockController::buildCarouselAndGallery($block, $categHTML);
                        }
                    }
                }
                require($_SERVER['DOCUMENT_ROOT'] . '/blocEditor/view/pageEdit.php');
            } else {
                throw new Exception("Page does not exists, you must create it first");
            }
        } catch (Exception $e) {
            echo json_encode(array("message" => $e));
        }
    }



    public function addCategory()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        try {
            $pageCat = new PageCategoryModel();
            if (!empty(PageModel::findById($data->pageId))) {
                $pageCat->idPage = $data->pageId;
                if (!empty(CategoryModel::findById($data->categoryId))) {
                    $pageCat->idCategory = $data->categoryId;
                    if (PageCategoryModel::save($pageCat)) {
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
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array('message' => $e->getMessage()));
        }
    }

    public function removeCategory()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        try {
            if (!empty(PageModel::findById($data->pageId))) {
                if (!empty(CategoryModel::findById($data->categoryId))) {
                    if (!(count(PageCategoryModel::findByIdPage($data->pageId)) < 2)) {
                        PageCategoryModel::delete($data->pageId, $data->categoryId);
                        NavController::updateSitemap();
                        http_response_code(200);
                        echo json_encode(array("message" => "category removed from page"));
                    } else {
                        throw new Exception("Error a page needs at least one category");
                    }
                } else {
                    throw new Exception("Error category does not exists");
                }
            } else {
                throw new Exception("Error page does not exists");
            }
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array('message' => $e->getMessage()));
        }
    }

    public static function previewPage($name, $nav = null)
    {
        try {
            $page = PageModel::findByName($name[0]);
            if (!empty($page)) {
                $blocks = PageModel::getAllBlocksByIdPage($page[0]->id);
                $categJs = array();
                $categHTML = array();
                foreach ($blocks as $block) {
                    if (!array_key_exists($block->idBlockType, $categJs)) {
                        if ($block->idBlockType !== '1' && $block->idBlockType !== '2') {
                            $blockType = BlockTypeModel::findById($block->idBlockType);
                            $categJs[$block->idBlockType] = $blockType[0]->js;
                            $categHTML[$block->idBlockType] = $blockType[0]->templateBlock;
                            $subLevel[$block->idBlockType] = $blockType[0]->subLevels;
                        } else {
                            $blockType = BlockTypeModel::findById($block->idBlockType);
                            $categHTML[$block->idBlockType] = $blockType[0]->templateBlock;
                            $subLevel[$block->idBlockType] = $blockType[0]->subLevels;
                        }
                    }
                }
                $userRole = PageController::validateJWT($_COOKIE['jwt']);
                $header = BlockController::buildHeader(BlockTypeModel::findById(7)[0]->templateBlock);
                $jsFile = $_SERVER['DOCUMENT_ROOT'] . "/blocEditor/js/blockInit.js";
                $fileHandler = fopen($jsFile, 'w');
                fwrite($fileHandler, "$(document).ready(function () {");
                fclose($fileHandler);
                $fileHandler = fopen($jsFile, 'a');
                foreach ($categJs as $js) {
                    fwrite($fileHandler, $js);
                }
                fwrite($fileHandler, "});");
                fclose($fileHandler);
                foreach ($blocks as $block) {
                    if ($block->idParent === null) {
                        if ($block->idBlockType === '1' || $block->idBlockType === '2') {
                            $block->content = BlockController::setColumnChildsNav($block, $categHTML, 0);
                        } else if ($block->idBlockType === '3' || $block->idBlockType === '6') {
                            $block->content = BlockController::buildCarouselAndGallery($block, $categHTML);
                        }
                    }
                    if ($block->idBlockType === '8') {
                        $bannerBg = $block;
                    }
                }
                require($_SERVER['DOCUMENT_ROOT'] . '/blocEditor/view/preview/pagePreviewNew.php');
            } else {
                throw new Exception("Page does not exists, you must create it first");
            }
        } catch (Exception $e) {
            echo json_encode(array("message" => $e->getMessage()));
        }
    }

    public function publishPage()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        $page = PageModel::findById($data->pageId);
        try {
            if (!empty($page)) {
                $page->publish();
                NavController::updateSitemap();
                http_response_code(200);
                echo json_encode(array("message" => "page successfully published"));
            } else {
                throw new Exception("Page does not exists, can't publish");
            }
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => $e->getMessage()));
        }
    }

    public function depublishPage()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        $page = PageModel::findById($data->pageId);
        try {
            if (!empty($page)) {
                $page->depublish();
                NavController::updateSitemap();
                http_response_code(200);
                echo json_encode(array("message" => "page successfully published"));
            } else {
                throw new Exception("Page does not exists, can't depublish");
            }
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => $e->getMessage()));
        }
    }

    public function changeDescription()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        $page = PageModel::findById($data->pageId);
        try {
            if (!empty($page)) {
                PageModel::setDescription($data->pageId, $data->description);
                http_response_code(200);
                echo json_encode(array("message" => "description successfully changed"));
            } else {
                throw new Exception("Page does not exists, can't change description");
            }
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => $e->getMessage()));
        }
    }

    public function changeKeywords()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        $page = PageModel::findById($data->pageId);
        try {
            if (!empty($page)) {
                PageModel::setKeywords($data->pageId, $data->keywords);
                http_response_code(200);
                echo json_encode(array("message" => "keywords successfully changed"));
            } else {
                throw new Exception("Page does not exists, can't change keywords");
            }
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => $e->getMessage()));
        }
    }

    public function changeNameCompletion()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        $page = PageModel::findById($data->pageId);
        try {
            if (!empty($page)) {
                PageModel::setNameCompletion($data->pageId, $data->nameCompletion);
                http_response_code(200);
                echo json_encode(array("message" => "nameCompletion successfully changed"));
            } else {
                throw new Exception("Page does not exists, can't change keywords");
            }
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => $e->getMessage()));
        }
    }
    public static function validateJWT($jwt)
    {
        try {
            if ($decoded = JWT::decode($jwt, "63-trUY^f4ER", array('HS256'))) {
                return $decoded->data->role;
            }
        } catch (\Firebase\JWT\ExpiredException $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n";
            echo '<script>window.alert("Votre session est expirée, veuillez vous reconnecter.");window.location.href="/";</script>';
        }
    }
}
