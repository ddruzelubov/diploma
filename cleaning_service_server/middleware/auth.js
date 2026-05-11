const passport = require('passport');

const auth = (roles = []) => {
    return (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(401).json({ error: 'No token, authorization denied' });
            }

            req.user = user; 

            if (roles.length && !roles.includes(user.role)) {
                return res.status(403).json({ error: 'Access denied' });
            }

            next();
        })(req, res, next);
    };
};

module.exports = auth;