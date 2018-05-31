function pErr(item, message = '') {
    printErr(message);
    item.map(x => printErr(x));
}

var objectifX, //centre de la cible d'attérrisage
    rayonLanding, //largeur d'attérissage
    objectifY, //hauteur d'attérissage
    lands = [];

var N = parseInt(readline()); // the number of points used to draw the surface of Mars.
for (var i = 0; i < N; i++) {
    var inputs = readline().split(' ');
    var prevX = landX;
    var prevY = landY;
    var landX = parseInt(inputs[0]); // X coordinate of a surface point. (0 to 6999)
    var landY = parseInt(inputs[1]); // Y coordinate of a surface point. By linking all the points together in a sequential fashion, you form the surface of Mars.
    lands.push([landX, landY]);
    if (prevY === landY) {
        objectifX = (landX + prevX) / 2;
        rayonLanding = (landX - prevX) / 2;
        objectifY = landY;
    }
}
// game loop
while (true) {
    //    lands.map(x => printErr(x[0]));
    var obstacles = [];
    var inputs = readline().split(' '),
        X = parseInt(inputs[0]),
        Y = parseInt(inputs[1]),
        HS = parseInt(inputs[2]), // the horizontal speed (in m/s), can be negative.
        VS = parseInt(inputs[3]), // the vertical speed (in m/s), can be negative.
        F = parseInt(inputs[4]), // the quantity of remaining fuel in liters.
        R = parseInt(inputs[5]), // the rotation angle in degrees (-90 to 90).
        P = parseInt(inputs[6]), // the thrust power (0 to 4).
        Rotation = 0,
        Power = 0;
    if (objectifX <= X)
        obstacles = lands.filter(x => x[0] < X && x[0] > objectifX);
    else
        obstacles = lands.filter(x => x[0] > X && x[0] < objectifX);

    //TODO aller en direction de la zone d'atterissage
    /*  NOTE Comment bien atterrire
        atterrir sur un sol plat
        atterrir dans une position verticale (angle = 0°)
        la vitesse verticale doit être limitée ( ≤ 40 m/s en valeur absolue)
        la vitesse horizontale doit être limitée ( ≤ 20 m/s en valeur absolue)
        */

    printErr('HS : ' + HS + ' / VS : ' + VS);
    var direction = X <= objectifX ? -1 : 1;
    Power = Math.min(Math.floor(-VS / 7), 4);
    Rotation = Math.round(Math.atan(Math.abs(X - objectifX) / Math.abs(Y - objectifY)) / Math.PI * 180) * direction + HS;
    if (!obstacles.length) {
        Power = Math.min(Math.floor(-VS / 2.5), 4);
        Rotation = Math.round(HS / 1.5);
        if (Y - objectifY < 140) {
            Rotation = 0;
            Power = Math.min(Math.floor(-VS / 3), 4);
        }
    }


    //TODO gérer la vitesse d'atterissage


    //FUTURE gérer la hauteur des obstacles
    pErr(obstacles, 'je suis en ' + X + ' à une hauteur de ' + Y);
    print(Rotation + ' ' + Power);
}
