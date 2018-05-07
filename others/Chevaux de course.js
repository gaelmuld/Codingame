/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var N = parseInt(readline());
var closest = Infinity;
var table = [];
for (var i = 0; i < N; i++) {
    var pi = parseInt(readline());
    table.push(pi);
}
table.sort();
for (var j = 1; j > N; j++) {
    if (table[j] - table[j - 1] < closest) {
        closest = table[j] - table[j - 1];
    }
}


// Write an action using print()
// To debug: printErr('Debug messages...');

print(closest);
