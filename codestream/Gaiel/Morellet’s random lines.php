<?php
fscanf(STDIN, "%d %d %d %d", $xA, $yA, $xB, $yB);
fscanf(STDIN, "%d", $n);
$sameColor = true;
$lines=[];
for ($i = 0; $i < $n; $i++)
{
    fscanf(STDIN, "%d %d %d", $a, $b, $c);
	if($a)
		$line = [1,$b/$a,$c/$a];
	else
		$line=[0,$b,$c];
	if(in_array($line,$lines))
		continue;
	array_push($lines,$line);
	$resA = $xA*$a+$yA*$b+$c;
	$resB = $xB*$a+$yB*$b+$c;
	if($resA*$resB<0)
		$sameColor = !$sameColor;
	if($resA*$resB==0){
		echo "ON A LINE";
		exit;
	}
}
if($sameColor)
	echo "YES";
else
	echo "NO";
?>
