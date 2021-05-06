/*
 Objectif
Dire si l'expression donnée en entrée est bien parenthésée. Une expression est bien parenthésée si les parenthèses (), les crochets [] et les accolades {} sont correctement appairés.

L'expression ne contient pas d'espaces.
Entrée
Une ligne de texte.
Sortie
true si les parenthèses (), crochets [] et accolades {} sont correctement appairés dans la ligne donnée, false sinon.
Contraintes
Longeur de la ligne ≤ 2048.
/Exemple/
----Entrée----

{([]){}()}

----Sortie----

true

*/

var expression = readline().split(''),
    acc = [0, 0, 0];
for (elem of expression) {
    if (elem == '[')
        acc[0]++;
    if (elem == ']')
        acc[0]--;
    if (elem == '(')
        acc[1]++;
    if (elem == ')')
        acc[1]--;
    if (elem == '{')
        acc[2]++;
    if (elem == '}')
        acc[2]--;
    if (acc.filter(x => x < 0).length)
        break;
}
print(!acc.reduce((tot, amount) => tot + amount));
