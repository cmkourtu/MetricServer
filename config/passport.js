const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const { User } = require("../models");
const passportJwt = require("passport-jwt");
const {SECRET_KEY} = require("./constants");
const session = require('express-session');

module.exports = function (app) {
    passport.use(
        "jwt",
        new passportJwt.Strategy(
            {
                jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme("jwt"),
                secretOrKey: SECRET_KEY,
                session: false,
            },
            (payload, done) => done(null, payload)
        )
    );
    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: "api/auth/facebook/callback",
                scope: ["pages_show_list", "ads_management", "ads_read", "pages_read_engagement", "public_profile", "email"],
                profileFields: ['id', 'displayName', 'email'],
            },
            function (accessToken, refreshToken, profile, done) {
                console.log({accessToken, refreshToken, profile: profile._json});

                return done(null, {accessToken, refreshToken, profile: profile._json});
            }
        )
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findByPk(id).then(user => {
            done(null, user);
        });
    });
    app.use(session({
        secret: 'secret', // Секретний ключ для підпису куки сесії
        resave: false,
        saveUninitialized: true,
    }));
    app.use(passport.initialize());
};
// const passport = require("passport");
// const passportJwt = require("passport-jwt");
// const {SECRET_KEY} = require("./constants");
// const {User} = require("../models");
// const FacebookStrategy = require("passport-facebook").Strategy;
//
// module.exports = function (app) {
//     passport.use(
//         "jwt",
//         new passportJwt.Strategy(
//             {
//                 jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme("jwt"),
//                 secretOrKey: SECRET_KEY,
//                 session: false,
//             },
//             (payload, done) => done(null, payload)
//         )
//     );
//     passport.use(
//         new FacebookStrategy(
//             {
//                 clientID: process.env.FACEBOOK_APP_ID,
//                 clientSecret: process.env.FACEBOOK_APP_SECRET,
//                 callbackURL: "api/auth/facebook/callback",
//                 scope: ["pages_show_list", "ads_management", "ads_read", "pages_read_engagement"],
//             },
//             function (accessToken, refreshToken, profile, done) {
//                 return {accessToken, refreshToken, profile}
//             }
//         )
//     );
//     passport.serializeUser((user, done) => {
//         done(null, user.id);
//     });
//
//     passport.deserializeUser((id, done) => {
//         User.findByPk(id)
//             .then((user) => done(null, user))
//             .catch((err) => done(err));
//     });
//
//     app.use(passport.initialize());
// };
