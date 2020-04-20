/*module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
      password: DataTypes.STRING,
    });
  
    return User;
  }*/

  module.exports = (sequelize, Sequelize) => {
    const {INTEGER, STRING, FLOAT, BOOLEAN, DATE} = Sequelize
    const School = sequelize.define('School', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: STRING, allowNull: false, field: 'nome'},
        email: {type: STRING, allowNull: true, validate: {
                isEmail:true
            },
            unique: {
                args: true,
                msg: 'Email já em uso!'
            }
        },
        tel: {type: STRING, allowNull: true, field: 'telefone'},
        others: {type: STRING, allowNull: true, field: 'outros'},
        cep: {type: STRING, allowNull: true},
        city: {type: STRING, allowNull: true, field: 'cidade'},
        state: {type: STRING, allowNull: true, field: 'estado'},
        dtCreated: {type: DATE, allowNull: false, field: 'created_at'},
        dtUpdated: {type: DATE, allowNull: false, field: 'updated_at'}
    }, {
        timestamps: false,
        tableName: 'escolas'
    });
    return School
}

//module.exports = SchoolModel