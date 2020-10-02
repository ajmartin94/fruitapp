'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Teams",[
      {
        name: "Instinct"
      },
      {
        name: "Valor"
      },
      {
        name: "Mystic"
      },
    ], {} );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Teams',null,{});
  }
};
