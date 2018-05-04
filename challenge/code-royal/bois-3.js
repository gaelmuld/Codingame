/***********************\
|*Variables principales*|
\***********************/
var structureType = ['NONE', '', '', 'BARRACKS'], //batiments
    owner = ['NONE', 'ALLIER', 'ENNEMI'], //equipe
    param2 = ['NONE', 'KNIGHT', 'ARCHER'], //unite dispo
    uniType = ["QUEEN", "KNIGHT", "ARCHER"], //type d'unite
    moveOnTime = {
        position: {
            px: 0,
            py: 0
        },
        turn: 0,
        reason: '',
        moving: false
    }
/*************\
|*Les classes*|
\*************/
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
    this.param2; /// -1 = No structure, 0 = KNIGHT, 1 = ARCHER
    this.pErr = function (message = '') {
        let always = message + "\nId= " + this.siteID +
            " \nPOS= " + this.px + "x " + this.py + "y" +
            " \nRadius= " + this.radius;
        let ignore =
            " \nIgnores= " + this.ignore1 + " / " + this.ignore2;
        let builded =
            " \nStructure= " + this.structureType +
            " \nOwner= " + this.owner;
        let building =
            " \nNew soldier in = " + this.param1 +
            " \nType soldier =" + this.param2
        printErr(always +
            (this.owner !== 'NONE' ? builded : '') + (this.param1 !== -1 ? building : '') + "\n");
    }
    this.distance = (target => distance(this, target));
}



function Unites() {
    this.px;
    this.py;
    this.owner; // -1 = No structure, 0 = Friendly, 1 = Enemy
    this.team; // -1 = No structure, 0 = Friendly, 1 = Enemy
    this.unitType; // -1 = QUEEN, 0 = KNIGHT, 1 = ARCHER
    this.health;

    this.pErr = function (message = '') {
        let always = message + " \nPOS= " + this.px + "x " + this.py + "y" +
            " \nUnitType= " + this.unitType + ' ' + this.owner +
            " \nHealth=" + this.health
        printErr(always);
    }

    this.distance = (target => distance(this, target));
}

function Compte() {
    this.gold;
    this.touchedSite; // -1 if none

    this.pErr = function (message = '') {
        let always = message + " \nGold= " + this.gold +
            " \ntouchedSite =" + this.touchedSite
        printErr(always);
    }
}

function printTab(table, message = '') {

    for (let t of table) {
        t.pErr(message);
    }
}

/***************\
|*LES FONCTIONS*|
\***************/
function distance(target1, target2) {
    return parseInt(Math.round(Math.sqrt(Math.pow(target2.px - target1.px, 2) + Math.pow(target2.py - target1.py, 2))));
}

function getNearest(target1, targets) {
    if (targets.length) {
        var nearest = targets[0];
        for (let i = 0, l = targets.length; i < l; i++) {
            if (target1.distance(targets[i]) < target1.distance(nearest)) {
                nearest = targets[i];
            }
        }
        return nearest;
    } else {
        return;
    }
}

function getFarest(target1, targets) {
    if (targets.length) {
        var farest = targets[0];
        for (let i = 0, l = targets.length; i < l; i++) {
            if (target1.distance(targets[i]) > target1.distance(farest)) {
                farest = targets[i];
            }
        }
        return farest;
    } else {
        return;
    }
}

function clearUnites() {
    for (t of ElemByTeam) {
        t[1] = [];
    }
}

function switchTeamSites(element, prevTeam = -1, newTeam) {
    ElemByTeam[newTeam][0].push(element);
    if (prevTeam !== -1) {
        ElemByTeam[prevTeam][0].splice((ElemByTeam[prevTeam][0].indexOf(element)), 1);
    }
}
/***************\
|*Pour la reine*|
\***************/
function getQueen(team) {
    var result = team[1].filter(function (x) {
        return x.unitType === 'QUEEN';
    });
    return result[0];
}


function ActionQueen() {
    var action = 'WAIT',
        buildType = param2[1],
        myQueen = getQueen(ElemByTeam[1]),
        ennemieQueen = getQueen(ElemByTeam[2]),
        ennemiesBuilds = ElemByTeam[2][1],
        ennemiesUnites = ElemByTeam[2][1],
        myBuilds = ElemByTeam[1][0],
        myUnits = ElemByTeam[1][1],
        closestEnnemy = getNearest(myQueen, ennemiesUnites);


    /****************\
    |*Les conditions*|
    \****************/
    var ennemyTooClose = myQueen.distance(closestEnnemy) <= 370;
    var ennemyClose = myQueen.distance(closestEnnemy) < 900 && myQueen.distance(closestEnnemy) > 370;

    /*************\
    |*Les actions*|
    \*************/


    if (countBarrack(ElemByTeam[1], param2[2]) < 2) {
        buildType = param2[2]
    }
    if (ElemByTeam[0][0].length > 0) {
        action = 'BUILD ' + getNearest(myQueen, ElemByTeam[0][0]).siteID + ' BARRACKS-' + buildType;
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
        let safeBuild = getFarest(myQueen, myBuilds.filter(function (x) {
            return x.param2 == param2[2]
        }));

        let safePoint = {
            px: parseInt(Math.ceil(safeBuild.px * 1.05 - closestEnnemy.px * 0.05)),
            py: parseInt(Math.ceil(safeBuild.px * 1.05 - closestEnnemy.px * 0.05))
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

/********************\
|*Pour les batiments*|
\********************/
function countBarrack(team, type) {
    return team[0].filter(
        function (x) {
            return x.param2 === type;
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
    var action = 'TRAIN',
        myBuilds = ElemByTeam[1][0],
        myUnits = ElemByTeam[1][1],
        myQueen = getQueen(ElemByTeam[1]),
        ennemieQueen = getQueen(ElemByTeam[2]),
        ennemiesBuilds = ElemByTeam[2][1],
        ennemiesUnites = ElemByTeam[2][1],
        closestEnnemy = getNearest(myQueen, ennemiesUnites);
    /****************\
    |*Les conditions*|
    \****************/

    var goDef = (moveOnTime.reason == "DANGER" || moveOnTime.reason == "WARN") && myUnits.filter(unit => unit.unitType == 'ARCHER').length < 6;

    /*************\
    |*les actions*|
    \*************/

    if (myBuilds.length > 0) {
        var pos = -1,
            barrack = myBuilds[0],
            buildType = param2[1];

        if (!goDef && compte[0].gold >= 180) {
            pos = myBuilds.indexOf(getNearest(ennemieQueen, myBuilds.filter(function (x) {
                return x.param2 == param2[1];
            })));
        }
        if (goDef && compte[0].gold >= 100) {
            pos = myBuilds.indexOf(getNearest(myQueen, myBuilds.filter(function (x) {
                return x.param2 == param2[2];
            })));
        }
        if (pos != -1) {
            barrack = myBuilds[pos];
            action += ' ' + barrack.siteID;
        }

    }
    return action;
}






/*********************\
|*creation des objets*|
\*********************/
var sites = [];
var units = [];
var compte = [];
var ElemByTeam = [[[], []], [[], []], [[], []]]; //matrice 3 x 2 x taille de l'objet

/*************************\
|*recupérations des infos*|
\*************************/
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
        sites[i].param2 = param2[parseInt(inputs[6]) + 1];
        if (previousTeam !== team) {
            switchTeamSites(sites[i], previousTeam, team);
        } else if (previousTeam === "undefined") {
            ElemByTeam[team][0].push(sites[i]);
        }
    }
    clearUnites();
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
    }

    /***********\
    |*affichage*|
    \***********/

    // First line: A valid queen action
    // Second line: A set of training instructions
    //    for (let e of ElemByTeam[0]) {
    //        e.pErr('élém :');
    //    };

    //    print('WAIT');
    print(ActionQueen());
    print(actionBuild());
}
