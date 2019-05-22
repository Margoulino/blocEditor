<?php

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
        $block->type = $data->type;
        $block->content = $data->content;
        $block->order = $data->order;
        $block->idPage = $data->idPage;
        $targetPage = PageModel::findByid($data->idPage);
        if(count($targetPage) == 0) {
            http_response_code(404);
            echo json_encode(array("message" => "The page you are trying to add a block on does not exists. Block not added to base."));
        } else {
            BlockModel::save($block);
            http_response_code(200);
            echo json_encode(array("message" => "Block succesfully added to base"));
        }
    }

    /**
     * Removes a block from db/page
     */
    public function deleteBlock()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        $blocToDelete = BlocModel::findById($data->id);
        if(count($blocToDelete) == 0) {
            http_response_code(404);
            echo json_encode(array("message" => "Block not found, can't be deleted."));
        } else {
            BlocModel::delete($data->id);
            http_response_code(200);
            echo json_encode(array("message" => "Block deleted succesfully"));
        }
    }
}