<?php
/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

fscanf(STDIN, "%d", $N);
$vals = [];
for ($i = 0; $i < $N; $i++)
{
    $vals[$i] = stream_get_line(STDIN, 128 + 1, "\n");
}
foreach($vals as $i=>$val){
	$x = $val;
	$alsoTab=[];
	$bad = false;
	while($x != 1 ){
		$x =array_reduce(str_split($x),'addSquare');
		if(in_array($x,$alsoTab)){
			$bad = true;
			echo "$val :(";
			break;
		}else{
			array_push($alsoTab,$x);
		}
	}
	if(!$bad){
		echo "$val :)";
	}
	if($i < $N-1)
	echo "\n";
}

function addSquare($c=0,$v){
	return $c+$v*$v;
}
// Write an action using echo(). DON'T FORGET THE TRAILING \n
// To debug (equivalent to var_dump): error_log(var_export($var, true));

?>
