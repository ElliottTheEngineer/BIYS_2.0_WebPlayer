<?php
$musicDirectory = "./Music"; // Replace with the actual path to your "Music" directory

$folder = isset($_GET['folder']) ? $_GET['folder'] : '';

if ($folder !== '' && file_exists($musicDirectory . '/' . $folder)) {
    $mp3Files = array_filter(scandir($musicDirectory . '/' . $folder), function($item) {
        return pathinfo($item, PATHINFO_EXTENSION) === 'mp3';
    });

    $mp3Data = array_map(function($file) use ($folder) {
        return [
            'name' => $file,
            'path' => "music/$folder/$file"
        ];
    }, $mp3Files);

    // Shuffle the playlist
    shuffle($mp3Data);

    header('Content-Type: application/json');
    echo json_encode(array_values($mp3Data));
} else {
    header('HTTP/1.1 404 Not Found');
    echo "Folder not found.";
}
?>
