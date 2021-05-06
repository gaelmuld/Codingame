<?php
/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

$expr = stream_get_line(STDIN, 100 + 1, "\n");
function operation($expr){
}
$test = moins(de(3),de(4));
ksort($test);
//asort($test);
//error_log(var_export($test, true));

function de($faces){
	$prob=[];
	for($i=1;$i<=$faces;$i++){
		$prob[$i]=1;
	}
	return $prob;
}
function unival($val){
	$res[$val]=1;
	return $res;
}

function calprob($tab1,$tab2,$op){
	$res=[];
	if($op =='+'){
		foreach($tab2 as $j=>$v){
			foreach($tab1 as $i=>$w){
				if(!isset($res[$i+$j])){
					$res[$i+$j] = $w*$v;
				}else{
					$res[$i+$j]+=$w*$v;
				}
			}
		}
	}
	if($op =='-'){
		foreach($tab2 as $j=>$v){
			foreach($tab1 as $i=>$w){
				if(!isset($res[$i-$j])){
					$res[$i-$j] = $w*$v;
				}else{
					$res[$i-$j]+=$w*$v;
				}
			}
		}
	}
	elseif($op =='*'){
		foreach($tab2 as $j=>$v){
			foreach($tab1 as $i=>$w){
				if(!isset($res[$i*$j])){
					$res[$i*$j] = $w*$v;
				}else{
					$res[$i*$j]+=$w*$v;
				}
			}
		}
	}
	elseif($op =='>'){
		$res=[0,0];
		foreach($tab2 as $j=>$v){
			foreach($tab1 as $i=>$w){
				if($i>$j)
					$res[1]+=$w*$v;
				else
					$res[0]+=$w*$v;
			}
		}
	}
	return $res;
}

function plus($a,$b){
	$a=is_numeric($a)?unival($a):$a;
	$b=is_numeric($b)?unival($b):$b;
	$res = calprob($a,$b,'+');
	return $res;
}

function moins($a,$b){
	$a=is_numeric($a)?unival($a):$a;
	$b=is_numeric($b)?unival($b):$b;
	$res = calprob($a,$b,'-');
	return $res;
}

function fois($a,$b){
	$a=is_numeric($a)?unival($a):$a;
	$b=is_numeric($b)?unival($b):$b;
	$res = calprob($a,$b,'*');
	return $res;
}

function compare($a,$b){
	$a=is_numeric($a)?unival($a):$a;
	$b=is_numeric($b)?unival($b):$b;
	$res = calprob($a,$b,'>');
	return $res;
}


function subCalc($str){
	$beTree = [''];
	$i=0;
	$tabStr = str_split($str);
	foreach($tabStr as $chr){
	}
	return $beTree;
}
subCalc("2-1*(1+(2*3)-(4<3))*2");



class treeNode{
	public $childLeft;
	public $childright;
	public $operation;	
	
	function __construct($cL,$cR,$op){
		$this->childLeft = $cL;
		$this->childright = $cR;
		$this->operation = $op;
	}
	
	function addNode($elem){
	
	}
}
	 
//error_log(var_export($expr, true));

// Write an action using echo(). DON'T FORGET THE TRAILING \n
// To debug (equivalent to var_dump): error_log(var_export($var, true));

echo("answer\n");
?>
