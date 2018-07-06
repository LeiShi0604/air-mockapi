var express = require('express');
//var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//ルート設定
var toolRouter = require('./routes/api/v1/tool/auth');
//未作成
//var arRouter = require('/routes/api/v1/ar');

var port = process.env.PORT || 3000; // port番号を指定

var app  = express();
//-------------------passportの初期化----------------------------
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
app.use(require('express-session')({
    secret: 'fjaiofjfiafkldsfkadjkafk', //セッションのハッシュ文字列。任意に変更すること。
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//認証ロジック（管理ツールの場合）
passport.use(
	new LocalStrategy(
		{	
			//各filedにjsonのキーを指定
			//passportの仕様上、usernameFieldにemailを入れる
			usernameField: 'email', 
			passwordField: 'password'
		},
		function(username, password, done) {
			//routerのpassport.authenticate()が呼ばれたらここの処理が走る。
			//実際にはDBを参照

			//サンプルユーザー
			if(username == 'testUser@mail' && password == 'password'){
				console.log("ログイン with email :"+username);
        		return done(null, username);
			}

			//ログイン失敗->401でレスポンスされる
			console.log('ログイン失敗'+username)
       		return done(null, false, {message:'ID or Passwordが間違っています。'});
		}
	)
);


//認証した際のオブジェクトをシリアライズしてセッションに保存する。
passport.serializeUser(function(username, done) {
	console.log('serializeUser');
	done(null, username);
});


//認証時にシリアライズしてセッションに保存したオブジェクトをデシリアライズする。
//デシリアライズしたオブジェクトは各routerの req.user で参照できる。
passport.deserializeUser(function(username, done) {
	console.log('deserializeUser');
	done(null, {name:username, msg:'my message'});
});

//---------ここまでpassport-----------

//body-parserの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/air/api/v1/tool/auth/', toolRouter);



//サーバ起動
app.listen(port);
console.log('listen on port ' + port);
