'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Admin.init(
        {
            nomor: DataTypes.STRING,
            nama: DataTypes.STRING,
            email: DataTypes.STRING,
            jabatan: DataTypes.STRING,
            nip: DataTypes.STRING,
            password: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Admin',
            tableName: 'admin',
            paranoid: true,
        }
    )
    return Admin
}
