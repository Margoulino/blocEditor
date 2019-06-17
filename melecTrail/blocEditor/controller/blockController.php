<?php
use PHPMailer\PHPMailer\Exception;

require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/blockModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageModel.php';

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
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        $block = new BlockModel();
        $block->name = $data->name;
        $block->content = $data->content;
        $block->pageId = $data->pageId;
        $block->orderBlock = $data->orderBlock;
        $block->idBlockType = $data->idBlockType;
        $block->styleBlock = $data->styleBlock;
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
                    BlockModel::deleteBlockAndChildren($id);
                    http_response_code(200);
                    echo json_encode(array("message" => "Block and children block associated successfully deleted"));
                } else {
                    BlockModel::delete($id);
                    http_response_code(200);
                    echo json_encode(array("message" => "Block successfully deleted"));
                }
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
        $this->setHeader();
        $data  = json_decode(file_get_contents("php://input"));
        $blockToUpdate = BlockModel::findById($data->id);
        if (count($blockToUpdate) == 0) {
            http_response_code(404);
            echo json_encode(array("message" => "Block not found, can't be updated."));
        } else {
            $block = new BlockModel();
            $block->id = $data->id;
            $block->name = $data->name;
            $block->content = $data->content;
            $block->pageId = $data->pageId;
            $block->orderBlock = $data->orderBlock;
            $block->idBlockType = $data->idBlockType;
            $block->idParent = $data->idParent;
            $block->idColumn = $data->idColumn;
            $block->styleBlock = $data->styleBlock;
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
    }

    public function uploadImage()
    {
        $storeFolder = $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/img/';
        if (!empty($_FILES)) {
            try {

                $tempFile = $_FILES['file']['tmp_name'];
                $targetFile =  $storeFolder . $_FILES['file']['name'];
                move_uploaded_file($tempFile, $targetFile);

                header('Content-type: application/json');
                echo json_encode(['target_file' => $_FILES['file']['name']]);
            } catch (Exception $e) {
                echo $e;
            }
        }
    }

    public function addBlockToColumn()
    {
        $data  = json_decode(file_get_contents("php://input"));
        try {
            $blockToUpdate = BlockModel::findById($data->id);
            if ($blockToUpdate[0]->innerBlocks == "") {
                $inner = json_decode("{}");
            } else {
                $inner = json_decode($blockToUpdate[0]->innerBlocks);
            }
            switch ($data->colPosition) {
                case 1:
                    $inner->{'1'} = $data->toAddId;
                    break;
                case 2:
                    $inner->{'2'} = $data->toAddId;
                    break;
                case 3:
                    $inner->{'3'} = $data->toAddId;
                    break;
            }
            $blockToUpdate[0]->innerBlocks = json_encode($inner);
            $blockToUpdate[0]->update();
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => "Error"));
            return;
        }
        http_response_code(200);
        echo json_encode(array("message" => "block added"));
        return;
    }

    public function loadBlocksByPage()
    {
        $data = json_decode(file_get_contents("php://input"));
        try {
            $blocks2Load = array();
            $blocks = BlockModel::findByIdPage($data->idPage);
            foreach ($blocks as $block) {
                array_push($blocks2Load, json_encode($block));
            }
            http_response_code(200);
            echo json_encode(array(
                "message" => "blocks loaded.",
                "blocks" => $blocks2Load
            ));
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => $e));
        }
    }

    public function deleteFromCol()
    {
        $data  = json_decode(file_get_contents("php://input"));
        try {
            $block = BlockModel::findById($data->idParent);
            if ($block[0]->innerBlocks == "" || $block[0]->innerBlocks == "{}") {
                http_response_code(412);
                echo json_encode(array("message" => "le bloc parent est deja vide."));
                return;
            }
            $inner = json_decode($block[0]->innerBlocks, true);
            unset($inner[array_keys($inner, $data->idChild)[0]]);
            if (json_encode($inner) == "[]") {
                $block[0]->innerBlocks = "";
            } else {
                $block[0]->innerBlocks = json_encode($inner);
            }
            $block[0]->update();
            http_response_code(200);
            echo json_encode(array("message" => "colonne vide."));
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => $e));
        }
    }

    public static function setColumnChilds($node, $categHTML)
    {
        // $doc = new DOMDocument();
        // $doc->loadHTML('<div class ="block-unit" id="'.$child->id.'" ></div>');
        // str_replace("{\$block->content}",$child->content,$categHTML[$child->idBlockType]);
        $childs = BlockModel::findChildren($node->id);
        $cols = array();
        $result = $categHTML[$node->idBlockType];
        foreach ($childs as $child) {
            $template =  $categHTML[$child->idBlockType];
            if ($child->idBlockType !== '1' && $child->idBlockType !== '2') {
                $oldVar = array('{$block->content}', '{$block->id}');
                $newVar = array($child->content, $child->id);
                $result = str_replace('{col' . $child->idColumn . '}',"<div class='block-unit' id='" . $child->id . "'>" . str_replace($oldVar, $newVar, $template) . "</div>",$result);
            } else {
                $result = str_replace('{col' . $child->idColumn . '}', "<div class='block-unit-complex' id='" . $child->id . "'>" . BlockController::setColumnChilds($child, $categHTML) . "</div>", $result);
            }
        }
        return $result;
    }
}
