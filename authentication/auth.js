const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/users');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
	new JWTstrategy(
		{
			secretOrKey: process.env.JWT_SECRET,
			jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('jwt'),
		},
		async (token, done) => {
			try {
				return done(null, token);
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.use(
	'signup',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			const { first_name, last_name } = req.body;
			try {
				const user = await UserModel.create({ email, password, first_name, last_name });
				return done(null, user, { message: 'Why' });
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.use(
	'login',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		async (email, password, done) => {
			try {
				const user = await UserModel.findOne({ email });

				if (!user) {
					return done(null, false, {
						message: 'User not found',
					});
				}
				const validate = user.isValidPassword(password);
				if (!validate) {
					return done(null, false, {
						message: 'Wrong password or username',
					});
				}
				return done(null, user, {
					message: 'Login successful',
				});
			} catch (error) {
				done(error);
			}
		}
	)
);
