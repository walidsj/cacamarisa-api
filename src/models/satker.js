'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Satker extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Satker.init(
        {
            kode: DataTypes.STRING,
            nama: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Satker',
            tableName: 'satker',
            paranoid: true,
            hooks: {
                beforeCreate: (model, options) => {
                    model.createdBy = options.user.id
                    model.updatedBy = options.user.id
                },
                beforeUpdate: (model, options) => {
                    model.updatedBy = options.user.id
                },
                beforeDestroy: (model, options) => {
                    model.deletedBy = options.user.id
                },
            },
        }
    )
    return Satker
}
