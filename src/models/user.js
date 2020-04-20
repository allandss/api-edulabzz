const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/*module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
      password: DataTypes.STRING,
    });
  
    return User;
}*/

module.exports = (sequelize, Sequelize) => {
    const {INTEGER, STRING, FLOAT, BOOLEAN, DATE} = Sequelize;
    const salt = '1234';
    const User = sequelize.define('User', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: STRING, allowNull: false},
        email: {type: STRING, allowNull: false, validate: {
                isEmail:true
            },
            unique: {
                args: true,
                msg: 'Email já em uso!'
            }
        },
        password: {type: STRING, allowNull: false},
        ra: {type: STRING, allowNull: true,
            unique: {
                args: true,
                msg: 'Ra já em uso!'
            }
        },
        image: {type: STRING, allowNull: true, field: 'img_perfil'},
        fullName: {type: STRING, allowNull: true, field: 'nome_completo'},
        birthday: {type: DATE, allowNull: true, field: 'data_nascimento'},
        gender: {type: STRING, allowNull: false, field: 'genero'},
        description: {type: STRING, allowNull: true, field: 'descricao'},
        idSchool: {type: INTEGER, allowNull: false, field: 'escola_id',
            references: {        
                model: 'School',
                key: 'id'
            }
        },
        permission: {type: STRING, allowNull: true, field: 'permissao'},
        rememberToken: {type: STRING, allowNull: true, field: 'remember_token'},
        lastActivity: {type: DATE, allowNull: false, field: 'ultima_atividade'},
        dtCreated: {type: DATE, allowNull: false, field: 'created_at'},
        dtUpdated: {type: DATE, allowNull: false, field: 'updated_at'}
    }, {
        timestamps: false,
        tableName: 'users'
    });
    
    User.associate = function(models) {
        User.belongsTo(models.School, {foreignKey: 'idSchool', as: 'school'})
    };

    //aplicando o hash
    User.generatePassword = function(password) {
        //this.salt = crypto.randomBytes(16).toString('hex');
        this.password = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    };

    User.prototype.validatePassword = function(password) {
        /*const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
        return this.password === hash;*/
        return this.password === password;
    };

    User.prototype.generateJWT = function() {
        const today = new Date();
        today.setMinutes(today.getMinutes() + 30);
      
        return jwt.sign({
          email: this.email,
          id: this.id,
          profile: 'USER',
          exp: parseInt(today.getTime() / 1000, 10),
        }, process.env.SECRET);
    };
      
    User.prototype.toAuthJSON = function() {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            image: this.image,
            fullName: this.fullName,
            description: this.description,
            profile: 'USER',
          token: this.generateJWT(),
        };
    };
      

    // Class Method
    //Model.myCustomQuery = function (param, param2) {  };
    // Instance Method
    //Model.prototype.myCustomSetter = function (param, param2) {  }

    return User
}

//module.exports = UserModel