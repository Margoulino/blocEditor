<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageCategoryModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/categoryModel.php';
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';
use \Firebase\JWT\JWT;

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
            $pageCat = PageCategoryModel::findByIdCategory($category[0]->id);
            foreach($pageCat as $pc){
                $temp = PageCategoryModel::findByIdPage($pc->idPage);
                if (count($temp) === 1 ) {
                    PageModel::delete($temp[0]->idPage);
                }
            }
            $category[0]->delete();
            http_response_code(200);
            echo json_encode(array("message" => "Category successfully deleted"));
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => $e));
        }
    }

    function findByName() {
        $data = json_decode(file_get_contents("php://input"));
        try {
            $category = CategoryModel::findByname($data->name);
            if(count($category) == 1) {
                http_response_code(200);
                return json_encode($category);
            } else if(count($category) < 1){
                throw new Exception("Category does not exist");
            }
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => $e));
        }
    }
}