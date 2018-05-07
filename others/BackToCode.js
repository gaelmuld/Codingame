/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
function dist(a, b) {
    return Math.abs(b.posX - a.posX) + Math.abs(b.posY - a.posY);
}

function micro() {
    this.posX;
    this.posY;
    this.backInTimeLeft;
    this.rdyToBlock = 0;
    this.startBlockX = null;
    this.startBlockY = null;
}
var X, Y, freeX, freeY;
var m = new micro();
var o = [];
var opponentCount = parseInt(readline()); // Opponent count

// game loop
while (true) {
    var gameRound = parseInt(readline());
    var inputs = readline().split(' ');
    m.posX = parseInt(inputs[0]); // Your x position
    m.posY = parseInt(inputs[1]); // Your y position
    m.backInTimeLeft = parseInt(inputs[2]); // Remaining back in time
    if (m.startBlockX === null) {
        m.startBlockX = m.posX
        m.startBlockY = m.posY
    }
    printErr(m.posX, m.posY)
    for (var i = 0; i < opponentCount; i++) {
        o[i] = new micro();
        var inputs = readline().split(' ');
        o[i].posX = parseInt(inputs[0]); // X position of the opponent
        o[i].posY = parseInt(inputs[1]); // Y position of the opponent
        o[i].BackInTimeLeft = parseInt(inputs[2]); // Remaining back in time of the opponent
        printErr(o[i].posX, o[i].posY)


    }
    for (var i = 0; i < 20; i++) {
        var line = readline(); // One line of the map ('.' = free, '0' = you, otherwise the id of the opponent)
    }
    X = 0, Y = 0;

    if (o[0].posX != null) {
        if (dist(m, o[0]) > 10) {
            printErr(dist(m, o[0]));
            if (Math.abs(m.posX - o[0].posX) < Math.abs(m.posY - o[0].posY)) {
                X = m.posX;
                Y = o[0].posY;
            } else {
                X = o[0].posX;
                Y = m.posY;
            }
        } else {
            m.rdyToBlock = 1;
        }
    } else {
        if (Math.abs(m.posX - freeX) < Math.abs(m.posY - freeY)) {
            X = m.posX;
            Y = freeY;
        } else {
            X = freeX;
            Y = m.posY;
        }
        if (m.posX == freeX && m.posY == freeY) {
            m.rdyToBlock
            freeX = 34;
            freeY = 19;
        }

    }
    printErr('m.rdyToBlock : ' + m.rdyToBlock, 'dist from start block : ' + (Math.abs(m.posX - m.startBlockX) + Math.abs(m.posY - m.startBlockY)));
    if (Math.abs(m.posX - m.startBlockX) + Math.abs(m.posY - m.startBlockY) > 30 || m.rdyToBlock) {
        X = m.startBlockX;
        Y = m.startBlockY;
        m.rdyToBlock = 1;
        if (Math.abs(m.posX - m.startBlockX) + Math.abs(m.posY - m.startBlockY) <= 1) {
            m.rdyToBlock = 0;
        }
    }



    print(X + ' ' + Y);

}
