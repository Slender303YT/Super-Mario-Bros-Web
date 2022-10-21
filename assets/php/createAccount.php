<?php
	require "connection.php";
	$username = $_POST["accountName"];
	$password = $_POST["accountPass"];
	$levels = '{
		"empty": {
		    "spriteSheet": "overworld",
		    "musicSheet": "overworld",
		    "patternSheet": "overworld-pattern",
		    "leveldepth": 212,
		    "playerX": 48,
		    "playerY": 192,
		    "layers": [
		        {
		            "tiles": [
		                {
		                    "name": "sky",
		                    "ranges": [
		                        [
		                            0, 212,
		                            0, 13
		                        ]
		                    ]
		                },
		                {
		                    "name": "ground",
		                    "type": "ground",
		                    "ranges": [
		                        [
		                            0, 212,
		                            13, 2
		                        ]
		                    ]
		                }
		            ]
		        },
		        {
		            "tiles": [
		                
		            ]
		        },
		        {
		            "tiles": [
		                
		            ]
		        }
		    ],
		    "entities": [
		        
		    ],
		    "triggers": [
		        
		    ],
		    "checkpoints": [
		        
		    ]
		}
	}';
	$eName = base64_encode($username);
	$eLevels = base64_encode($levels);
	/*
	$random = "INSERT INTO accounts(ID, NAME, PASSWORD, LEVELS) VALUES (NULL, '".$eName."', '".$password."', '".$eLevels."')";
	mysqli_query($connect, $random);
	*/
	$consult = "SELECT NAME FROM `accounts` WHERE NAME='".$eName."'";
	$query = mysqli_query($connect, $consult);
	if($query -> num_rows == 0) {
		$consult2 = "INSERT INTO accounts(ID, NAME, PASSWORD, LEVELS) VALUES (NULL, '".$eName."', '".$password."', '".$eLevels."')";
		mysqli_query($connect, $consult2);
		header("Location:../../");
	} else {
		header("Location:../../registeraccount/?aun=1");
	}
?>