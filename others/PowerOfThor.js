i = readline().split(' ');
X = i[2] - i[0];
Y = i[3] - i[1];
while (1) {
    print((Y ? (Y > 0 ? Y-- && 'N' : Y++ && 'S') : '') +
        (X ? (X > 0 ? X-- && 'W' : X++ && 'E') : ''))

}

A = X ? (Y > 0 ? Y-- && 'N' : Y++ && 'S') : '';
B = Y ? (X > 0 ? X-- && 'W' : X++ && 'E') : '';
print(A + B)
