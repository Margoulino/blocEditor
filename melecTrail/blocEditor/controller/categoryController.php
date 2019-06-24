<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageCategoryModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/categoryModel.php';
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';
use \Firebase\JWT\JWT;
use League\Flysystem\Exception;

class CategoryController
{
    function addcategory(){
        $data = json_decode(file_get_contents("php://input"));
        if(CategoryModel::findByname($data->name)){
            http_response_code(409);
            echo json_encode(array('message' => 'name already taken'));
            return;
        }
        try {
            $newcat = new CategoryModel;
            $newcat->name = $data->name;
            CategoryModel::save($newcat);
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array('message'=>'an error ocurred when adding the category'));
        }
        http_response_code(200);
    }

    function delete(){
        $data = json_decode(file_get_contents("php://input"));
        try{
            $category = CategoryModel::findByname($data->name);
            $category[0]->delete();
            http_response_code(200);
            echo json_encode(array("message" => "Category successfully deleted"));
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => $e));
        }
    }
}