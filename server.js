//引入express框架/swig模板/mongoose中间件/body-parser中间件/cookies
let express = require('express');
let swig = require('swig');
let mongoose = require('mongoose');
let Cookies = require('cookies');
//用来处理提交过来的post数据
let bodyParser = require('body-parser');

let User = require('./module/User');

//创建服务器server => nodeJS Http.createServer();
let server = express();

//设置静态文件托管
//当用户访问的url以/public开始，自动跳转‘__dirname + "/piblic"’返回对应的文件
server.use('/public',express.static(__dirname + '/public'))

//定义应用模板
//定义当前模板所使用的引擎
//第一个参数：模板引擎的名称同时也是模板文件的后缀名；第二个参数：用于解析处理模板内容的方法
server.engine('html',swig.renderFile);
//定义模板的存放目录，第一个是views(视图)；第二个参数：目录路径
server.set('views','./views');
//注册所使用的模板引擎，第一个参数是'view engine'；
//第二个参数：该参数和server.engine方法中定义模板引擎的名称是一致的；
server.set('view engine','html')

//开发过程中要设置缓存为不缓存，利于开发调试；
swig.setDefaults({cache:false});

//设置bodyParser
//调用这个方法会给server中require中添加一个body属性，其中存储这post的数据
server.use( bodyParser.urlencoded({extended: true}) );

//设置cookies
server.use( (req,res,next) => {

    req.cookies = new Cookies(req,res);
    req.userInfo = {};

    if(req.cookies.get('userInfo')) {

        try {

            req.userInfo = JSON.parse( req.cookies.get('userInfo') );
            User.findById(req.userInfo._id).then((uesrInfo) => {

                req.userInfo.isAdmin = uesrInfo.isAdmin;
                next();

            });

        }catch (e) {

            next();

        };

    }else {

        next();

    };

})

//根据不同路径连接不同模块
server.use('/admin',require('./routers/admin'));
server.use('/api',require('./routers/api'));
server.use('/',require('./routers/main'));


//连接数据库，当成功时开启服务器
mongoose.connect('mongodb://localhost:27018/blog',err => {

    if(err) {

        console.log('数据库连接失败');

    }else {

        console.log('数据库连接成功');
        server.listen(9999);

    }

});
