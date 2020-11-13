# Konjection
#### by Alex Merced

Konjection is an abstraction and helper library for working Knex Query Build and the Objection ORM.

## Konject

If all starts with the Konjection function. It takes a config object and in that config object there is a property called 'knex' which should have the configurations for your database connection to pass to Knex. It will return the Db object (Knex Object), Model object (Objection Model Object with the Knex Object in it), and konModel function (Function for creating model with crud functions for a table). Make sure the appropriate database drivers are installed for you project.

```js
const konject = require('konjection')

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


```

## konModel function

Takes a string that is the name of the table in your database and returns an Objection model class and an object filled with the following crud methods.

Item.all() => return all items

Item.one(id) => return one item based on ID

Item.create(newItem) => takes in an object and creates a new record

Item.update(id, updatedIem) => takes an ID and updates it based on the updatedItem

Item.destroy(id) => destroys the particular record

In the below code we use the konModel function and add a special function for non-id based queries.

```js

const [ItemModel, Item] = konModel('items')

//The Item object already has the main crud functions
Item.where = async (query) => {
    return await ItemModel.query().select().where(query)
}

module.exports = Item


```