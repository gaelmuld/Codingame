/***********************\
|*VARIABLES PRINCIPALES*|-------------------------------------
\***********************/
const width = 1920;
const height = 1000;
const resolution = 100;
const nbSplitX = Math.floor(width / resolution);
const nbSplitY = Math.floor(height / resolution);

var structureType = ['NONE', '', 'TOWER', 'BARRACKS'], //batiments
    owner = ['NONE', 'ALLIER', 'ENNEMI'], //equipe
    hireUnit = ["NONE", "KNIGHT", "ARCHER", "GIANT"], //unite engageable
    uniType = ["QUEEN", "KNIGHT", "ARCHER", "GIANT"], //type d'unite
    moveOnTime = {
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
    this.centerX;
    this.centerY;
    this.value = 0;
    this.posx0;
    this.posy0;
    this.posx1;
    this.posy1;

    this.pErr = function (message = '') {
        let always = message +
            "\nId= " + this.id +
            "\nParcelle Coords= \n" +
            "" + this.posx0 + " - " + this.posy0 +
            " " + this.posx1 + " - " + this.posy0 +
            "\n" + this.posx0 + " - " + this.posy1 +
            " " + this.posx1 + " - " + this.posy1 +
            "\n\nValue = " + this.value;
        printErr(always);

    }
}

function Sites() {

    this.siteID;
    this.px;
    this.py;
    this.radius;
    this.ignore1; // used in future leagues
    this.ignore2; // used in future leagues
    this.structureType; // -1 = No structure, 2 = Barracks
    this.owner; // -1 = No structure, 0 = Friendly, 1 = Enemy
    this.team; // -1 = No structure, 0 = Friendly, 1 = Enemy
    this.param1; // nb de tour avant arriver des renfort
    this.hireUnit; /// -1 = No structure, 0 = KNIGHT, 1 = ARCHER
    this.forceValue = 0;
    this.rangeEffect = 0;

    this.pErr = function (message = '') {
        let always = message + "\nId= " + this.siteID + " \nPOS= " + this.px + "x " + this.py + "y" + " \nRadius= " + this.radius;
        let ignore = " \nIgnores= " + this.ignore1 + " / " + this.ignore2;
        let builded = " \nStructure= " + this.structureType + " \nOwner= " + this.owner;
        let building = " \nNew soldier in = " + this.param1 + " \nType soldier =" + this.hireUnit
        printErr(always +
            (this.owner !== 'NONE' ? builded : '') + (this.param1 !== -1 ? building : '') + "\n");
    }
    this.distance = (target => distance(this, target));
}



function Unites() {
    this.px;
    this.py;
    this.owner; // 'NONE', 'ALLIER', 'ENNEMI'
    this.team; // 0, 1, 2
    this.unitType; // QUEEN, KNIGHT, ARCHER, GIANT
    this.health;
    this.forceValue = 0;
    this.rangeEffect = 0;

    this.pErr = function (message = '') {
        let always = message + " \nPOS= " + this.px + "x " + this.py + "y" + " \nUnitType= " + this.unitType + ' ' + this.owner + " \nHealth=" + this.health + "\nVALUE= " + this.forceValue + "\nRANGE EFFECT= " + this.rangeEffect;
        printErr(always);
    }

    this.distance = (target => distance(this, target));

    this.setVal = function () {
        let values = [0, 0, 0]; /*[HP MAX, VALUE, RANGE]*/
        if (this.owner == 'ALLIER') {
            if (this.unitType == 'QUEEN')
                values = [100, 0, 0];
            if (this.unitType == 'KNIGHT')
                values = [30, 0.2, 400];
            if (this.unitType == 'ARCHER')
                values = [45, 0.8, 450];
            if (this.unitType == 'GIANT')
                values = [100, 0.35, 150];
        }

        if (this.owner == 'ENNEMI') {
            if (this.unitType == 'QUEEN')
                values = [100, 0.25, 600];
            if (this.unitType == 'KNIGHT')
                values = [30, -0.8, 500];
            if (this.unitType == 'ARCHER')
                values = [45, -0.05, 350];
            if (this.unitType == 'GIANT')
                values = [100, 0, 150];
        }
        this.forceValue = Math.round(values[1] * ((parseInt(this.health) * 2 + 10) / (10 + values[0] * 2)) * 1000) / 1000;
        this.rangeEffect = values[2];
    }
}

function Compte() {
    this.gold;
    this.touchedSite; // -1 if none
    this.forceValue = 0;

    this.pErr = function (message = '') {
        let always = message + " \nGold= " + this.gold + " \ntouchedSite =" + this.touchedSite
        printErr(always);
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

    parcel.map(p => p.map(m => m.value = 0));
}
/**
 * Déplace un élément d'un tableau à l'autre
 * @param {object}   element  l'élément à déplacer
 * @param {[object]} prevTeam tableau de départ. SI aucun, pas de problème
 * @param {[object]} newTeam  tableau d'arrivée
 */
function switchTeamSites(element, prevTeam = -1, newTeam) {
    ElemByTeam[newTeam][0].push(element);
    if (prevTeam !== -1) {
        ElemByTeam[prevTeam][0].splice((ElemByTeam[prevTeam][0].indexOf(element)), 1);
    }
}
/**
 * Récupère la 'Queen' d'une équipe
 * @param   {[[Object]]} team équipe de la reine
 * @returns {object}     la reine en tant qu'objet
 */
function getQueen(team) {
    var result = team[1].filter(function (x) {
        return x.unitType === 'QUEEN';
    });
    return result[0];
}


function getParcel(posX, posY) {
    return parseInt(posX / resolution) + '-' + parseInt(posY / resolution);
}

//function setValParcel(id, val) {
//    var i = id.split("-");
//    parcel[i[0]][i[1]].value += val;
//}

/*************\
|*LES ACTIONS*|---------------------------------------------
\*************/



/**************************\
|*Modifier infos parcelles*|----------------------------
\**************************/
//function majParcel() {
//    for (allie of myUnits) {
//        var currentParcel = getParcel(allie.px, allie.py);
//        setValParcel(currentParcel, allie.forceValue);
//    }
//    for (ennemi of ennemiesUnites) {
//        var currentParcel = getParcel(ennemi.px, ennemi.py);
//        setValParcel(currentParcel, ennemi.forceValue);
//    }
//
//    parcel.map(p => printTab(p.filter(f => f.value != 0)));
//}



/*************************\
|*Les actions de la reine*|-----------------------------
\*************************/

function ActionQueen() {
    var action = 'WAIT';

    /****************\
    |*Les conditions*|----------------------------------
    \****************/
    var ennemyTooClose = myQueen.distance(closestEnnemy) <= 280;
    var ennemyClose = myQueen.distance(closestEnnemy) < 700 && myQueen.distance(closestEnnemy) > 280;

    /*************\
    |*Les actions*|------------------------------------
    \*************/


    if (countBarrack(ElemByTeam[1], hireUnit[2]) < 2) {
        buildType = hireUnit[2]
    }
    if (ElemByTeam[0][0].length > 0) {
        action = 'BUILD ' + getNearest(myQueen, ElemByTeam[0][0])[0].siteID + ' BARRACKS-' + buildType;
    }
    if (ennemyClose) {
        moveOnTime.reason = "DANGER";
        moveOnTime.moving = false;
        moveOnTime.turn = 0;
    } else {
        moveOnTime.reason = "COOL";
        moveOnTime.moving = false;
        moveOnTime.turn = 0;
    }
    if (ennemyTooClose && moveOnTime.turn == 0) {
        let safeBuild = getFarest(myQueen, myBuilds.filter(x => x.hireUnit == hireUnit[2]))[0];
        let safePoint = {
            px: parseInt(safeBuild.px * 1.05 - closestEnnemy.px * 0.05),
            py: parseInt(safeBuild.px * 1.05 - closestEnnemy.px * 0.05)
        };
        moveOnTime.position.px = safePoint.px;
        moveOnTime.position.py = safePoint.py;
        moveOnTime.turn = 3;
        moveOnTime.reason = "WARN";
        moveOnTime.moving = true;
    }

    if (moveOnTime.moving) {
        action = 'MOVE ' + moveOnTime.position.px + ' ' + moveOnTime.position.px;
        moveOnTime.turn--;
    }
    return action;
}

/********************************\
|*les actions pour les batiments*|----------------------------
\********************************/

function countBarrack(team, type) {
    return team[0].filter(
        function (x) {
            return x.hireUnit === type;
        }
    ).length;
}

function moveElem(elem, fromArray, toArray) {
    if (fromArray.indexOf(elem) === -1 && fromArray !== toArray) {
        fromArray.splice(fromArray.indexOf(elem), 1);
    }
    toArray.push(elem);
}

function actionBuild() {
    var action = 'TRAIN';
    /****************\
    |*Les conditions*|---------------------------------------
    \****************/

    var goDef = (moveOnTime.reason == "DANGER" || moveOnTime.reason == "WARN") && myUnits.filter(unit => unit.unitType == 'ARCHER').length < 6;

    /*************\
    |*les actions*|------------------------------------------
    \*************/

    if (myBuilds.length > 0) {
        var pos = -1,
            barrack = myBuilds[0],
            buildType = hireUnit[1];

        if (!goDef && compte[0].gold >= 180) {
            pos = myBuilds.indexOf(getNearest(ennemieQueen, myBuilds.filter(function (x) {
                return x.hireUnit == hireUnit[1];
            }))[0]);
        }
        if (goDef && compte[0].gold >= 100) {
            pos = myBuilds.indexOf(getNearest(myQueen, myBuilds.filter(function (x) {
                return x.hireUnit == hireUnit[2];
            }))[0]);
        }
        if (pos != -1) {
            barrack = myBuilds[pos];
            action += ' ' + barrack.siteID;
        }

    }
    return action;
}

/************************ *\
|*RÉCUPÉRATION DES DONNÉES*|-------------------------------------
\************************ */

var sites = [],
    units = [],
    compte = [],
    parcel = [];


let semiRes = resolution * 0.5;
for (let i = 0; i < nbSplitX; i++) {
    parcel[i] = [];
    for (let j = 0; j < nbSplitY; j++) {
        parcel[i][j] = new Parcelle();
        let p = parcel[i][j];
        p.id = i + '-' + j;
        p.centerX = resolution * (i + 0.5);
        p.centerY = resolution * (j + 0.5);
        p.posx0 = p.centerX - (semiRes);
        p.posy0 = p.centerY - (semiRes);
        p.posx1 = p.centerX + (semiRes);
        p.posy1 = p.centerY + (semiRes);
    }
}
var numSites = parseInt(readline());
for (var i = 0; i < numSites; i++) {
    sites[i] = new Sites;
    var inputs = readline().split(' ');
    sites[i].siteID = parseInt(inputs[0]);
    sites[i].px = parseInt(inputs[1]);
    sites[i].py = parseInt(inputs[2]);
    sites[i].radius = parseInt(inputs[3]);
}
// game loop
while (true) {
    compte[0] = new Compte;
    var inputs = readline().split(' ');
    compte[0].gold = parseInt(inputs[0]);
    compte[0].touchedSite = parseInt(inputs[1]);
    for (var i = 0; i < numSites; i++) {
        var inputs = readline().split(' ');
        var previousTeam = sites[i].team;
        sites[i].siteID = parseInt(inputs[0]);
        sites[i].ignore1 = parseInt(inputs[1]);
        sites[i].ignore2 = parseInt(inputs[2]);
        sites[i].structureType = structureType[parseInt(inputs[3]) + 1];
        let team = parseInt(inputs[4]) + 1;
        sites[i].owner = owner[team];
        sites[i].team = team;
        sites[i].param1 = parseInt(inputs[5]);
        sites[i].hireUnit = hireUnit[parseInt(inputs[6]) + 1];
        if (previousTeam !== team) {
            switchTeamSites(sites[i], previousTeam, team);
        } else if (previousTeam === "undefined") {
            ElemByTeam[team][0].push(sites[i]);
        }
    }
    clears();

    var numUnits = parseInt(readline());
    for (var i = 0; i < numUnits; i++) {
        units[i] = new Unites;
        var inputs = readline().split(' ');
        units[i].px = parseInt(inputs[0]);
        units[i].py = parseInt(inputs[1]);
        let team = parseInt(inputs[2]) + 1;
        units[i].owner = owner[team];
        units[i].team = team;
        units[i].unitType = uniType[parseInt(inputs[3]) + 1];
        units[i].health = parseInt(inputs[4]);
        if (!ElemByTeam[team][1].includes(units[i])) {
            ElemByTeam[team][1].push(units[i]);
        }
        units[i].setVal();
    }
    /***********\
    |*affichage*|
    \***********/

    var buildType = hireUnit[1],
        myQueen = getQueen(ElemByTeam[1]),
        ennemieQueen = getQueen(ElemByTeam[2]),
        ennemiesBuilds = ElemByTeam[2][1],
        ennemiesUnites = ElemByTeam[2][1],
        myBuilds = ElemByTeam[1][0],
        myUnits = ElemByTeam[1][1],
        closestEnnemy = getNearest(myQueen, ennemiesUnites)[0];
    //    majParcel();
    print(ActionQueen());
    print(actionBuild());
}
