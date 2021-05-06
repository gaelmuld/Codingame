var v1 = parseInt(readline()),
    v2 = parseInt(readline()),
    i = 0;
const reducer = (accumulator, currentValue) => accumulator + parseInt(currentValue);
while (v1 != v2) {
    let r1 = ('' + v1).split(""),
        r2 = ('' + v2).split("");

    if (v1 < v2) {
        v1 += r1.reduce(reducer, 0);
    } else {
        v2 += r2.reduce(reducer, 0);
    }
}
print(v1)
