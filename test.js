const konject = require("./index")

const config = {
    knex: {
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
}
}

const [DB, Model, konModel] = konject(config)

const [DogModel, Dog] = konModel('dogs')

const stuff = async () => {

console.log(await Dog.all())

// console.log(await Dog.create({name: 'Snuffles', age: 8}))

// console.log(await Dog.update(4, {name: "Bozo"}))

// console.log(await Dog.one(4))

// console.log(await Dog.destroy(4))

}

stuff()