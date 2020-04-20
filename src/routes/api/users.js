const passport = require('passport');
const router = require('express').Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const config = require('../../config/email');
const auth = require('../auth');
const models = require('../../models');
const User = models.User;
const Student = models.Student;
const Mentor = models.Mentor;

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    if(!user) {
        return res.status(422).json({
            errors: {
                msg: 'O Corpo da requisição é obrigatória',
        }});
    }

    if(!user.email) {
        return res.status(422).json({
            errors: {
                msg: 'O Email é obrigatório',
        }});
    }

    if(!user.password) {
        return res.status(422).json({
            errors: {
                msg: 'A Senha é obrigatória',
            }});
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        
        if(info) {
            return res.status(401).json(info);
        }

        if(passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();
            return res.json({ user: user.toAuthJSON() });
        }

        return res.status(401).json({
            errors: {
                msg: 'Acesso não permitido!',
            }});

    })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
    
    const { payload } = req;
    
    let user = getUserById(payload.id, payload.profile);
    
    if(!user) {
        return res.status(411).json({
            errors: {
                msg: 'Usuário não encontrado!',
            }});
    }

    user.then((userObj) => {
        if(!userObj) {
            return res.status(411).json({
                errors: {
                    msg: 'Usuário não encontrado!',
                }});
        }
        return res.json({ user: userObj.toAuthJSON() });
    }).catch(next);

    /*return User.findByPk(id).then((user) => {
        if(!user) {
            return res.status(411).json({
                errors: {
                    msg: 'Usuário não encontrado!',
                }});
        }
        return res.json({ user: user.toAuthJSON() });
    }).catch(next);*/
});

//PUT Update Password
router.put('/password', auth.optional, (req, res, next) => {
    
    const { body: { user } } = req;
    
    if(!user || !user.email || !user.password || !user.confirmPassword || !user.newPassword) {
        return res.status(422).json({
            errors: {
                msg: 'Campos obrigatórios não informados!',
        }});
    }

    if(user.password != user.confirmPassword) {
        return res.status(422).json({
            errors: {
                msg: 'A senha e sua confirmação diferem!',
        }});
    }

    //const userBd = User.findOne({ where: { email: user.email } });
    const userBd = getUserByEmail(user.email);

    if(!userBd) {
        return res.status(411).json({
            errors: {
                msg: 'Email não cadastrado!',
        }});
    }

    userBd.then((userObj) => {
        if(!userObj) {
            return res.status(411).json({
                errors: {
                    msg: 'Email não cadastrado!',
                }});
        }
        
        if(!userObj.validatePassword(user.password)) {
            return res.status(411).json({
                errors: {
                    msg: 'Email ou Senha inválida!',
            }});
        }
        
        userObj.update({password: user.newPassword}, {where: { id: userObj.id }})
            .then(function(rowsUpdated) {
                return res.json({ user: userObj.toAuthJSON() });
            })
        .catch(next);

    }).catch(next);

});

//PUT - Forget password 
router.put('/forget', auth.optional, (req, res, next) => {
    
    const { body: { user } } = req;

    if(!user || !user.email) {
        return res.status(422).json({
            errors: {
                msg: 'Campos obrigatórios não informados!',
        }});
    }

    //const userBd = User.findOne({ where: { email: user.email } });
    const userBd = getUserByEmail(user.email);

    if(!userBd) {
        return res.status(411).json({
            errors: {
                msg: 'Email não cadastrado!',
        }});
    }

    userBd.then((userObj) => {

        if(!userObj) {
            return res.status(411).json({
                errors: {
                    msg: 'Email não cadastrado!',
            }});
        }
        
        let passw = crypto.randomBytes(20).toString('hex').substring(0, 8);

        userObj.update({password: passw}, {where: { id: userObj.id }})
            .then(function(rowsUpdated) {
                
                const transport = nodemailer.createTransport(config);
                
                //criando a mensagem a ser enviada. TODO: Parametrizar e criar mensagem Html
                const message = {
                    from: process.env.EMAIL_EMIT, //endereço do emissor
                    to: userObj.email, //quem vai receber
                    subject:'Alteração de Senha', // Assunto
                    text:'Sua Senha agora é: '+passw, // Mensagem
                };

                //Realizando o envio
                transport.sendMail(message, (err, info)=>{
                    
                    if(err){
                        
                        console.log('err', err);

                        return res.status(411).json({
                            errors: {
                                msg: 'Erro ao enviar o email de Alteração de Senha!',
                            }});
                    
                        } else {
                        
                        console.log(info);
                        return res.json({ user: userObj.toAuthJSON() });
                    }
                });
            })
        .catch(next);

    }).catch(next);

});

async function getUserByEmail(email) {
    let user;
    user = await User.findOne({ where: { email: email } });
    if(!user) {
        user = await Student.findOne({ where: { email: email } });
        if(!user) {
            user = await Mentor.findOne({ where: { email: email } });
        }
    }
    return user;
}

async function getUserById(id, profile) {
    let user;

    if(profile) {
        if(profile === 'USER') {
            user = await User.findByPk(id);
        }
        else if(profile === 'STUDENT') {
            user = await Student.findByPk(id);
        }
        else if(profile === 'MENTOR') {
            user = await Mentor.findByPk(id);
        }
        return user;
    }

    user = await User.findByPk(id);
    if(!user) {
        user = await Student.findByPk(id);
        if(!user) {
            user = await Mentor.findByPk(id);
        }
    }
    return user;
}


module.exports = router;