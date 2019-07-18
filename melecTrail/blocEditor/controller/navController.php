<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/model/pageModel.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/blocEditor/controller/pageController.php';
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';
use \Firebase\JWT\JWT;

class NavController
{

    function index($name)
    {
        if ($name ==='' || !isset($name)) {
            header("Location: /");
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
                $content .= "
                <url>
                    <loc>http://www.couriraplumelec.fr/nav/" . $p->name . "</loc>
                    <priority>0.5</priority>
                </url>";
            }
        }
        file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/sitemap.xml',
            '<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <url>
                    <loc>http://www.couriraplumelec.fr</loc>
                    <priority>1</priority>
                </url>
                <url>
                    <loc>http://www.couriraplumelec.fr/pageNew.php</loc>
                    <priority>0.8</priority>
                </url>
            ' . htmlspecialchars_decode($content).'</urlset>');
    }
}
