const router = require("express").Router();
const multer = require('multer');
const upload = multer();
const uniqid = require('uniqid');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync', {
    serialize: (data) => encrypt(JSON.stringify(data)),
    deserialize: (data) => JSON.parse(decrypt(data))
});

router.post("/register", upload.none(), function (request, response) {
    const db = low(new FileSync('db.json'));
    const {name, email, password} = request.body;
    const error = {};
    if (name === "") {
        error.name = ['Поле Имя обязательно для заполнения.'];
    }
    if (email === "") {
        error.email = ['Поле E-Mail адрес для заполнения.'];
    }
    if (password === "") {
        error.password = ['Поле Пароль обязательно для заполнения.'];
    }
    if (JSON.stringify(error) !== "{}") {
        response.json({success: false, error});
    }
    let user = db.get("users").find({email}).value();
    if (!user) {
        user = {name, email, password, id: uniqid(), isAuthorized: true};
        db.get("users").push(user).write();
        delete user.password;
        delete user.isAuthorized;
        response.json({success: true, user});
    } else {
        response.json({success: false, error: {email: `E-Mail адрес ${email} уже существует.`}});
    }
})

router.post("/login", upload.none(), function (request, response) {
    const db = low(new FileSync('db.json'));
    const {email, password} = request.body;
    let user = db.get("users").find({email, password});
    let foundedUser = user.value();
    if (!!foundedUser) {
        user.assign({isAuthorized: true}).write();
        delete foundedUser.password;
        delete foundedUser.isAuthorized;
        response.json({success: true, user: foundedUser});
    } else {
        response.json({success: false, error: `Пользователь c email ${email} и паролем ${password} не найден`})
    }
})

router.post("/logout", function (request, response) {
    const db = low(new FileSync('db.json'));
    db.get("users").find({isAuthorized: true}).assign({isAuthorized: false}).write();
    response.json({success: true});
})

router.get("/current", function (request, response) {
    const db = low(new FileSync('db.json'));
    let {id} = request.query;
    let user = db.get("users").find({id});
    let userValue = user.value();
    if (userValue && userValue.isAuthorized) {
        delete userValue.password;
        delete userValue.isAuthorized;
        response.json({success: true, user: userValue});
    } else {
        response.json({success: false, user: null, error: 'Необходимо передать id, name и email пользователя'});
    }
})


module.exports = router;
