var express = require('express');
var router = express.Router();
var passport = require('passport');

//test
router.get('/', function(req, res){
    res.json({"message":"Azure test!!"})
})

//ログイン認証
router.post(
    '/login',
    passport.authenticate('local'),
    //認証成功
    function(req, res, next){
        res.json({
            "status":200,
            "message":"ログイン成功",
            "userName":"テストユーザー"
        });
        //res.sendStatus(200);
    }
)

router.get(
    '/logout', 
    function(req, res, next){
        //ログインしてる場合
        if(req.user){
            //session破棄
            req.logout();
            res.json({
                "status":200,
                "message":"ログアウト",
                "userName":"テストユーザー"
            });
        }else{
            res.json({
                "status":401,
                "message":"セッションエラー",
                "userName":""
            });
        }
})

router.get(
    '/session',
    function(req, res, next){
        if(req.user){
            res.json({
                "status":200,
                "message":"ログイン済み",
                "userName":"テストユーザー"
            });
        }else{
            res.json({
                "status":401,
                "message":"セッションエラー",
                "userName":""
            });
        }
    }
)

module.exports = router;