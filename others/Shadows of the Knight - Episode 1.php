<?php
/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

// $W: width of the building.
// $H: height of the building.
fscanf(STDIN, "%d %d", $W, $H);
// $N: maximum number of turns before game over.
fscanf(STDIN, "%d", $N);
fscanf(STDIN, "%d %d", $X, $Y);
// game loop
$Xmin=0;
$Ymin=0;
$Xmax = $W-1;
$Ymax = $H-1;
while (TRUE)
{
    // $bombDir: the direction of the bombs from batman's current location (U, UR, R, DR, D, DL, L or UL)
    fscanf(STDIN, "%s", $bombDir);
	$Dir = str_split($bombDir);
	
	if(in_array("U",$Dir)){
		$Ymax =$Y-1;
	}
	
	if(in_array("D",$Dir)){
		$Ymin =$Y+1;
	}
	
	if(in_array("L",$Dir)){
		$Xmax = $X-1;
	}
	
	if(in_array("R",$Dir)){
		$Xmin = $X+1;
	}
	$Y = intval(($Ymin+$Ymax)/2);
	$X = intval(($Xmin+$Xmax)/2);
    // Write an action using echo(). DON'T FORGET THE TRAILING \n
    // To debug (equivalent to var_dump): error_log(var_export($var, true));


    // the location of the next window Batman should jump to.
    echo("$X $Y\n");
}
?>
