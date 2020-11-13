const { Model } = require("objection");
const Knex = require("knex");

const DBdefault = {
  client: "pg",
  connection: {
    host: "localhost",
    port: "5432",
    user: "test5",
    password: "test5",
    database: "test5",
  },
  log: {
    warn(message) {
      console.log(message);
    },
    error(message) {
      console.log(message);
    },
    deprecate(message) {
      console.log(message);
    },
    debug(message) {
      console.log(message);
    },
  },
};

const configDefault = {
  knex: DBdefault,
};

const konject = (config = configDefault) => {
  const knex = Knex(config.knex);

  Model.knex(knex);

  konjectModel = (tableName) => {
    class TheModel extends Model {
      static get tableName() {
        return tableName;
      }
    }

    model = {
      all: async () => {
        const all = await TheModel.query().select();
        return all;
      },
      one: async (id) => {
        const all = await TheModel.query().select().where({ id });
        return all;
      },
      create: async (newModel) => {
        const all = await TheModel.query().insert(newModel);
        return all;
      },
      update: async (id, update) => {
        const all = await TheModel.query().where({ id }).update(update);
        return all;
      },
      destroy: async (id) => {
        const all = await TheModel.query().where({ id }).del();
        return all;
      },
    };

    return [TheModel, model];
  };

  return [knex, Model, konjectModel];
};

module.exports = konject;
