<?php

use PHPMailer\PHPMailer\Exception;

require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/blockModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/categoryModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageCategoryModel.php';
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

class BlockController
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

    /**
     * Adds a block to an existing page(?)
     */
    public function addBlockToPage()
    {
        try {
            $this->setHeader();
            $data = json_decode(file_get_contents("php://input"));
            $block = new BlockModel();
            $block->name = $data->name;
            if (isset($data->content)) {
                $block->content = $data->content;
            } else {
                $block->content = "";
            }
            $block->pageId = $data->pageId;

            $maxOrderBlock = BlockModel::getMaxOrderBlock($data->pageId);
            if($data->orderBlock <= $maxOrderBlock) {
                $block->orderBlock = $maxOrderBlock[0]["MAX(orderBlock)"] + 1;
            } else {
                $block->orderBlock = $data->orderBlock;
            }

            $block->idBlockType = $data->idBlockType;
            if (isset($data->idParent)) {
                $block->idParent = $data->idParent;
            } else {
                $block->idParent = null;
            }
            if (isset($data->idColumn)) {
                $block->idColumn = $data->idColumn;
            } else {
                $block->idColumn = null;
            }
            if (isset($data->styleBlock)) {
                $block->styleBlock = $data->styleBlock;
            } else {
                $block->styleBlock = null;
            }
            $targetPage = PageModel::findById($data->pageId);
            if (empty($targetPage)) {
                http_response_code(404);
                echo json_encode(array("message" => "The page you are trying to add a block on does not exists. Block not added to base."));
            } else {
                BlockModel::save($block);
                $id = BlockModel::findByName($block->name)[0]->id;
                http_response_code(200);
                echo json_encode(array(
                    "message" => "Block succesfully added to base",
                    "id" => $id
                ));
            }
        } catch (Exception $e) {
            http_response_code(412);
            echo json_encode(array("message" => $e));
        }
    }

    public function addBlockToBlock()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        $block = new BlockModel();
        $block->name = $data->name;
        $block->content = $data->content;
        $block->pageId = $data->pageId;
        $block->orderBlock = $data->orderBlock;
        $block->idBlockType = $data->idBlockType;
        $block->idParent = $data->idParent;
        $block->idColumn = $data->idColumn;
        $block->styleBlock = $data->styleBlock;
        $targetBlock = BlockModel::findById($data->idParent);
        if (!empty($targetBlock)) {
            $targetPage = PageModel::findById($data->pageId);
            if (!empty($targetPage)) {
                BlockModel::saveIntoBlock($block);
                http_response_code(200);
                echo json_encode(array(
                    "message" => "Block successfully added to base"
                ));
            } else {
                http_response_code(404);
                echo json_encode(array(
                    "message" => "The page you are trying to add a block on does not exists"
                ));
            }
        } else {
            http_response_code(404);
            echo json_encode(array(
                "message" => "The block you are trying to add a block in does not exists"
            ));
        }
    }

    /**
     * Removes a block from db/page and his children if there are some
     */
    public function deleteBlock($id = null)
    {
        if ($id == null) {
            $data = json_decode(file_get_contents("php://input"));
            $id = $data->id;
        } else {
            $id = $id[0];
        }
        $blockToDelete = BlockModel::findById($id);
        if (count($blockToDelete) == 0) {
            http_response_code(404);
            echo json_encode(array("message" => "Block not found, can't be deleted"));
            return;
        } else {
            try {
                $childrenBlock = BlockModel::findChildren($id);
                if (count($childrenBlock) != 0) {
                    foreach ($childrenBlock as $child) {
                        if (count(BlockModel::findChildren($child->id)) > 0) {
                            BlockModel::deleteBlockAndChildren($child->id);
                        }
                    }
                    BlockModel::deleteBlockAndChildren($id);
                    http_response_code(200);
                    echo json_encode(array("message" => "Block and children block associated successfully deleted"));
                } else {
                    BlockModel::delete($id);
                }
                $blocks = BlockModel::findByIdPage($blockToDelete[0]->pageId);
                foreach ($blocks as $b) {
                    if ($b->orderBlock > $blockToDelete[0]->orderBlock && $blockToDelete[0]->orderBlock !== null) {
                        --$b->orderBlock;
                        $b->update();
                    }
                }
                http_response_code(200);
                echo json_encode(array("message" => "Block successfully deleted"));
            } catch (Exception $e) {
                http_response_code(404);
                echo json_encode(array("message" => "an error occured."));
            }
        }
    }

    /**
     * Updates a block in a page/in DB
     */
    public function updateBlock()
    {
        try {
            $this->setHeader();
            $data  = json_decode(file_get_contents("php://input"));
            $block = BlockModel::findById($data->id);
            if (count($block) == 0) {
                http_response_code(404);
                echo json_encode(array("message" => "Block not found, can't be updated."));
            } else {
                $block = $block[0];
                if (isset($data->name)) {
                    $block->name = $data->name;
                }
                if (isset($data->content)) {
                    $block->content = $data->content;
                }
                if (isset($data->pageId)) {
                    $block->pageId = $data->pageId;
                }
                if (isset($data->orderBlock)) {
                    $block->orderBlock = $data->orderBlock;
                }
                if (isset($data->idBlockType)) {
                    $block->idBlockType = $data->idBlockType;
                }
                if (isset($data->idParent)) {
                    $block->idParent = $data->idParent;
                }
                if (isset($data->idColumn)) {
                    $block->idColumn = $data->idColumn;
                }
                if (isset($data->style)) {
                    $block->styleBlock = $data->style;
                }
                $targetPage = PageModel::findByid($data->pageId);
                if (empty($targetPage)) {
                    http_response_code(404);
                    echo json_encode(array("message" => "The page you are trying to update a block on does not exists. Block not updated to base."));
                } else {
                    $block->update();
                    http_response_code(200);
                    echo json_encode(array("message" => "Block successfully updated"));
                }
            }
        } catch (Exception $e) {
            http_response_code(404);
            json_encode(array("message" => $e));
        }
    }

    public function uploadImage()
    {
        $storeFolder = $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/asset/img/';
        if (!empty($_FILES)) {
            try {

                $tempFile = $_FILES['file']['tmp_name'];
                $targetFile =  $storeFolder . $_FILES['file']['name'];
                move_uploaded_file($tempFile, $targetFile);

                header('Content-type: application/json');
                echo json_encode(['target_file' => $_FILES['file']['name']]);
            } catch (Exception $e) {
                echo json_encode(array("message" => $e));
            }
        }
    }

    public function uploadFile()
    {
        $storeFolder = $_SERVER["DOCUMENT_ROOT"] . "/blocEditor/asset/files/";
        if (!empty($_FILES)) {
            try {
                $tempFile = $_FILES['file']['tmp_name'];
                $targetFile =  $storeFolder . $_FILES['file']['name'];
                move_uploaded_file($tempFile, $targetFile);
                header('Content-type: application/json');
                echo json_encode(['target_file' => $_FILES['file']['name']]);
            } catch (Exception $e) {
                echo json_encode(array("message" => $e));
            }
        }
    }

    public function removeImage()
    {
        $this->setHeader();
        $data  = json_decode(file_get_contents("php://input"));
        $imgName = explode("/", $data->path);
        $imgName = end($imgName);
        $storeFolder = $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/asset/img/';
        if (file_exists($storeFolder . $imgName)) {
            unlink($storeFolder . $imgName);
            http_response_code(200);
            echo json_encode(array("message" => "image deleted successfull"));
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "image not found, couldn't remove", "path" => $storeFolder . $imgName));
        }
    }

    public static function setColumnChilds($node, $categHTML, $level)
    {
        $childs = BlockModel::findChildren($node->id);
        $result = $categHTML[$node->idBlockType];
        for ($i = 1; $i <= 3; $i++) {
            $result = str_replace('{col' . $i . '}', '{col' . $level . '.' . $i . '}', $result);
        }
        foreach ($childs as $child) {
            if ($child->idBlockType === '5') {
                $oldVar = array('{$block->content}', '{$block->style}', '{$block->id}');
                $newVar = array($child->content, $child->styleBlock, $child->id);
                $result = str_replace(
                    '{col' . $level . '.' . $child->idColumn . '}',
                    "<div class='block-unit' id='" . $child->id . "'><button class='btn-xs btn btn-danger deleteBlock float-right'><i class='float-right fas fa-times'></i></button><button class='btn-xs btn btn-info editBlock float-right'><i class='fas fa-edit'></i></button>" . str_replace($oldVar, $newVar, $categHTML[$child->idBlockType]) . "</div>",
                    $result
                );
            } elseif ($child->idBlockType === '4') {
                $oldVar = array('{$block->content}', '{$block->style}', '{$block->id}');
                $newVar = array($child->content, $child->styleBlock, $child->id);
                $result = str_replace(
                    '{col' . $level . '.' . $child->idColumn . '}',
                    "<div class='block-unit' id='" . $child->id . "'><button class='btn btn-xs btn-info resizebtn float-right'><i class='fas fa-expand-arrows-alt'></i></button><button class='btn-xs btn btn-danger deleteBlock float-right'><i class='float-right fas fa-times'></i></button>" . str_replace($oldVar, $newVar, $categHTML[$child->idBlockType]) . "</div>",
                    $result
                );
            } elseif ($child->idBlockType === '3' || $child->idBlockType === '6') {
                $result = str_replace(
                    '{col' .  $level . '.' . $child->idColumn . '}',
                    "<div class='block-unit-complex' id='" . $child->id . "'><button class='btn-xs btn btn-danger deleteBlock float-right'><i class='float-right fas fa-times'></i></button>" . BlockController::buildCarouselAndGallery($child, $categHTML) . "<button class='btn btn-outline-info contentSlider'>Ajouter/Supprimer une image</button></div>",
                    $result
                );
            } else {
                $result = str_replace(
                    '{col' . $level . '.' . $child->idColumn . '}',
                    "<div class='block-unit-complex' id='" . $child->id . "'><button class='btn-xs btn btn-danger deleteBlock float-right'><i class='float-right fas fa-times'></i></button>" . BlockController::setColumnChilds($child, $categHTML, $level + 1) . "</div>",
                    $result
                );
            }
        }
        return $result;
    }

    public static function buildCarouselAndGallery($block, $templateHTML)
    {
        $multiplyStr = BlockController::get_string_between($templateHTML[$block->idBlockType], '[tag]', '[/tag]');
        $listImg = explode(" ; ", $block->content);
        $multipliedStr = array();
        if ($block->idParent !== null) {
            foreach ($listImg as $img) {
                array_push($multipliedStr, str_replace(array('{$block->content}', '{gallery}','{$block->colStyle}'), array($img, $block->id,'col-4'), $multiplyStr));
            }
        } else { 
            foreach ($listImg as $img) {
                array_push($multipliedStr, str_replace(array('{$block->content}', '{gallery}','{$block->colStyle}'), array($img, $block->id,'col-2'), $multiplyStr));
            }
        }
        return str_replace('[tag]' . BlockController::get_string_between($templateHTML[$block->idBlockType], '[tag]', '[/tag]') . '[/tag]', implode("", $multipliedStr), $templateHTML[$block->idBlockType]);
    }

    public static function buildHeader($templateHTML)
    {
        $categories = CategoryModel::findAll();
        $pageTemplate = BlockController::get_string_between($templateHTML, '[page]', '[/page]');
        $categTemplate = BlockController::get_string_between($templateHTML, '[cat]', '[/cat]');
        $categArray = array();
        foreach ($categories as $c) {
            $pagesCateg = PageCategoryModel::findByIdCategory($c->id);
            $pageArray = array();
            foreach ($pagesCateg as $pc) {
                $page = PageModel::findById($pc->idPage);
                if ($page->public === '1') {
                    array_push($pageArray, str_replace('{$page->name}', $page->name, $pageTemplate));
                }
            }
            if (count($pageArray) > 0) {
                $categHTML = str_replace('[page]' . BlockController::get_string_between($templateHTML, '[page]', '[/page]') . '[/page]', implode("", $pageArray), BlockController::get_string_between($templateHTML, '[cat]', '[/cat]'));
                $categHTML  = str_replace('{$category->name}', $c->name, $categHTML);
                array_push($categArray, $categHTML);
            }
        }
        return str_replace('[cat]' . $categTemplate . '[/cat]', implode("", $categArray), $templateHTML);
    }

    public static function get_string_between(
        $string,
        $start,
        $end
    ) {
        $string = ' ' . $string;
        $ini = strpos($string, $start);
        if ($ini == 0) return '';
        $ini += strlen($start);
        $len = strpos($string, $end, $ini) - $ini;
        return substr($string, $ini, $len);
    }
}
