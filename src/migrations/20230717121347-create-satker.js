'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('satker', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            kode: {
                type: Sequelize.STRING,
            },
            nama: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            createdBy: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedBy: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            deletedAt: {
                type: Sequelize.DATE,
            },
            deletedBy: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('satker')
    },
}
