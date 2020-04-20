module.exports = (sequelize, Sequelize) => {
    const {INTEGER, STRING, FLOAT, BOOLEAN, DATE} = Sequelize;
    const Tracking = sequelize.define('Tracking', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: INTEGER,
        },
        name: {
          allowNull: true,
          type: STRING,
          field: 'nome'
        },
        track: {
          allowNull: false,
          type: STRING,
          unique: true,
          field: 'passo'
        },
        profile: {
          allowNull: false,
          type: STRING,
        },
        idUser: {
            allowNull: false,
            type: INTEGER,
            field: 'id_user'
        },
        dtCreated: {
          allowNull: false,
          type: DATE,
          field: 'created_at'
        },
        dtUpdated: {
          allowNull: true,
          type: DATE,
          field: 'updated_at'
        },
      },
      {
        timestamps: false,
        tableName: 'trackings'
      });

      Tracking.prototype.toAuthJSON = function() {
        return {
            id: this.id,
            name: this.name,
            track: this.track,
            profile: this.profile
        };
      };

      return Tracking
}