<?php
/** Autoloading The required Classes **/
class IndexController
{
    private $model;
    function __construct($tile)
    {
        /** Loading the corresponding Model class **/
        $this->model = new $tile;
    }
    public function index()
    {
        header("Location: /jogging");
    }
}
