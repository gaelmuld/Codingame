<?php
fscanf(STDIN, "%d", $N);
$nums=[];

for($i = 0; $i < $N; $i++)
{
    fscanf(STDIN, "%f", $X);
	array_push($nums,$X);
}

function operationsTry($nums){
	$toReturn =null;
	for($i = 0 ; $i<pow(4,count($nums));$i++){
		$tableOps = ['+','-','*','/'];
		$code=array_reverse(str_split(base_convert($i,10,4)));
		for($j=0;$j<count($nums);$j++){
			$code[$j]= $code[$j]??0;
		}
		$tot = 	0;
		foreach($nums as $k=>$v){
			$tot = ops($tot,$v,$tableOps[$code[$k]]);
		};
		if($tot> $toReturn){
			$toReturn =  $tot;
		}
	}
	echo $toReturn;
}
operationsTry($nums);
function ops($a,$b,$op){
	if($op =="+")
		return $a+$b;
	elseif($op =="-")
		return $a-$b;
	elseif($op =="*")
		return $a*$b;
	elseif($op =="/" && $b !=0)
		return $a/$b;
	else
		return false;
}
// Write an action using echo(). DON'T FORGET THE TRAILING \n
// To debug (equivalent to var_dump): error_log(var_export($var, true));

//echo("the biggest number\n");
?>
