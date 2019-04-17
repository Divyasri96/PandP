<?php
	$out=fopen("php://output",'w');
	$first=true;
	
	//connection  with database 	
	$mysqli = new mysqli('localhost', 'root', '', 'file-management'); // Database connection
	if ($mysqli->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	} 

	$sql = "select * from places";
	$result = $mysqli->query($sql);
	$fields=array();
	$addfield=array();
	if (!empty($result))
    {
        while($row = mysqli_fetch_assoc($result))
        {       
			    
        	/************Lat Lng address********************/
        	$address = urlencode($row['address'].' '. $row['city'] .' '. $row['state'].' '.$row['country'].' '.$row['zip']);
        	
        	$url = "http://maps.google.com/maps/api/geocode/json?address={$address}";
		 
			// get the json response
			$resp_json = file_get_contents($url);

			$resp = json_decode($resp_json, true);

			if($resp['status']=='OK'){

				// get the important data
				$lati = $resp['results'][0]['geometry']['location']['lat'];
				$longi = $resp['results'][0]['geometry']['location']['lng'];
				$formatted_address = $resp['results'][0]['formatted_address'];

				if($lati && $longi && $formatted_address){
				 
							// put the data in the array
							$data_arr = array();            
							 
							array_push(
								$data_arr, 
									$lati, 
									$longi, 
									$formatted_address							
								);
							$row['Xcoord']=$data_arr[0];
							$row['Ycoord']=$data_arr[1];
							$row['address']=$data_arr[2];											
						}
						else{
							return false;
						}
			}
			else{
				return false;
			}
			/************enf Lat Lng address********************/
            if($first){
        		$k=array_keys($row);     
        		$v= '"'.implode('","',$k).''."\n";
        		echo $v;
        		//fputcsv($out,$v);
        		$first=false;	
        	}      
        	$v1= '"'.implode('","',$row).''."\n"; 
        	echo $v1;
           // fputcsv($out,$v1);
        }
    }

