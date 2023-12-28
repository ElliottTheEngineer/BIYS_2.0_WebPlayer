<?php
$musicDirectory = "./Music"; // path to "Music" directory

$folders = array_filter(scandir($musicDirectory), function($item) use ($musicDirectory) {
    return is_dir($musicDirectory . '/' . $item) && !in_array($item, ['.', '..']);
});

header('Content-Type: application/json');
echo json_encode(array_values($folders));
?>
