<?php
	require "connection.php";
	$name = $_POST["levelName"];
	$code = $_POST["levelCode"];
	$creator = $_GET["c"];
	$ra = $_GET["ra"];
	$eName = base64_encode($name);
	$eCode = base64_encode($code);
	$version = "Alpha 1.11.1";
	$downloads = 0;
	$random = 'INSERT INTO onlinelevels(ID, NAME, LEVELDATA, PLAYED, VERSION, LIKES, CREATOR, RACCOUNT) VALUES (NULL, "'.$eName.'", "'.$eCode.'", "'.$downloads.'", "'.$version.'", 0, "'.$creator.'", '.$ra.');';
	mysqli_query($connect, $random);
	header("Location:../../");
?>