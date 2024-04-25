const express = require("express");
const passport = require("passport");
const passportJwt = require("passport-jwt");
const {SECRET_KEY} = require("./constants");
const {User} = require("../models");
const session = require("express-session");
const FacebookStrategy = require("passport-facebook").Strategy;

module.exports = function (app) {
    // Middleware для обробки токена з заголовку авторизації
    function extractJwtToken(req, res, next) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(11); // Вирізати "Bearer " з початку рядка
            req.token = token;
        }
        if (authHeader && authHeader.startsWith("JWT ")) {
            const token = authHeader.substring(4); // Вирізати "Bearer " з початку рядка
            req.token = token;
        }
        next();
    }

    // Додати проміжний обробник в express
    app.use(extractJwtToken);

    // Після вирізання "Bearer " з токена, використовуємо його для автентифікації за допомогою passport-jwt
    passport.use(
        "jwt",
        new passportJwt.Strategy(
            {
                jwtFromRequest: passportJwt.ExtractJwt.fromExtractors([
                    req => req.token, // Використовуємо токен, який ми витягнули з проміжного обробника
                ]),
                secretOrKey: SECRET_KEY,
                session: false,
            },
            (payload, done) => done(null, payload)
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findByPk(id)
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: process.env.FRONT_APP_URL + "/callback/facebook-callback",
                scope: [
                    "pages_show_list",
                    "ads_management",
                    "ads_read",
                    "pages_read_engagement",
                    "public_profile",
                    "email",
                ],
                profileFields: ["id", "displayName", "email"],
            },
            function (accessToken, refreshToken, profile, done) {
                console.log({accessToken, refreshToken, profile: profile._json});

                return done(null, {accessToken, refreshToken, profile: profile._json});
            }
        )
    );
    app.use(
        session({
            secret: "your_secret_key",
            resave: false,
            saveUninitialized: false,
        })
    );

    app.use(passport.initialize());
    app.use(passport.session()); // Use session support for passport
};
