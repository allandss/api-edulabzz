const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, Sequelize) => {
    const {INTEGER, STRING, FLOAT, BOOLEAN, DATE} = Sequelize;
    const salt = '1234';
    const Mentor = sequelize.define('Mentor', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: STRING, allowNull: false, field: 'nome'},
        email: {type: STRING, allowNull: false, validate: {
                isEmail:true
            },
            unique: {
                args: true,
                msg: 'Email já em uso!'
            }
        },
        password: {type: STRING, allowNull: false},
        image: {type: STRING, allowNull: true, field: 'img_perfil'},
        birthday: {type: DATE, allowNull: true, field: 'data_nasc'},
        tel: {type: STRING, allowNull: true, field: 'telefone'},
        rg: {type: STRING, allowNull: true, field: 'rg'},
        cpf: {type: STRING, allowNull: true, field: 'cpf'},
        city: {type: STRING, allowNull: true, field: 'cidade'},
        state: {type: STRING, allowNull: true, field: 'estado'},
        idGroup: {type: INTEGER, allowNull: true, field: 'grupo_id',
            references: {        
                model: 'Group',
                key: 'id'
            }
        },
        idSchool: {type: INTEGER, allowNull: true, field: 'escola_id',
            references: {        
                model: 'School',
                key: 'id'
            }
        },
        lastActivity: {type: DATE, allowNull: false, field: 'ultima_atividade'},
        dtCreated: {type: DATE, allowNull: false, field: 'created_at'},
        dtUpdated: {type: DATE, allowNull: false, field: 'updated_at'}
    }, {
        timestamps: false,
        tableName: 'mentors'
    });
    
    Mentor.associate = function(models) {
        Mentor.belongsTo(models.School, {foreignKey: 'idSchool', as: 'school'})
    };

    //aplicando o hash
    Mentor.generatePassword = function(password) {
        //this.salt = crypto.randomBytes(16).toString('hex');
        this.password = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    };

    Mentor.prototype.validatePassword = function(password) {
        /*const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
        return this.password === hash;*/
        return this.password === password;
    };

    Mentor.prototype.generateJWT = function() {
        const today = new Date();
        today.setMinutes(today.getMinutes() + 30);
      
        return jwt.sign({
          email: this.email,
          id: this.id,
          profile: 'MENTOR',
          exp: parseInt(today.getTime() / 1000, 10),
        }, process.env.SECRET);
    };
      
    Mentor.prototype.toAuthJSON = function() {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            image: this.image,
            description: this.description,
            profile: 'MENTOR',
          token: this.generateJWT(),
        };
    };
      

    // Class Method
    //Model.myCustomQuery = function (param, param2) {  };
    // Instance Method
    //Model.prototype.myCustomSetter = function (param, param2) {  }

    return Mentor
}

//module.exports = UserModel