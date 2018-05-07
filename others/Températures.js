n = readline()*1
i = readline().split(' ')
for(j=0;n;){
    i.indexOf(""+j)<0?n=0:j=-j;
    i.indexOf(""+j)<0?n=0:j=-(j-1);
}
print(j)