/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var inputs = readline().split(' ');
var N = parseInt(inputs[0]); // the total number of nodes in the level, including the gateways
var L = parseInt(inputs[1]); // the number of links
var E = parseInt(inputs[2]); // the number of exit gateways
printErr(N, L, E);
for (var i = 0; i < L; i++) {
    var inputs = readline().split(' ');
    var N1 = parseInt(inputs[0]); // N1 and N2 defines a link between these nodes
    var N2 = parseInt(inputs[1]);
    printErr(N1, N2);
}
for (var i = 0; i < E; i++) {
    var EI = parseInt(readline()); // the index of a gateway node
    printErr(EI);
}

// game loop
while (true) {
    var SI = parseInt(readline()); // The index of the node on which the Skynet agent is positioned this turn
    printErr(SI);
    // Write an action using print()
    // To debug: printErr('Debug messages...');


    // Example: 0 1 are the indices of the nodes you wish to sever the link between
    print('1 2');
}
