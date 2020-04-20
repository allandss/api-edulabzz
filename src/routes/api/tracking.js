const passport = require('passport');
const router = require('express').Router();

const auth = require('../auth');
const models = require('../../models');
const Tracking = models.Tracking;

//GET Get Tracking for current user (required, only authenticated users have access)
router.get('/tracking/:last?', auth.required, (req, res, next) => {
    
    const last = req.params.last;

    const { payload } = req;

    if(last) {
        return Tracking.findOne({ where: { idUser: payload.id },
            order: [ [ 'dtCreated', 'DESC' ]]}).then((tracking) => {
            
            if(!tracking) {
                return res.json({ tracking: null })
            }
            return res.json({ tracking: tracking.toAuthJSON() });
        }).catch(next);
    }
    else {
        return Tracking.findAll({ where: { idUser: payload.id },
            order: [ [ 'dtCreated', 'DESC' ]]}).then((trackings) => {
            
            console.log('trackings', trackings);

            if(!trackings) {
                return res.json({ trackings: null })
            }

            let ret = [];
            for(var i=0; i<trackings.length; i++) {
                ret.push(trackings[i].toAuthJSON());
            }

            return res.json({ trackings: ret });
        }).catch(next);
    }
});

//POST Save Tracking for current (required, only authenticated users have access)
router.post('/tracking', auth.required, (req, res, next) => {
    const { payload } = req;
    const { body: { tracking } } = req;

    if(!tracking || !tracking.track) {
        return res.status(422).json({
            errors: {
                msg: 'Campos Obrigatórios não informados',
        }});
    }

    tracking.profile = payload.profile;
    tracking.idUser = payload.id;
    tracking.dtCreated = new Date();

    Tracking.create({ name: tracking.name, track: tracking.track, profile: tracking.profile,
                      idUser: tracking.idUser, dtCreated: tracking.dtCreated})
        .then(function(track) {
            return res.json({ tracking: track.toAuthJSON() 
        });
    }).catch(next);
});


module.exports = router;