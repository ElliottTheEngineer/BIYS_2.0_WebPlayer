# BIYS_2.0_WebPlayer
Play your playlists hosted on the web

Web Player README

Introduction
  This repository contains the JavaScript code for a web-based audio player. It's designed to play music and sweeper tracks stored in specified directories on the server. The player offers basic controls such as play, next, and previous, along with dynamic listing of music and sweeper folders.

Features

  Dynamic listing of music and sweeper tracks from server directories.
  Basic controls: Play, Next, and Previous.
  Automatic play of sweeper track every fourth track.
  User selection of different music and sweeper folders.
  Display of current track name.

How to Use

  Folder Setup: Ensure your music and sweeper files are properly organized in your server's directories (Music and Sweepers).
  Browser Compatibility: The player is designed to be compatible with modern web browsers.
  Interface: Use the dropdown menus to select folders for music and sweepers. The list of available tracks will update accordingly.
  Playback: Use the play, next, and previous buttons to control playback.

Setup

  Place the files in your web server directory.
  Ensure you have list_folders.php, list_sweeper_folders.php, list_mp3_files.php, and list_mp3_sweepers_files.php set up on your server to return the respective lists of folders and files.

Dependencies

  The player requires a web server capable of serving PHP scripts for listing directories and files.

Notes

  The code assumes a specific file structure and server-side script setup.
  Error handling is implemented for network requests.

Contributing
  Feel free to fork this repository and submit pull requests with enhancements or bug fixes.
