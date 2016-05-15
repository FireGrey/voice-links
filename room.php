<?php
// Cross contaminating PHP and HTML is disgusting but we'll do it anyway.
require_once('config.php');

// Confirm protocol
if(!isset($_SERVER['HTTPS'])) {
	die('You wouldn\'t dare not use a condom, so why not use HTTPS?');
}

if (empty($_GET['slug'])) {
	// No slug? Redirect them to error page
	header('Location: ' . 'https://' . HOST . '/error.html');
	exit;

} else {
	$query = "SELECT room_id FROM rooms WHERE expire > NOW() AND slug = ?";
	$result = $mysqli->prepare($query);
	$result->bind_param('s', $_GET['slug']);

	if (!$result->execute()) {
		die('Error executing SQL query.');
	} else {
		$result->store_result();
	}

	if ($result->num_rows == 0) {
		// Slug not found? Redirect them to error page
		header('Location: ' . 'https://' . HOST . '/error.html');
		exit;
	}
}

// Get room name as a safe variable
$room_name = htmlentities($_GET['slug']);
?>
<!DOCTYPE HTML>
<html>
	<head>
		<title><?php echo $room_name; ?> - Voice Links</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="//<?php echo HOST; ?>/assets/css/main.css">
		<link rel="icon" href="//<?php echo HOST; ?>/images/connection-color.png">

		<script src="//<?php echo HOST; ?>:8080/socket.io/socket.io.js"></script>
		<script src="//<?php echo HOST; ?>:8080/easyrtc/easyrtc.js"></script>
		<script src="//<?php echo HOST; ?>/js/media-stream-record-1.3.2.js"></script> <!-- Record Dependancies -->
	</head>

	<body onload="my_init('<?php echo $room_name; ?>')">
		<!-- Wrapper -->
		<div id="wrapper">
			<div id="wrapper" style="max-height:300px">
				<table>
					<tr>
						<td><img src="//<?php echo HOST; ?>/images/connection-color.png" style="height: 150px;"></td>
						<td><img src="//<?php echo HOST; ?>/images/logo.png" style="height: 150px;"></td>
					</tr>
				</table>
				<!-- Main -->
				<p>Send this link to others to allow them to join the conference:</p>
				<form>
					<input type="text" onclick="this.select()" value="https://<?php echo HOST . '/room/' . $room_name; ?>" style="width: 500px; text-transform: lowercase !important;">
				</form>
			</div>
			
			<section id="main" style="width:80%">
				<header>
					<h1>Recording Options</h1>
					<button id="start-recording">Start</button>
					<button id="stop-recording" disabled>Stop</button>
					<button id="save-recording" disabled>Save</button>
					
					<h1>Member Controls</h1>
					<div id="other-clients"> </div><br>
					<!-- Our box -->
					<video id="self" width="1" height="1" style="display:none"></video>

					<div id="client-box">
						<ul id="client-list" class="users">
							<!-- New clients get a box in here -->
						</ul>
					</div>
				</header>
			</section>

			<!-- Footer -->
			<footer id="footer">
				<ul class="copyright">
					<li>Voice Links</li>
					<li><a target="_blank" href="http://creativecommons.org/licenses/by/3.0/"><img alt="Creative Commons License" style="border-width: 0; margin-bottom: -3px" src="https://i.creativecommons.org/l/by/3.0/80x15.png" /></a></li>
					<li>Design inspired by <a href="http://html5up.net">HTML5 UP</a></li>
				</ul>
				<span>Icons made by <a href="http://www.flaticon.com/authors/rami-mcmin" title="Rami McMin">Rami McMin</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a></span>
			</footer>
		</div> <!-- Close wrapper -->
	</body>
	<!-- The order of these is likely very important -->
	<script src="//<?php echo HOST; ?>/js/button-management.js?v=1.0.0"></script>
	<script src="//<?php echo HOST; ?>/js/record.js?v=1.0.0"></script>
	<script src="//<?php echo HOST; ?>/js/webrtc.js?v=1.0.0"></script>
</html>
