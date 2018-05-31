/*

 Objectif
Given a chemical formula, balance the elements present and print out the balanced equation.

Molecules will be given in a simplified molecular formula. Elements are recorded as either a single uppercase letter or as an uppercase and lowercase letter together, followed by a number if greater than 1:
H - 1 atom of Hydrogen
He - 1 atom of Helium
C6H12O6 - 6 atoms of Carbon, 12 atoms of Hydrogen, and 6 atoms of Oxygen
H2O - 2 atoms of Hydrogen, 1 atom of Oxygen

Different molecules on a single side of the equation are separated by a plus sign surrounded by spaces:
H2 + O2
C6H12O6 + H20 + O2

Each side of the equation is split by an ASCII arrow (hyphen-greater than) surrounded by spaces: ->

A full equation may look like:
C6H12O6 + O2 -> CO2 + H2O

A balanced equation where each molecule is prefixed with the coresponding coefficient when greater than 1. Ratios of coefficients should be reduced to the smallest whole integers. Molecules should be in the same order given.
C6H12O6 + 6O2 -> 6CO2 + 6H20

The equation string will only contain letters, numbers, spaces, and the symbols for plus and an arrow. [A-Za-z0-9+-> ] There will be no parenthesis.
Entrée
Line 1: One line consisting of a chemical equation that can be balanced in only one way.
Sortie
The corresponding balanced equation.
Contraintes
Each input will have only one way to balance the equation.
Exemple
Entrée

H2 + O2 -> H2O

Sortie

2H2 + O2 -> 2H2O
*/

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var unbalanced = readline();
var equation = unbalanced.split('=>');
var produits = equation[0].split(' + ');
var solutions = equation[1].split(' + ');
var elements = {
    prod: {},
    sol: {}
}
produits.map(x => )


const regex = /(^[0-9]*)|([A-Z]{1}[a-z]*)([0-9]*)/gm;
const str = `4Na2OH2`;
let m;

while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);
    });
}


// Write an action using print()
// To debug: printErr('Debug messages...');

print('balanced');
