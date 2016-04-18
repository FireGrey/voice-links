<?php
require_once('config.php');

function slug($title) {
	// replace non letter or digits by -
	$title = preg_replace('~[^\\pL\d]+~u', '-', $title);
	// trim
	$title = trim($title, '-');
	// transliterate - hide warnings
	$title = @iconv('utf-8', 'us-ascii//TRANSLIT', $title);
	// lowercase
	$title = strtolower($title);
	// remove unwanted characters
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

// on submit
if (!isset($_POST['gen-session'])) {
	header('Location: ./');
	exit;
}

// make slug (from post request?)
if (empty($_POST['room-name'])) {
	$room_name = slug(rand_string(20));
} else {
	$room_name = substr($_POST['room-name'], 0, 20);
	$room_name = slug($room_name);
}

// generate expiry time 24 hours in advance
$expire_time = date("Y-m-d G:i:s", strtotime('+12 hours'));

// check room not already in use
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
	die('There is already a valid room with that name.');
}

// add slug to db with expiry timestamp
$query = "	INSERT INTO rooms
		  	(slug, expire, ip)
		  	VALUES (?, ?, ?)";
$result = $mysqli->prepare($query);
$result->bind_param('sss',
					$room_name,
					$expire_time,
					$_SERVER['REMOTE_ADDR']);
if ($result->execute()) {
	// redirect to room?slug=room_name
	header('Location: room/' . $room_name);
	exit;
} else {
	die('Error inserting to db. Call for help.');
}
$result->close();

?>