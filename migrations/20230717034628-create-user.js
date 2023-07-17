'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            nomor: {
                type: Sequelize.STRING,
            },
            nama: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            jabatan: {
                type: Sequelize.STRING,
            },
            nip: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deletedAt: {
                type: Sequelize.DATE,
            },
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('user')
    },
}
