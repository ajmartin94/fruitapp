'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Seasons',[
      {
        name: 'Summer'
      },
      {
        name: 'Spring'
      },
      {
        name: 'Fall'
      },
      {
        name: 'Winter'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Seasons',null,{});
  }
};
