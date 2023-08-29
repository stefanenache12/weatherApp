<?php
$apiUrl = $_GET['url'];
$response = file_get_contents($apiUrl);
header("Content-Type: application/json");
echo $response;
?>
