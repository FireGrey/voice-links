<?php
require_once('config.php');

// Create URL safe room name
function slug($title) {
	$title = preg_replace('~[^\\pL\d]+~u', '-', $title);
	$title = trim($title, '-');
	$title = @iconv('utf-8', 'us-ascii//TRANSLIT', $title);
	$title = strtolower($title);
	$title = preg_replace('~[^-\w]+~', '', $title);

	if (empty($title)) {
		return 'n-a-' . rand(10,99);
	}
	return $title;
}

function rand_string($length) {
	$chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$salt = '';
	for ($i = 0; $i < $length; $i++) {
		$salt .= $chars[mt_rand(0, strlen($chars) - 1)];
	}
	return $salt;
}

// Check if page has variables
if (!isset($_POST['gen-session'])) {
	header('Location: ./');
	die('Couldn\'t change header');
}

// Make slug
if (empty($_POST['room-name'])) {
	$room_name = slug(rand_string(20));
} else {
	$room_name = substr($_POST['room-name'], 0, 20);
	$room_name = slug($room_name);
}

// Generate expiry time 12 hours in advance
$expire_time = date("Y-m-d G:i:s", strtotime('+12 hours'));

// Check room not already in use
$query = "	SELECT room_id FROM rooms
			WHERE expire > NOW()
			AND slug = ?";
$result = $mysqli->prepare($query);
$result->bind_param('s', $room_name);

if (!$result->execute()) {
	die('Error selecting from db. Call for help.');
}
$result->store_result();

if ($result->num_rows !== 0) {
	die('There is already a valid room with that name. Would you like to <a href="/room/' . $room_name . '">join it</a>?');
}

// Add slug to db with expiry timestamp
$query = "	INSERT INTO rooms
		  	(slug, expire, ip)
		  	VALUES (?, ?, ?)";
$result = $mysqli->prepare($query);
$result->bind_param('sss',
					$room_name,
					$expire_time,
					$_SERVER['REMOTE_ADDR']);
if ($result->execute()) {
	// Redirect to room?slug=room_name
	header('Location: room/' . $room_name);
	die('Couldn\'t change header');
} else {
	die('Error inserting to db. Call for help.');
}
$result->close();
