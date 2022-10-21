<?php
	$mysql_host = "localhost";
	$mysql_user = "root";
	$mysql_pass = "";
	$mysql_db = "supermariobros_web";

	$connect = mysqli_connect($mysql_host, $mysql_user, $mysql_pass, $mysql_db);

	if(mysqli_connect_errno()) {
		printf("Error to connect: ", mysqli_connect_errno());
		exit();
	}

	mysqli_set_charset($connect, "utf8");
?>