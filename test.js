const konject = require("./index");

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
