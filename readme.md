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

Takes a string that is the name of the table in your database and returns the model with the following starter functions, you can always add more. 

Item.all() => return all items

Item.one(id) => return one item based on ID

Item.create(newItem) => takes in an object and creates a new record

Item.update(id, updatedIem) => takes an ID and updates it based on the updatedItem

Item.destroy(id) => destroys the particular record

Item.related(id, relationship) => pull the data from a particular relationship

Item.relate(sourceID, targetID, relationship) => make an item from source model relate to target item in related model

In the below code we use the konModel function and add a special function for non-id based queries.

**relationships**

You can pass in a second object as an argument, keys in this object include.

relationships: function that returns object with relationship mapping


```js

const konject = require("konjection");

try {
  // CONFIG OBJECT WITH KNEX CONNECTION INFO
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
    },
  };

  //RUNNING konject
  const [DB, Model, konModel, maker] = konject(config);

  // Create Models, Pet model has a belongs to relationship with owner
  const Owner = konModel("owners");
  const Pet = konModel("pets", {
    relationships: () => {
      //in this part of the function require any models to avoid circular imports
      return {
        owner: {
          relation: Model.BelongsToOneRelation,
          modelClass: Owner,
          join: {
            from: "owners.id",
            to: "pets.owner_id",
          },
        },
      };
    },
  });

  //Executing database commands in async function
  const stuff = async () => {
    //Create Owners Table
    await maker.createTable("owners", function (t) {
      t.increments("id");
      t.string("name");
      t.integer("age");
      t.integer("pet_id").references("pets.id");
    });

    //Create Pets table
    await maker.createTable("pets", function (t) {
      t.increments("id");
      t.string("name");
      t.integer("age");
      t.integer("owner_id").references("owners.id");
    });

    //Create Some Owners and Pets
    await Owner.create({ name: "Bob", age: 55 });
    await Owner.create({ name: "Steve", age: 55 });
    await Owner.create({ name: "Josie", age: 55 });

    await Pet.create({ name: "Spot", age: 5 });
    await Pet.create({ name: "Mittens", age: 5 });
    await Pet.create({ name: "Butch", age: 5 });

    //Grab pet with id one and log it
    const pet = await Pet.one(1);
    console.log(pet);

    //Relate pet with id 1 with owner with id 1
    await Pet.relate(1, 1, "owner");
    //Log the owner related to pet 1
    console.log(await Pet.related(1, "owner"));
    //log all pets
    console.log(await Pet.all());
    //log all pets, populate owner data
    console.log(await Pet.query().withGraphFetched("owner"));
  };

  stuff();
} catch (error) {
  console.log(error);
}


```