<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/controller/pageController.php';
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

class NavController
{

    function index($name)
    {
        if (!isset($name)) {
            // index TODO
        } else {
            $page = PageModel::findByName($name);
            if ($page[0]->public === '0') {
                http_response_code(404);
                echo json_encode(array("message" => "Page not available"));
                return;
            }
            $nameTemp = array();
            array_push($nameTemp, $name);
            $nav = true;
            PageController::previewPage($nameTemp, $nav);
        }
    }

    public static function updateSitemap()
    {
        $pages = PageModel::findAll();
        $content = '';
        foreach ($pages as $p) {
            if ($p->public === '1') {
                $content .= "<url><loc>http://www.couriraplumelec.fr/nav/" . $p->name . "</loc><priority>0.5</priority></url>";
            }
        }
        file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/sitemap.xml',
            '<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . htmlspecialchars_decode($content).'</urlset>');
    }
}
