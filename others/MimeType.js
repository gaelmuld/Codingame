/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var N = parseInt(readline()); // Number of elements which make up the association table.
var Q = parseInt(readline()); // Number Q of file names to be analyzed.
var exts = [];
var mts = [];
for (var i = 0; i < N; i++) {
    var inputs = readline().split(' ');
    exts.push(inputs[0].toLowerCase()); // file extension
    mts.push(inputs[1]); // MIME type.

}
for (var i = 0; i < Q; i++) {
    const FNAME = readline(); // One file name per line.
    const regex = /\.\w{1,10}$/gm;
    //printErr(FNAME);
    let exit = regex.exec(FNAME);
    if (exit === null) {
        print('UNKNOWN');
        continue;
    }
    var ext = exit.toString().toLowerCase().substr(1);
    var m = exts.indexOf(ext);
    (m != -1) ? print(mts[m]): print('UNKNOWN');
}
