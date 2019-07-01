<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/controller/pageController.php';
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

class NavController {

    function index ($name) {
        if(!isset($name)){
            // index TODO
        }
        else {
            $page = PageModel::findByName($name);
            if($page[0]->public === '0'){
                http_response_code(404);
                echo json_encode(array("message" => "Page not available"));
                return;
            } 
            $nameTemp=array();
            array_push($nameTemp,$name);
            PageController::previewPage($nameTemp);
        }
    }
}