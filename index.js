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
  ////////////////////
  // knex and Model
  ////////////////////
  const knex = Knex(config.knex);

  Model.knex(knex);

  ////////////////////
  // konjectModel
  ////////////////////

  konjectModel = (tableName, modelConfig = {}) => {
    const { relationships = null } = modelConfig;
    ////////////////////
    // TheModel
    ////////////////////
    class TheModel extends Model {
      static get tableName() {
        return tableName;
      }

      static get relationMappings() {
        if (relationships) {
          return relationships();
        } else {
          return {};
        }
      }
    }

    ////////////////////
    // model funcs
    ////////////////////

    TheModel.all = async () => {
      const all = await TheModel.query().select();
      return all;
    };

    TheModel.one = async (id) => {
      const all = await TheModel.query().select().where({ id });
      return all;
    };

    TheModel.create = async (newModel) => {
      const all = await TheModel.query().insert(newModel);
      return all;
    };

    TheModel.update = async (id, update) => {
      const all = await TheModel.query().where({ id }).update(update);
      return all;
    };

    TheModel.destroy = async (id) => {
      const all = await TheModel.query().where({ id }).del();
      return all;
    };

    TheModel.related = async (id, rel, query = {}) => {
      const result = await TheModel.relatedQuery(rel).for(id).where(query);
      return result;
    };

    TheModel.relate = async (source, target, rel) => {
      const result = await TheModel.relatedQuery(rel)
        .for(source)
        .relate(target);
    };

    return TheModel;
  };

  ////////////////////
  // MAKER
  ////////////////////

  const maker = {
    createTable: async (name, callback) => {
      await knex.schema.h;
      knex.schema.hasTable(name).then(function (exists) {
        if (!exists) {
          return knex.schema.createTable(name, callback);
        } else {
          console.log(`${name} table already exists`);
        }
      });
    },
    dropTable: async (name) => {
      await knex.schema.dropTable(name);
    },
    alterTable: async (name, callback) => {
      await knex.schema.alterTable(name, callback);
    },
  };

  return [knex, Model, konjectModel, maker];
};

module.exports = konject;
