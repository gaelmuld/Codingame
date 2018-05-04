/***********************\
|*VARIABLES PRINCIPALES*|-------------------------------------
\***********************/

//WIDTH = 1920
const WIDTH = 1920;
//HEIGHT = 1000
const HEIGHT = 1000;
//RESOLUTION = 100
const RESOLUTION = 100;
//RANGEVIEW =900;
const RANGEVIEW = 900;

const nbSplitX = Math.floor(WIDTH / RESOLUTION);

const nbSplitY = Math.floor(HEIGHT / RESOLUTION);

//NONE = -1
const NONE = -1;
//FREE = -1
const FREE = -1;
//NEUTRAL = -1
const NEUTRAL = -1;
//MINE = 0  
const MINE = 0;
//TOWER = 1  
const TOWER = 1;
//BARRACKS = 2  
const BARRACKS = 2;
//ALLIER = 0  
const ALLIER = 0;
//ENNEMI = 1  
const ENNEMI = 1;
//QUEEN = - 1 
const QUEEN = -1;
//KNIGH = 0  
const KNIGHT = 0;
//ARCHER = 1  
const ARCHER = 1;
//GIANT = 2  
const GIANT = 2;
//['NONE', 'MINE', 'TOWER', 'BARRACKS']
const structureType = ['FREE', 'MINE', 'TOWER', 'BARRACKS'];
//['NONE', 'ALLIER', 'ENNEMI']
const owner = ['NEUTRAL', 'ALLIER', 'ENNEMI'];
//["NONE", "KNIGHT", "ARCHER", "GIANT"]
const hireUnit = ["NONE", "KNIGHT", "ARCHER", "GIANT"];
//["QUEEN", "KNIGHT", "ARCHER", "GIANT"]
const uniType = ["QUEEN", "KNIGHT", "ARCHER", "GIANT"];

var moveOnTime = {
        position: {
            px: 0,
            py: 0
        },
        turn: 0,
        reason: '',
        moving: false
    },
    /********************\
    |*Tableau des objets*|-----------------------------------
    \********************/
    ElemByTeam = [[[], []], [[], []], [[], []]]; //matrice 3 x 2 x taille de l'objet

/*************\
|*LES CLASSES*|-----------------------------------------------
\*************/

function Parcelle() {
    this.id;
    this.parcelX;
    this.parcelY;
    this.px;
    this.py;
    this.uniteValue = 0.0;
    this.posx0;
    this.posy0;
    this.posx1;
    this.posy1;

    this.pErr = function (message = '') {
        let always = message +
            "\nId : " + this.id +
            "\nCoords : " + this.px + " - " + this.py +
            "\n" + this.posx0 + " - " + this.posy0 +
            " " + this.posx1 + " - " + this.posy0 +
            "\n" + this.posx0 + " - " + this.posy1 +
            " " + this.posx1 + " - " + this.posy1 +
            "\n\nValue UNITE : " + this.uniteValue;
        printErr(always + '\n-------------\n');

    }
    this.setVal = function () {
        this.posx0 = RESOLUTION * this.parcelX;
        this.posy0 = RESOLUTION * this.parcelY;
        this.posx1 = RESOLUTION * (this.parcelX + 1);
        this.posy1 = RESOLUTION * (this.parcelY + 1);
        this.px = (this.posx0 + this.posx1) / 2;
        this.py = (this.posy0 + this.posy1) / 2;
    }
}

function Sites() {

    this.siteID;
    this.px;
    this.py;
    this.parcelX;
    this.parcelY;
    this.radius; // portée de contact
    this.gold; // used in future leagues
    this.maxMineSize; // used in future leagues
    this.structureType; // -1=NONE, 0=MINE, 1=TOWER, 2=BARRACKS
    this.owner; // -1=NEUTRAL, 0=ALLIER, 1=ENNEMI
    this.param1; // nb de tour avant arriver des renfort
    this.param2; // portée de la tour ou type de barrack 0=KNIGHT,1=ARCHER,2=GIANT
    this.uniteValue = 0;

    this.pErr = function (message = '') {
        let always = message + "\nId : " + this.siteID + " \nPOS= " + this.px + "x " + this.py + "y" + " \nRadius= " + this.radius + "\nUnite VALUE : " + this.uniteValue + " \nStructure= " + structureType[this.structureType + 1] + " " + owner[this.owner + 1];

        let build = "";
        let barrack = "\nNew soldier in = " + this.param1 + " \nType soldier =" + hireUnit[this.param2 + 1];
        let tower = "\nNew HealthTower = " + this.param1 + " \nType rangeAttak =" + this.param2;
        let mine = this.owner != ENNEMI ? "\nRate Mining = " + this.param1 : "";
        if (this.structureType == BARRACKS)
            build = barrack;
        if (this.structureType == TOWER)
            build = tower;
        if (this.structureType == MINE)
            build = mine;


        printErr(always + build + '\n--------------')
    }
    this.distance = (target => distance(this, target));

    this.setVal = function () {
        let values = [0, 0]; /*[HP MAX, uniteValue]*/
        if (this.owner == ALLIER) {
            if (this.structureType == MINE) {
                let mineRatio = 2 * ((this.gold + 100) / 300) + (this.maxMineSize * 0.7);
                values = [0, mineRatio];
            }
            if (this.structureType == TOWER)
                values = [this.param1, 2];
            if (this.structureType == BARRACKS)
                values = [0, 1];
        }


        if (this.owner == ENNEMI) {
            if (this.structureType == MINE)
                values = [0, 1];
            if (this.structureType == TOWER)
                values = [200, -0.25];
            if (this.structureType == BARRACKS)
                values = [0, -0.1];
        }

        this.uniteValue = Math.round(values[1] * 1000) / 1000;
        this.uniteValue != 0 ? elemEffect.push(this) : '';
    }
}



function Unites() {
    this.px;
    this.py;
    this.parcelX;
    this.parcelY;
    this.owner; // -1=NONE, 0=ALLIER, 1=ENNEMI
    this.unitType; // -1=QUEEN, 0=KNIGHT, 1=ARCHER, 2=GIANT
    this.health;
    this.uniteValue = 0;

    this.pErr = function (message = '') {
        let always = message + " \nPOS= " + this.px + "x " + this.py + "y" + " \nUnitType= " + uniType[this.unitType + 1] + ' ' + owner[this.owner + 1] + " \nHealth=" + this.health + "\nUnite VALUE : " + this.uniteValue;
        printErr(always + '\n--------------');
    }

    this.distance = (target => distance(this, target));

    this.setVal = function () {
        let values = [0, 0]; /*[HP MAX, uniteValue]*/
        if (this.owner == ALLIER) {
            if (this.unitType == QUEEN)
                values = [100, 0];
            if (this.unitType == KNIGHT)
                values = [30, 0.2];
            if (this.unitType == ARCHER)
                values = [45, 0.6];
            if (this.unitType == GIANT)
                values = [100, 0.3];
        }

        if (this.owner == ENNEMI) {
            if (this.unitType == QUEEN)
                values = [100, 0.2];
            if (this.unitType == KNIGHT)
                values = [30, -0.5];
            if (this.unitType == ARCHER)
                values = [45, -0.08];
            if (this.unitType == GIANT)
                values = [100, 0.1];
        }
        let Ratio = parseInt(this.health / values[0] * 100) / 100;
        this.uniteValue = values[1] * Ratio;
        elemEffect.push(this);
    }
}

function Compte() {
    this.gold;
    this.touchedSite; // -1 if none
    this.uniteValue = 0;

    this.pErr = function (message = '') {
        let always = message + " \nGold= " + this.gold + " \ntouchedSite =" + this.touchedSite
        printErr(always + '\n--------------');
    }
}

function printTab(table, message = '') {

    for (let t of table) {
        t.pErr(message);
    }
}

/***************\
|*LES FONCTIONS*|-------------------------------------------
\***************/

/**
 * calcule la distance de norme 2 sur un plan
 * @param   {object}  target1 cible 1 
 * @param   {object}  target2 cible 2
 * @returns {Integer} retourne la distance entre target1 et target2 arrondie à l'unité inférieur
 */
function distance(target1, target2) {
    var dx = target2.px - target1.px,
        dy = target2.py - target1.py;
    return parseInt(Math.sqrt(dx * dx + dy * dy));
}

function vectorAngle(origine, target, angle, length) {
    var v = [(target.px - origine.px) / origine.distance(target), (target.py - origine.py) / origine.distance(target)];
    var w = [v[0] * Math.cos(angle) - v[1] * Math.sin(angle), v[0] * Math.sin(angle) + v[1] * Math.cos(angle)]
    return [w[0] * length, w[1] * length];
}
/**
 * récupère les éléments les plus proches d'une cible selon la norme 2 sur un plan
 * @param   {object}        origine     l'objet origine ayant comme propriétés px (pos X) et py (pos Y)
 * @param   {Array[object]} tableTarget tableau d'objets de cible ayant comme propriétés px (pos X) et py (pos Y)
 * @param   {number}        nb          taille du tablea de retour 
 * @returns {Array[object]} renvoi un tableau contenant les nb cibles les plus proches
 */
function getNearest(origine, tableTarget, nb = 1) {
    nb > tableTarget.length ? nb = tableTarget.length : '';
    return tableTarget.length ? tableTarget.slice(0).sort((a, b) => origine.distance(a) - origine.distance(b)).slice(0, nb) : [origine];
}
/**
 * récupère les éléments les plus éloignées d'une cible selon la norme 2 sur un plan
 * @param   {object}        origine     l'objet origine ayant comme propriétés px (pos X) et py (pos Y)
 * @param   {Array[object]} tableTarget tableau d'objets de cible ayant comme propriétés px (pos X) et py (pos Y)
 * @param   {number}        nb          taille du tablea de retour 
 * @returns {Array[object]} renvoi un tableau contenant les nb cibles les plus éloignées
 */
function getFarest(origine, tableTarget, nb = 1) {
    nb > tableTarget.length ? nb = tableTarget.length : '';
    return tableTarget.length ? tableTarget.slice(0).sort((a, b) => origine.distance(b) - origine.distance(a)).slice(0, nb) : [origine];
}
/**
 * Nétoie les tableaux des unités
 */
function clears() {
    for (t of ElemByTeam) {
        t[1] = [];
    }

    parcel.map(p => p.map(m => {
        m.uniteValue = 0;
    }));
}
/**
 * Déplace un élément d'un tableau à l'autre        
 * @param {Site}    element l'élément à déplacer
 * @param {integer} newTeam team d'arrivée
 */
function switchTeamSites(element, newTeam) {
    if (element.owner == undefined) {
        ElemByTeam[newTeam + 1][0].push(element);
        return;
    }
    let teamFrom = element.owner;
    if (teamFrom != newTeam) {
        ElemByTeam[newTeam + 1][0].push(element);
        ElemByTeam[teamFrom + 1][0].splice((ElemByTeam[teamFrom + 1][0].indexOf(element)), 1);
    }
}
/**
 * Récupère la 'Queen' d'une équipe
 * @param   {[[Object]]} team équipe de la reine
 * @returns {object}     la reine en tant qu'objet
 */
function getQueen(team) {
    var result = team[1].filter(function (x) {
        return x.unitType === QUEEN;
    });
    return result[0];
}


function setValParcel(item) {
    let X = parseInt(item.px / RESOLUTION);
    let Y = parseInt(item.py / RESOLUTION);

    parcel[X][Y].uniteValue += item.uniteValue;
}

function countBarack(team, type) {

    return team[0].filter(x => x.param2 === type).length;

}

function countBuild(team, type) {

    return team[0].filter(x => x.structureType === type).length;

}

function moveElem(elem, fromArray, toArray) {
    if (fromArray.indexOf(elem) === -1 && fromArray !== toArray) {
        fromArray.splice(fromArray.indexOf(elem), 1);
    }
    toArray.push(elem);
}


/**************************\
|*Modifier infos parcelles*|----------------------------
\**************************/
function majParcel() {
    elemEffect.map(pE => setValParcel(pE));
    parcel.map(m => parcelInfos = parcelInfos.concat(m.filter(parc => parc.uniteValue != 0)));
}
/*************\
|*LES ACTIONS*|---------------------------------------------
\*************/


//CLOSE = 300
const CLOSE = 250;
//CLOSE = 300
const NEAR = 500;
//MIDDLE = 750
const MIDDLE = 750;
//FAR = 1000
const FAR = 1000;

var fear = function (dist, barem) {
    parcs = parcelInfos.filter(p => myQueen.distance(p) < dist);
    if (parcs.length > 0) {
        let count = 0;
        parcs.map(val => count += parseInt(val.uniteValue * 100) / 100);
        return count < barem;
    }
    return false
}
var attract = function (dist, barem) {
    parcs = parcelInfos.filter(p => myQueen.distance(p) > dist);
    if (parcs.length > 0) {
        let count = 0;
        parcs.map(val => count += parseInt(val.uniteValue * 100) / 100);
        return count < barem;
    }
    return false
}
/*************************\
|*Les actions de la reine*|-----------------------------
\*************************/

function ActionQueen() {
    var action = 'WAIT';
    var nbKnightBuild = countBarack(myTeam, KNIGHT);
    var nbMine = countBuild(myTeam, MINE);
    var nbTower = countBuild(myTeam, TOWER);
    /*********\
    |*NORMALE*|
    \*********/

    var objectif = getNearest(myQueen, sitesToCap)[0].siteID;
    var construct = 'BARRACKS-KNIGHT';
    printErr('nbKnightBuild = ' + nbKnightBuild + '\nnbMine = ' + nbMine + '\nnbTower = ' + nbTower);
    if (nbMine < nbKnightBuild * 3) {
        construct = 'MINE';
    } else if (nbMine >= nbTower + 1) {
        construct = 'TOWER';
    } else if (nbTower >= 3) {
        objectif = getNearest(myQueen, myBuilds.filter(x => x.param1 < x.maxMineSize && x.structureType === MINE))[0].siteID;
        construct = 'MINE';
    }
    if (!objectif) {
        objectif = getNearest(myQueen, sitesToCap)[0].siteID;
        construct = 'TOWER';
    }
    action = 'BUILD ' + objectif + ' ' + construct;


    /***********\
    |*OFFENSIVE*|
    \***********/

    /***********\
    |*DEFENSIVE*|
    \***********/


    return action;
}

/********************************\
|*les actions pour les batiments*|----------------------------
\********************************/


function actionBuild() {
    var nbKnightBuild = countBarack(myTeam, KNIGHT);
    var nbMine = countBuild(myTeam, MINE);
    var nbTower = countBuild(myTeam, TOWER);
    var action = 'TRAIN';
    /*********\
    |*NORMALE*|
    \*********/
    if (compte[0].gold > 80 && nbKnightBuild > 0) {
        let target = getNearest(ennemieQueen, myBuilds.filter(x => x.structureType === BARRACKS))[0].siteID
        action += ' ' + target;
    }



    /***********\
    |*OFFENSIVE*|
    \***********/


    /***********\
    |*DEFENSIVE*|
    \***********/



    return action;
}

/************************ *\
|*RÉCUPÉRATION DES DONNÉES*|-------------------------------------
\************************ */

var sites = [],
    units = [],
    compte = [new Compte],
    parcel = [],
    parcelInfos = [];

let semiRes = RESOLUTION * 0.5;
for (let i = 0; i <= nbSplitX; i++) {
    parcel[i] = [];
    for (let j = 0; j <= nbSplitY; j++) {
        parcel[i][j] = new Parcelle();
        let p = parcel[i][j];
        p.id = i + '-' + j;
        p.parcelX = i;
        p.parcelY = j;
        p.setVal();
    }
}
var numSites = parseInt(readline());
for (var i = 0; i < numSites; i++) {
    sites[i] = new Sites;
    var inputs = readline().split(' ');
    sites[i].siteID = parseInt(inputs[0]);
    sites[i].px = parseInt(inputs[1]);
    sites[i].parcelX = parseInt(parseInt(inputs[1]) / RESOLUTION);
    sites[i].py = parseInt(inputs[2]);
    sites[i].parcelY = parseInt(parseInt(inputs[2]) / RESOLUTION);
    sites[i].radius = parseInt(inputs[3]);
}
// game loop
while (true) {

    elemEffect = [];
    parcelInfos = [];
    var inputs = readline().split(' ');
    compte[0].gold = parseInt(inputs[0]);
    compte[0].touchedSite = parseInt(inputs[1]);
    for (var i = 0; i < numSites; i++) {
        var inputs = readline().split(' ');
        sites[i].siteID = parseInt(inputs[0]);
        sites[i].gold = parseInt(inputs[1]);
        sites[i].maxMineSize = parseInt(inputs[2]);
        sites[i].structureType = parseInt(inputs[3]);
        sites[i].param1 = parseInt(inputs[5]);
        sites[i].param2 = parseInt(inputs[6]);
        switchTeamSites(sites[i], parseInt(inputs[4]));
        sites[i].owner = parseInt(inputs[4]);
        sites[i].setVal();
    }
    clears();
    var numUnits = parseInt(readline());
    for (var i = 0; i < numUnits; i++) {
        units[i] = new Unites;
        var inputs = readline().split(' ');
        units[i].px = parseInt(inputs[0]);
        units[i].parcelX = parseInt(parseInt(inputs[0]) / RESOLUTION);
        units[i].py = parseInt(inputs[1]);
        units[i].parcelY = parseInt(parseInt(inputs[1]) / RESOLUTION);
        units[i].owner = parseInt(inputs[2]);
        units[i].unitType = parseInt(inputs[3]);
        units[i].health = parseInt(inputs[4]);
        ElemByTeam[units[i].owner + 1][1].push(units[i]);
        units[i].setVal();
    }
    /***********\
    |*affichage*|
    \***********/

    var myQueen = getQueen(ElemByTeam[1]),
        ennemieQueen = getQueen(ElemByTeam[2]),
        ennemiesBuilds = ElemByTeam[2][0],
        ennemiesUnites = ElemByTeam[2][1],
        ennemiesTeam = ElemByTeam[2][1],
        sitesToCap = ElemByTeam[0][0].concat(ElemByTeam[2][0].filter(x => x.structureType !== TOWER)),
        myBuilds = ElemByTeam[1][0],
        myUnits = ElemByTeam[1][1],
        myTeam = ElemByTeam[1];
    majParcel();
    print(ActionQueen());
    print(actionBuild());
}
