<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/blockModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/blockTypeModel.php';

require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

class BlockTypeController
{
    function loadTemplate()
    {
        $data = json_decode(file_get_contents("php://input"));
        try {
            $type = BlockTypeModel::findById($data->id);
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => $e));
        }
        http_response_code(200);
        echo json_encode(array(
            "html" => $type[0]->templateBlock,
            "js" => $type[0]->js
        ));
    }
}
