var axios = require ('axios');
var MockAdapter = require ('axios-mock-adapter');
var normalAxios = axios.create();
var mockAxios = axios.create();

var mock = new MockAdapter(mockAxios);
mock.onGet('/users').reply(200,{
    users : [
        {id:123, name:'wyang'}
    ]
})

//携带参数的get
mock.onGet ('/postUsers', {params :{serachUser : 'wy'}}).reply(200,{
    users: [
        { id: 1, name: 'wy text' }
    ]
})
//login
mock.onPost ('/login').reply(config => {
    let postData = JSON.parse(config.data);
    if(postData.userName === 'admin' && postData.password === '123456'){
        return [200, require('./mock/user') ];
    }else {
        return [500, {message: "Incorrect user or password"}]
    }
})
//activity
mock.onPost ('/activity').reply(config => {
    let postData = JSON.parse(config.data);
    if(postData.userName === 'admin' && postData.password === '123456'){
        return [200, require('./mock/user') ];
    }else {
        return [500, {message: "Incorrect user or password"}]
    }
})

//loginOut
mock .onGet ('/loginOut').reply(200,{})

//randomUser
mock.onGet('/randomuser').reply(config => {
    return new Promise((resolve,reject) =>{
        normalAxios.get('https://randomuser.me/api',{
            params :{
                results :10,
                ...config
            },
            responseType: 'json'
        }).then(res => {
            resolve([200,res.data])
        }).then(err => {
            reject([500,err])
        })
    })
})



export default mockAxios;