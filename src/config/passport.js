const passport = require('passport');
const LocalStrategy = require('passport-local');

const models = require('../models');
const User = models.User;
const Student = models.Student;
const Mentor = models.Mentor;

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
}, async (email, password, done) => {

    let user;
    user = await User.findOne({ where: { email: email } });
    if(!user) {
        user = await Student.findOne({ where: { email: email } });
        if(!user) {
            user = await Mentor.findOne({ where: { email: email } });
        }
    }

    if(!user) {
        return done(null, false, { errors: { msg: 'Email não cadastrado!' } });
    }
    if(!user.validatePassword(password)) {
        return done(null, false, { errors: { msg: 'Email ou Senha inválida!' } });
    }        
    return done(null, user);


    /*User.findOne({ where: { email: email } }).then(user => {
        if(!user) {
            return done(null, false, { errors: { msg: 'Email não cadastrado!' } });
        }
        if(!user.validatePassword(password)) {
            return done(null, false, { errors: { msg: 'Email ou Senha inválida!' } });
        }        
        return done(null, user);
    
    }).catch(done);*/

}));