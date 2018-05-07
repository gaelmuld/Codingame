// game loop
//class
function pod() {
    this.px; //position X
    this.py; //position Y
    this.vx; //vitesse X
    this.vy; //vitesse Y
    this.angle; //angle absolue, en degré. 0° signifie faire face à l'EST tandis que 90°, faire face au SUD.
    this.nextCheckPointId; //id du prochain CP
    this.correctionX = 0; //correction X 
    this.correctionY = 0; //correction Y 
    this.nextCheckpointDistPrev = 1; // précédente distance du CP
    this.boostDone = 1; // Boost ?
    this.distCPx;
    this.distCPy;
    this.angleCP;
    this.distCP;
    this.angleRelative;
    this.ratioAngle;
    this.ratioDistance;
    this.ratioCorrection;
    this.directionX;
    this.directionY;
}

function bornee(val, max, min) {
    return Math.min(Math.max(val, min), max);
}
// variables globale
var laps = readline(); //lap  total
var checkpointCount = readline(); //nb de CP
var myPods = []; // mes pods
myPods[0] = new pod(); //pods n°1
myPods[1] = new pod(); //pods n°2
var oppPods = []; // pods adverse
oppPods[0] = new pod(); //pods n°1
oppPods[1] = new pod(); //pods n°2
var CPx = []; // position X des CPs
var CPy = []; // position Y des CPs
for (var i = 0; i < checkpointCount; i++) {
    var inputs = readline().split(' ');
    CPx.push(inputs[0]);
    CPy.push(inputs[1]);
}
var CPs = [CPx, CPy]; //position des CPs

while (true) {
    for (var i = 0; i < 2; i++) {
        var inputs = readline().split(' ');
        p = myPods[i];
        //definition variables class
        p.px = parseInt(inputs[0]); //position X
        p.py = parseInt(inputs[1]); //position Y
        p.vx = parseInt(inputs[2]); //vitesse X
        p.vy = parseInt(inputs[3]); //vitesse Y
        p.angle = parseInt(inputs[4]); //angle absolue, en degré. 0° signifie faire face à l'EST tandis que 90°, faire face au SUD.
        p.nextCheckPointId = parseInt(inputs[5]); //id du prochain CP
        p.distCPx = CPs[0][p.nextCheckPointId] - p.px;
        p.distCPy = CPs[1][p.nextCheckPointId] - p.py;
        if (p.distCPx <= 0) {
            p.angleCP = Math.round(180 + Math.atan(p.distCPy / p.distCPx) / Math.PI * 180) % 360;
        } else {
            p.angleCP = Math.round(360 + Math.atan(p.distCPy / p.distCPx) / Math.PI * 180) % 360;
        }
        p.distCP = Math.sqrt(Math.pow(p.distCPx, 2) + Math.pow(p.distCPy, 2));
        p.angleRelative = p.angle - p.angleCP;

        /**************************************
         *******Correction de trajectoire*******
         **************************************/

        p.correctionX = ((p.distCPy * p.angleRelative / 60) * 2 + p.correctionX * 3) / 5;
        p.correctionY = ((-p.distCPx * p.angleRelative / 60) * 2 + p.correctionY * 3) / 5;
        p.ratioCorrection = bornee(10000 / (p.distCP + 3000), 2.4, 0);
        printErr('angleRelative = ' + p.angleRelative);

        p.correctionXPrev = 0;
        p.correctionYPrev = 0;
    }
    for (var i = 0; i < 2; i++) {
        var inputs = readline().split(' ');

        p = oppPods[i];
        //definition variables class
        p.px = parseInt(inputs[0]); //position X
        p.py = parseInt(inputs[1]); //position Y
        p.vx = parseInt(inputs[2]); //vitesse X
        p.vy = parseInt(inputs[3]); //vitesse Y
        p.angle = parseInt(inputs[4]); //angle absolue, en degré. 0° signifie faire face à l'EST tandis que 90°, faire face au SUD.
        p.nextCheckPointId = parseInt(inputs[5]); //id du prochain CP
        p.distCPx = CPs[0][p.nextCheckPointId] - p.px;
        p.distCPy = CPs[1][p.nextCheckPointId] - p.py;
        p.angleCP = Math.atan(p.distCPy / p.distCPx) / Math.PI * 180;
        p.distCP = Math.sqrt(Math.pow(p.distCPx, 2) + Math.pow(p.distCPy, 2));
        p.angleRelative = Math.abs(p.angle - p.angleCP);

    }
    var o = oppPods
    for (var i = 0; i < 2; i++) {
        p = myPods[i];

        /********\
        |base race|
        \********/

        p.ratioDistance = 10;
        if (p.distCP > 6000) { // longue distance
            p.ratioAngle = bornee((130 - p.angleRelative) / 5, 10, 0);
        } else if (p.distCP > 4000) { //moyenne distance
            p.ratioAngle = bornee((100 - p.angleRelative) / 9, 10, 0);
        } else { //courte distance
            p.ratioAngle = bornee((50 - p.angleRelative) / 4.5, 10, 0);
        }

        thrust = Math.round(p.ratioAngle * p.ratioDistance);
        p.directionX = parseInt(CPs[0][p.nextCheckPointId]);
        p.directionY = parseInt(CPs[1][p.nextCheckPointId]);


        /************\
        |END base race|
        \************/

        /******************
         ******contact******
         ******************/
        for (var k in o) {
            var distOpposant = Math.round(Math.sqrt(Math.pow((o[k].px - p.px), 2) + Math.pow((o[k].py - p.py), 2)));
            var prodScalaireOpposant = Math.round(((o[k].distCPx * p.distCPx) + (o[k].distCPy * p.distCPy)) / Math.pow(o[k].distCP, 2) * 100);

            printErr('dist(p[' + i + '],o[' + k + ']) = ' + distOpposant + ' - prodSc(p[' + i + '],o[' + k + '])t = ' + prodScalaireOpposant);

        }

        /*if(distOpponent<3500 && p.distCP<5000 && produitScalaireOpponent > 95){
                directionX=Math.floor((opponentX+nextCheckpointX*2)/3);
                directionY=Math.floor((opponentY+nextCheckpointY*2)/3);
                if(nextCheckpointDist<1600){
                    directionX=nextCheckpointX;
                    directionY=nextCheckpointY;
                }
        }*/

        /************************************
         *******CORRECTION TRAJECTOIRE*******
         ************************************/



        if (p.angleRelative < 120 && p.distCP < 9000) {
            p.directionX += Math.round(p.correctionX * p.ratioCorrection);
            p.directionY += Math.round(p.correctionY * p.ratioCorrection);
        }

        /*******************
         *******SORTIE*******
         *******************/

        print(p.directionX + ' ' + p.directionY + ' ' + thrust);
    }

    /************\
    |Vectors infos|
    \************/
    //var opponentNextCheckpointDist = Math.sqrt(Math.pow(opponentVectDistX,2)+Math.pow(opponentVectDistY,2));
    //var VectDistX=nextCheckpointX-x;
    //var VectDistY=nextCheckpointY-y;
    //var produitScalaireOpponent=Math.round(((opponentVectDistX*VectDistX)+(opponentVectDistY*VectDistY))/Math.pow(opponentNextCheckpointDist,2)*100);

}
