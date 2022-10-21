<?php
	require "connection.php";
	$username = $_POST["accountName"];
	$pass = $_POST["accountPass"];
	$eName = base64_encode($username);
	$consult = "SELECT NAME FROM `accounts` WHERE NAME="."'".$eName."';";
	$query = mysqli_query($connect, $consult);
	if($query -> num_rows == 0) {
		header("Location:../../loginaccount/?uan=1");
	} else {
		$consult2 = "SELECT * FROM `accounts` WHERE NAME="."'".$eName."'&&PASSWORD=".$pass."";
		$query2 = mysqli_query($connect, $consult2);
		if($query2 -> num_rows == 0) {
			header("Location:../../loginaccount/?pdnm=1");
		} else {
			header("Location:../../?ra=1&p=1");
		}
	}
?>