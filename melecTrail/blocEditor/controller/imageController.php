<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/imageModel.php';

require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

class ImageController
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

    public function addImage()
    {
        $this->setHeader();
        $data = json_decode(file_get_contents("php://input"));
        $image = new ImageModel();
        $image->name = $data->name;
        $image->path = $data->path;
        $image->height = $data->height;
        $image->width = $data->width;
        $image->extension = $data->extension;
        $allowedExt = ["jpg", "jpeg", "png", "gif"];
        if(in_array($image->extension, $allowedExt)) {
            ImageModel::save($image);
            http_response_code(200);
            echo json_encode(array("message" => "Image successfully added to base"));
        } else {
            http_response_code(403);
            echo json_encode(array("message" => "File extension not allowed, types allowed : jpg, jpeg, png, gif"));
        }
    }

    public function deleteImage()
    {
        $this->setHeader();
        $data = json_encode(file_get_contents("php://input"));
        $imageToDelete = ImageModel::findById($data->id);
        if(count($imageToDelete) == 0) {
            http_response_code(404);
            echo json_encode(array("message" => "Image not found, can't be deleted."));
        } else {
            ImageModel::delete($data->id);
            http_response_code(200);
            echo json_encode(array("message" => "Image deleted succesfully"));
        }
    }

    public function getImages()
    {}

    public function gestion()
    {
        $imagesToDisplay = ImageModel::findAll();
        require(__DIR__ . '/../view/imageManagerView.php');
    }
}