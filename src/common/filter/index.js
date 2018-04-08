//转化为整数
const  intval = (num)=>{
    var ret = parseInt(num);
    return isNaN(ret) ?  0 : ret;
};
/**
 * 不足补零
 * @param num 必需。规定被补零的数字
 * @param n 可选。 规定补零后的长度，默认两位
 */
const appendZero = (num, n)=>{
    n = n ? n : 2;
    var remainLen = n-(''+num).length > 0 ? n-(''+num).length : 0;
    return Array(remainLen+1).join(0) + num;
};
const zeroDot  = (num) => {
    let nums = num;
    let a = '0.00';
    num =='0'? nums=a : num;
    return nums

}
//格式化时间
const dateType = (str)=>{
    if(str.includes('-')){
        let arr = str.split('-');
        for(let i=0;i<arr.length;i++){
            if(arr[i].length<2){
                arr[i] = 0+arr[i]
            }
        }
        return arr.join('-')
    }

}
/**
 * 字符串替换 默认去除所有空格
 * @string  必需。规定被搜索的字符串。
 * @find 可选。规定要查找的值。
 * @replace 可选。规定替换 find 中的值的值。
 * @place 可选。规定替换 string 的位置：左右 左 右 所有，默认所有。
 */
const strReplace = (string,find,replace,place)=>{
    find = typeof(find) == 'undefined' ? ' ' : find;
    replace = typeof(replace) == 'undefined' ? '' : replace;
    place = typeof(place) == 'undefined' ? 'all' : place;
    var placeList = {
        "left" : "^[" + find + "]",
        "right" : "[" + find + "]$",
        "both" : "^[" + find + "]|[" + find + "]$",
        "all" : "[" + find + "]"
    };
    placeList[place] = typeof(placeList[place]) == 'undefined' ? placeList['all'] : placeList[place];
    var reg =new RegExp(placeList[place],"ig"); // reg为 /[变量]/ig
    return string.replace(reg,replace);
};
/**
 * 模糊手机号
 * eg：13917883434 变成 139****3434
 */
const blurPhone = (phone)=>{
    phone = phone+'';
    if(phone.length>0){
        return phone.substring( 0, 3) + '****' + phone.substring(7);
    }else{
        return phone;
    }

};
/**
 * [bankCard 脱敏格式化]
 * @param  {[type]} str [description]
 * @return {[type]} s  [description]
 */

 const bankCard = (str)=>{
    let s = "";
     s = `${'*'.repeat(str.length-4)}${str.substring(str.length-4)}`;
    if(str.length%4 !=0){
        let st = s.substring(0,s.length%4);
        s =st +' '+ s.substr(s.length%4,str.length).replace(/(\S{4})/g,'$1 ').replace(/\s*$/,'');
    }else{
        s = s.replace(/(\S{4})/g,'$1 ').replace(/\s*$/,'');
    }
    return s

}
/**
 * 格式化手机号
 * eg：13917883434 变成 139 1788 3434
 */
const formatPhone = (phone)=>{
    phone = strReplace(phone);
    return phone.substring( 0, 3) + ' ' + phone.substring( 3 , 7) + ' ' + phone.substring(7);
};
const monenyStyle = (value) =>{
    if (!value) { return '0.00'}
    value = value.split('.')[0];
    var n = value.length % 3;
    if(n){
        return value.slice(0,n) + value.slice(n).replace(/(\d{3})/g,',$1')+'.00';
    }else{
        return value.replace(/(\d{3})/g,',$1').slice(1)+'.00';
    }
}
/**
 * 时间戳转换日期
 * @param <int> unixTime    待时间戳(秒)
 * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)
 * @param <int>  timeZone   时区
 */
const unixToDate = (unixTime, isFull, isSeconds, timeZone)=>{
    if (typeof (timeZone) == 'number')
    {
        unixTime = intval(unixTime) + intval(timeZone) * 60 * 60;
    }
    var time = new Date(unixTime * 1000);
    var ymdhis = "";
    ymdhis += time.getFullYear() + "-";
    ymdhis += appendZero( (time.getMonth()+1) ) + "-";
    ymdhis += appendZero( time.getDate() );
    if (isFull === true)
    {
        ymdhis += " " + time.getHours() + ":";
        ymdhis += appendZero(time.getMinutes());
        if (isSeconds === false){
            return ymdhis;
        }
        ymdhis += ":" + appendZero(time.getSeconds());

    }
    return ymdhis;
}
export { intval , blurPhone, formatPhone ,strReplace ,unixToDate ,appendZero ,zeroDot ,bankCard ,monenyStyle,dateType}
