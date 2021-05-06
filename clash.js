/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

const n = parseInt(readline());
for (let i = 0; i < n; i++) {
	var inputs = readline().split(' ');
	var b = parseInt(inputs[0]);
	var t = parseInt(inputs[1]);
	t = t * 9 / 5 + 32;
	if (b > t)
		console.log("Higher")
	else if (b < t)
		console.log("Lower")
	else
		console.log("Same")
}
