<?php
ini_set('default_charset', 'utf-8');
header('Content-Type: text/html; charset=utf-8');
set_time_limit('60'); // Timeout in seconds
ini_set('session.cookie_httponly', 1);
session_start();

define ('LIVE', $_SERVER['HTTP_HOST'] != 'localhost');
	
if (LIVE) {
	// database
	define('DB_HOST', 'localhost');
	define('DB_USER', 'root');
	define('DB_PASS', 'hh1488yoloswag');
	define('DB_DATABASE', 'voicelinks');
	//error reporting
	error_reporting(0);
} else {
	// database
	define('DB_HOST', 'localhost');
	define('DB_USER', 'root');
	define('DB_PASS', '');
	define('DB_DATABASE', 'voicelinks');
	//error reporting
	error_reporting(E_ALL);
}

/******************************
	Generic Defines
******************************/
define('GENERIC_ERROR', 'Sorry! We cannot load this page. Call for help.');
// Get the hostname
define('HOST', htmlentities($_SERVER['HTTP_HOST']));

/******************************
	Startup
******************************/
//SQL
@$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);
if (mysqli_connect_error()) {
	echo 'Unable to connect to the database: ' . mysqli_connect_error();
}
