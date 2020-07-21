export class UtilityClass {
    fnStringToDate(sFecha){ 
        var a = sFecha.split(/[^0-9]/);  
        return new Date(parseInt(a[0]), parseInt(a[1])-1 || 0, parseInt(a[2]) || 1, parseInt(a[3]) || 0, parseInt(a[4]) || 0, parseInt(a[5]) || 0, parseInt(a[6]) || 0);
    }
}