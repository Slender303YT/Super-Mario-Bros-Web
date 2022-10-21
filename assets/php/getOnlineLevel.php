<?php
	require "connection.php";
	$name = $_GET["n"];
	$eName = base64_encode($name);
	$version = "Alpha 1.11.1";
	$encodedVersion = base64_encode($version);
	$databaseLevel = "SELECT `ID`, `NAME`, `LEVELDATA`, `PLAYED`, `VERSION`, `LIKES`, `CREATOR`, `RACCOUNT` FROM `onlinelevels` WHERE NAME = "."'".$eName."';";
	$databaseLevelQuery = mysqli_query($connect, $databaseLevel);
	$level = mysqli_fetch_array($databaseLevelQuery);
	$levelData = $level[2];
	$levelName = $level[1];
	header("Location:../../?n=".$levelName."&v=".$encodedVersion."&ld=".$levelData);
?>