/**
 * Survive the wrath of Kutulu
 * Coded fearlessly by JohnnyYuge & nmahoude 
 * (ok we might have been a bit scared by the old god...but don't say anything)
 **/

const iconeType = {
    EXPLORER: '|',
    WANDERER: 'O',
    SPAWNER: '@'
}

function Terrain(width, height) {
    this.width = width;
    this.height = height;
    this.mapping = [];
    this.buffMapping = [];

    this.calcArea = function () {
        return this.width * this.height;
    }

    this.printRealTime = function () {
        //        this.mapping.map(x => printErr(x.reduce((a, b) => a + b)));
        this.buffMapping.map(x => printErr(x.reduce((a, b) => a + b)));
    }
    this.updateMap = function (x, y, entityType, i) {
        if (this.mapping[y][x] == 'w' && entityType == 'WANDERER')
            entityType = 'SPAWNER';
        if (i == 0) {
            var buffer = this.mapping.map(l => l.slice());
            buffer[y][x] = iconeType[entityType];
            this.buffMapping = buffer;
        } else {
            var buffer = this.buffMapping.map(l => l.slice());
            buffer[y][x] = iconeType[entityType];
            this.buffMapping = buffer;
        }

    }

}

function Unite(unite) {
    //type d'unité EXPLORER , WANDERER
    this.entityType = unite[0];
    //Id de l'unité
    this.id = parseInt(unite[1]);
    //position X de l'unité
    this.x = parseInt(unite[2]);
    //position Y de l'unité
    this.y = parseInt(unite[3]);
    /*
    Explorateur : santé mentale - 
    Minion en cours d'invocation : temps avant d'être invoqué - 
    Wanderer : temps avant d'être rappelé 
    */
    this.param0 = parseInt(unite[4]);
    /*
    Explorateur : ignoré pour cette ligue - 
    Minion : l'état actuel du minion -> SPAWNING = 0 , WANDERING = 1 
    */
    this.param1 = parseInt(unite[5]);
    /*     
    Explorateur : ignoré pour cette ligue - 
    Minion : id de l'explorateur ciblé par ce minion. -1 s'il n'a pas de cible (ça n'arrive qu'au premier tour de spawn des wanderers) 
    */
    this.param2 = parseInt(unite[6]);
    this.toString = function () {
        let infos = '';
        if (this.entityType == 'EXPLORER') {
            infos = 'Santé mentale : ' + this.param0;
        }
        if (this.entityType == 'WANDERER') {
            infos = (this.param1 ? 'Temps de vie : ' : 'Temps avant apparition : ') + this.param0 + ' Tours'
            '\nCible :' + this.param2;
        }
        printErr('ID : ' + this.id + ' - Type : ' + this.entityType +
            '\nPosition : ' + this.x + '-' + this.y +
            '\n---INFO---\n' + infos + '\n----------\n'
        );
    }
    this.distance = function (unite) {
        return distance(this, unite)
    }
}
/**
 * distance entre deux point
 * @param   {object} uniteA premiere unité
 * @param   {object} uniteB deuxième unité
 * @returns {int}    la distance Manathan entre les deux unités
 */
function distance(uniteA, uniteB) {
    if (uniteB) {
        dx = Math.abs(uniteA.x - uniteB.x);
        dy = Math.abs(uniteA.y - uniteB.y);
        return dx + dy;
    }
    return 999;
}


function Nearest(liste, origine = unites[0], type = "EXPLORER") {
    let objectif = liste.filter(x => x.entityType == type).sort((a, b) => distance(a, origine) - distance(b, origine));
    return objectif[0];
}
/********************************\
|*Mouvement de notre explorateur*|
\********************************/

//mon explorateur
function action() {
    let me = unites[0],
        others = unites.filter(x => x.id != me.id),
        target = Nearest(others, me, "EXPLORER") || me,
        ennemie = Nearest(others, me, "WANDERER"),
        action = ('MOVE ' + target.x + " " + target.y);
    if (distance(me, ennemie) <= 1) {
        let oppY = parseInt(me.x - ennemie.x),
            oppX = parseInt(me.y - ennemie.y);

    }
    action = ('MOVE ' + (target.x + oppX) + " " + (target.y + oppY))
}
print(action)
}




/*---------------------------------*/


//Largeur du terrain
var width = parseInt(readline());
//Hauteur du terrain
var height = parseInt(readline());

//Mappage du terrain
var lines = [];
for (var i = 0; i < height; i++) {
    lines[i] = readline().split('');
}
/************\
|*Le terrain*|
\************/
let map = new Terrain(width, height);
map.mapping = lines;
map.buffMapping = lines;



var inputs = readline().split(' ');
// Combien de santée mentale on perde, seul, à chaque tour. Toujours 3 jusqu'au bois 1
var sanityLossLonely = parseInt(inputs[0]);
// Combien de santée mentale on perde, entouré, à chaque tour. Toujours 3 jusqu'au bois 1
var sanityLossGroup = parseInt(inputs[1]);
// Combien de tour prend un errant pour apparaitre. Toujours 3 jusqu'au bois 1
var wandererSpawnTime = parseInt(inputs[2]);
// Durée de vie d'un errant . Toujours 40 jusqu'au bois 1
var wandererLifeTime = parseInt(inputs[3]);

// tour de jeu
while (true) {
    // La première entité correspond à votre explorateur
    var entityCount = parseInt(readline()),
        unites = [];
    for (var i = 0; i < entityCount; i++) {
        unites[i] = new Unite(readline().split(' '));
        map.updateMap(unites[i].x, unites[i].y, unites[i].entityType, i);
        //        unites[i].toString();
    }

    action();
    //    printErr(map.calcArea());
    //    map.printRealTime();
    // MOVE <x> <y> | WAIT
}
