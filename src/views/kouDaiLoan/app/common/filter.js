import Vue from 'vue'
Vue.filter('monenyStyle',function(value){
    if (!value) { return ''}
    value = value.split('.')[0];
    var n = value.length % 3; 
    if(n){ 
    return value.slice(0,n) + value.slice(n).replace(/(\d{3})/g,',$1')
    }else{ 
    return value.replace(/(\d{3})/g,',$1').slice(1) 
    } 
})