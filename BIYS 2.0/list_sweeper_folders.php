<?php
$sweeperDirectory = "./Sweepers"; // Path to your "Sweepers" directory

$folders = array_filter(scandir($sweeperDirectory), function($item) use ($sweeperDirectory) {
    return is_dir($sweeperDirectory . '/' . $item) && !in_array($item, ['.', '..']);
});

header('Content-Type: application/json');
echo json_encode(array_values($folders));
?>
