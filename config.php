<?php
ini_set('default_charset', 'utf-8');
header('Content-Type: text/html; charset=utf-8');
ini_set('session.cookie_httponly', 1);
session_start();

define ('LIVE', $_SERVER['HTTP_HOST'] != 'localhost');
	
if (LIVE) {
	// Database Creds
	define('DB_HOST', 'localhost');
	define('DB_USER', 'root');
	define('DB_PASS', 'aREALLYsecurepa$$w0rd');
	define('DB_DATABASE', 'voicelinks');
	// Error Reporting
	error_reporting(0);
} else {
	// Database Creds
	define('DB_HOST', 'localhost');
	define('DB_USER', '');
	define('DB_PASS', '');
	define('DB_DATABASE', '');
	// Error Reporting
	error_reporting(E_ALL);
}

/******************************
	Generic Defines
******************************/
define('GENERIC_ERROR', 'Sorry! We cannot load this page. Call for help.');
// Get the hostname - should be in the format: subdomain.domain.tld:port
// We get this from the users HOST header so it can not be trusted, we have protected it from XSS however other attack scenario's exist
// A MitM situation could change this and it may provide the attacker some browser hooking abilities, but tbh
// if you're being MitM'ed you have larger problems to worry about than your Voice Links server browser hooking you
define('HOST', htmlentities($_SERVER['HTTP_HOST']));

/******************************
	Startup
******************************/
// SQL Handle
@$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);
if (mysqli_connect_error()) {
	echo 'Unable to connect to the database: ' . mysqli_connect_error();
}
