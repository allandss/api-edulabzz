module.exports = {
    up: (queryInterface, DataTypes) => {
      return queryInterface.createTable('trackings', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        name: {
          allowNull: true,
          type: DataTypes.STRING,
          field: 'nome'
        },
        track: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: true,
          field: 'passo'
        },
        profile: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        idUser: {
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_user'
        },
        dtCreated: {
          allowNull: false,
          type: DataTypes.DATE,
          field: 'created_at'
        },
        dtUpdated: {
          allowNull: false,
          type: DataTypes.DATE,
          field: 'updated_at'
        },
      });
    },
  
    down: (queryInterface) => {
      return queryInterface.dropTable('trackings');
    }
  };