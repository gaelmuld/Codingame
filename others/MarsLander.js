function compare(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

var objectifX; //centre de la cible d'attérrisage
var rayonLanding; //largeur d'attérissage
var objectifY; //hauteur d'attérissage
var obstacleHeight;
var summitsX = [];
var summitsY = [];


var N = parseInt(readline()); // the number of points used to draw the surface of Mars.
for (var i = 0; i < N; i++) {
    var inputs = readline().split(' ');
    var previousLandY = landY;
    var previousLandX = landX;
    var landX = parseInt(inputs[0]); // X coordinate of a surface point. (0 to 6999)
    var landY = parseInt(inputs[1]); // Y coordinate of a surface point. By linking all the points together in a sequential fashion, you form the surface of Mars.
    if (Math.abs((previousLandY - landY) / (landX - previousLandX)) == 0) {
        objectifX = (previousLandX + landX) / 2;
        objectifY = landY;
        rayonLanding = (landX - previousLandX) / 2;
        printErr('objectifX :' + objectifX, 'objectifY :' + objectifY, 'rayonLanding :' + rayonLanding);
    }
    summitsX.push(landX);
    summitsY.push(landY);
}
printErr(summitsX);
printErr(summitsY);

// game loop
while (true) {
    var inputs = readline().split(' ');
    var X = parseInt(inputs[0]);
    var Y = parseInt(inputs[1]);
    var HS = parseInt(inputs[2]); // the horizontal speed (in m/s), can be negative.
    var VS = parseInt(inputs[3]); // the vertical speed (in m/s), can be negative.
    var F = parseInt(inputs[4]); // the quantity of remaining fuel in liters.
    var R = parseInt(inputs[5]); // the rotation angle in degrees (-90 to 90).
    var P = parseInt(inputs[6]); // the thrust power (0 to 4).
    printErr(Math.abs((X - objectifX) / (HS + 1)));
    printErr(R + ' - ' + P);
    if (Math.abs(X - objectifX) / (HS + 1) > 10) {
        printErr('1');
        if (X < objectifX) {
            printErr('droite');
            if (R > -81)
                R -= 10;
            if (P < 4)
                P = 4
        } else {
            printErr('gauche');
            if (R < 81)
                R += 10;
            if (P < 4)
                P = 4
        }
    } else {
        if (X < objectifX) {
            printErr('droite');
            R = 20;
            P = 4
        } else {
            printErr('gauche');
            R = -20;
            P = 4
        }

    }
    printErr(R + ' - ' + P);

    // R P. R is the desired rotation angle. P is the desired thrust power.
    print(R + ' ' + P);
}
