var N = parseInt(readline());
var dist = 0;
var anglePrevious = 0;

function Clue() {
    this.X;
    this.Y;
}
var clues = [];
for (var i = 0; i < N; i++) {
    clues[i] = new Clue;
    var inputs = readline().split(' ');
    clues[i].X = parseInt(inputs[0]);
    clues[i].Y = parseInt(inputs[1]);
    printErr(clues[i].X + " " + clues[i].Y);
}

function distance(X1, Y1, X2, Y2) {
    var dx = X2 - X1,
        dy = Y2 - Y1;
    return parseInt(Math.sqrt(dx * dx + dy * dy));
}

function downest() {
    return clues.sort(function (a, b) {
        return a.Y - b.Y
    })[0];
}

for (let i = 0; i < N; i++) {
    dist += distance(clues[i % N].X, clues[i % N].Y, clues[(i + 1) % N].X, clues[(i + 1) % N].Y)

}

var circle = 2 * Math.PI * 3;


print(Math.ceil((dist + circle) / 5));
