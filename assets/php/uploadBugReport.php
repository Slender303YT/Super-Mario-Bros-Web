<?php
	require "connection.php";
	$bugReport = $_POST["bugReport"];
	$version = "Alpha 1.11.1";
	$random = "INSERT INTO bugreports(version, bugreport) VALUES ('".$version."', '".$bugReport."')";
	mysqli_query($connect, $random);
	header("Location:../../");
?>