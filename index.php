<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Super Mario Bros Web</title>
	<meta name="title" content="Super Mario Bros Web">
	<meta name="author" content="Slender303YT, josebarriav2011@gmail.com">
	<meta name="description" content="A Super Mario Bros Remake in javascript, NEW UPDATE Update Alpha 1.11.1">
	<meta name="copyright" content="Nintendo">
	<meta name="keywords" content="HTML, CSS, JavaScript">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
	<style type="text/css">
		* {
			user-select: none;
		}

		body {
			margin: 0;
			font-family: sans-serif;
			image-rendering: pixelated;
			background: url("assets/images/background.png");
		}

		.button {
			display: block;
			margin: auto;
			text-align: center;
			width: 128px;
			height: 32px;
			border: 2px solid #000;
		}

		.buttonn {
			display: block;
			margin: auto;
			text-align: center;
			width: 128px;
			height: 32px;
			border: 2px solid #FFF;
		}

		.level {
			width: 384px;
			margin-left: 64px;
			height: 256px;
			background-color: #AAA;
			border: 2px solid #FFF;
		}
	</style>
	<script type="module" src="assets/js/main.js"></script>
</head>
<body>
	<div id="onlinelevels" style="background-color: #000; border: 2px solid #FFF; width: 512px; position: absolute; z-index: 11; display: none; border-radius: 32px 32px;">
		<br>
		<button class="buttonn" style="background-color: #ff3627"><h4 style="margin-top: 7px; text-decoration: none; color: #000" onclick="closeSearchLevels()">Close</h4></button>
		<br>
		<?php
			require "assets/php/connection.php";
			$databaseLevel = "SELECT * FROM `onlinelevels` WHERE 1".";";
			$databaseLevelQuery = mysqli_query($connect, $databaseLevel);
			if($databaseLevelQuery -> num_rows == 0) {
				echo "<h1 style='color: #FFF; text-align: center'>No Levels Found</h1>";
			}

			foreach ($databaseLevelQuery as $level) {
				$levelName = base64_decode($level[NAME]);
				$levelID = $level[ID];
				$levelCreator = $level[CREATOR];
				$levelLikes = $level[LIKES];
				$levelPlayed = $level[PLAYED];
				$levelData = $level[LEVELDATA];
				$levelRAccount = $level[RACCOUNT];
				echo "<div class='level'>";
				echo "<h5 style='color: #FFF'>Level Name: ".$levelName."</h5>";
				echo "<h5 style='color: #FFF'>Level ID: ".$levelID."</h5>";
				if($levelRAccount == 0) {
					echo "<h5 style='color: #AFA'>Creator: ".$levelCreator."</h5>";
				} else {
					echo "<h5 style='color: #FFA'>Creator: ".$levelCreator."</h5>";
				}
				echo "<h5 style='color: #FFF'>Likes: ".$levelLikes."</h5>";
				echo "<h5 style='color: #FFF'>Played: ".$levelPlayed."</h5>";
				echo '<button class="button" style="background-color: #ffe717" onclick="playLevel(`'.base64_encode($levelName).'`, `'.$levelData.'`)" id="onlinePlayGame"><h4 style="margin-top: 7px; text-decoration: none; color: #000">Play Level!</h4></button>';
				echo "</div>";
				echo "<br>";
			}
		?>
	</div>
	<h1 id="pleasewait" style="display: none; color: #FFF; position: absolute; z-index: 10;">Please Wait</h1>
	<img src="assets/images/logo.png" id="logo" style="display: block; margin: auto">
	<h3 style="color: #FFF; text-align: center" id="cn">Copyright: Nintendo</h3>
	<br id="br1">
	<br id="br2">
	<button class="button" style="background-color: #ffe717" id="playGame"><h4 id="playGame" style="margin-top: 7px; text-decoration: none; color: #000">Play game!</h4></button>
	<br id="br3">
	<button class="button" style="background-color: #ff3627" id="updatesButton"><a href="updates/"><h4 style="margin-top: 7px; color: #000">Updates</h4></a></button>
	<br id="br4">
	<button class="button" style="background-color: #3333FF" id="bugreportButton"><a href="bugreport/"><h4 style="margin-top: 7px; color: #000">Bug Report</h4></a></button>
	<br id="br7">
	<button class="button" style="background-color: #33FF33" id="uploadlevelbutton"><a href="uploadlevel/"><h4 style="margin-top: 7px; color: #000">Upload Level</h4></a></button>
	<br id="br8">
	<button class="button" style="background-color: #330FFF" id="searchlevelbutton" onclick="searchLevels()"><h4 style="margin-top: 7px; color: #000">Search Levels</h4></button>
	<br id="br9">
	<button class="button" style="background-color: #979FA6" id="registeraccountbutton" style="display: none;"><a href="registeraccount/"><h4 style="margin-top: 7px; color: #000">Register</h4></a></button>
	<br id="br10">
	<button class="button" style="background-color: #769A59" id="loginaccountbutton" style="display: none;"><a href="loginaccount/"><h4 style="margin-top: 7px; color: #000">Login</h4></a></button>
	<br id="br5">
	<textarea id="username" placeholder="Username" maxlength="15" minlength="3" style="display: block; margin: auto; resize: none; border: 2px solid #000; "></textarea>
	<br id="br6">
	<button id="submitUsernameButton" style="display: block; margin: auto;" onclick="changeUsername()">Change</button>
	<h2 id="controls" style="position: absolute; display: none; color: #FFF">Controls:<br>- Move: A W S D & Left Up Down Right<br>- Run: J & Z & Shift<br>- Jump: K & X & Space<br>Note: If There Has A Error, Report on Bug Report Section, Or Press Control+F5 for clear Cache</h2>
	<script type="text/javascript">
		const urlParams = new URLSearchParams(window.location.search);
		if(urlParams.get("ra") == 1) {
			localStorage.setItem("registredaccount", 1);
		}
		if(urlParams.get("p") == 1) {
			location.href = "?p=0";
		}
		if(localStorage.getItem("registredaccount") == 1) {
			document.body.removeChild(document.getElementById("username"));
			document.body.removeChild(document.getElementById("submitUsernameButton"));
		}
		if(localStorage.getItem("username") === undefined) {
			localStorage.setItem("registredaccount", 0);
			localStorage.setItem("username", "Player");
		}
		function base64_encode(v) {
			return btoa(v);
		}

		function base64_decode(v) {
			return atob(v);
		}

		var levelData = null;
		var levelName = null;
		var pol = false;
		var playingOL = false;
		if(localStorage.getItem("ra") == 0) {
			const username = document.getElementById("username");
			username.innerText = localStorage.getItem("username");
		}
		if(document.getElementById("onlinelevels") != undefined) {
			document.getElementById("onlinelevels").style.left = window.innerWidth / 2 - 256 + "px";
			document.getElementById("onlinelevels").style.top = window.innerHeight / 2 - 256 + "px";
		}
		if(document.getElementById("pleasewait") != undefined) {
			document.getElementById("pleasewait").style.left = window.innerWidth / 2 - 80 + "px";
			document.getElementById("pleasewait").style.top = window.innerHeight / 2 - 28 + "px";
		}
		if(urlParams.get("ld") != null) {
			levelData = JSON.parse(base64_decode(urlParams.get("ld")));
		}
		if(urlParams.get("n") != null) {
			levelName = base64_decode(urlParams.get("n"));
		}
		function searchLevels() {
			document.getElementById("onlinelevels").style.display = "block";
		}
		function closeSearchLevels() {
			document.getElementById("onlinelevels").style.display = "none";
		}
		function changeUsername() {
			localStorage.setItem("username", username.value);
		}
		
		function playLevel(ln, ld) {
			pol = true;
			playingOL = true;
			levelName = base64_decode(ln);
			levelData = JSON.parse(base64_decode(ld));
		}

		window.addEventListener("resize", () => {
			document.getElementById("onlinelevels").style.left = window.innerWidth / 2 - 256 + "px";
			document.getElementById("onlinelevels").style.top = window.innerHeight / 2 - 256 + "px";
			document.getElementById("pleasewait").style.left = window.innerWidth / 2 - 80 + "px";
			document.getElementById("pleasewait").style.top = window.innerHeight / 2 - 28 + "px";
		});
	</script>
</body>
</html>