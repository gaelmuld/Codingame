<?php
fscanf(STDIN, "%d", $N);
if($N % 3 == 1)
	echo ( pow ( 3, floor ($N/ 3) -1)*4);
elseif($N % 3 == 2)
	echo ( pow ( 3, floor ($N/ 3)) *2);
else
	echo ( pow ( 3, floor( $N/ 3)));
?>
