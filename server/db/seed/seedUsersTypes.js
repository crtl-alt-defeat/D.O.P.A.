import { createUserType } from "../queries/usersTypes.js";

export default async function seedUsersTypes(users, types) {
  const usersTypes = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    //add a random number of desired goal types to a user
    let numTypes = Math.ceil(Math.random() * types.length);
    for (let j = 0; j < numTypes; j++) {
      //only add new types to the user
      let foundUnique = false;
      do {
        //randomly pick a type
        const newType = types[Math.floor(Math.random() * types.length)];

        //check if user already has an entry for picked type
        const findPair = usersTypes.find(
          (userType) =>
            userType.user_id == user.id && userType.type_id == newType.id,
        );
        foundUnique = !findPair;

        //if user does not have an entry, add it to the table
        if (foundUnique) {
          const newUserType = {
            user_id: user.id,
            type_id: newType.id,
          };
          usersTypes.push(await createUserType(newUserType));
        }

        //if the type is not unique, search again
      } while (!foundUnique);
    }
  }

  return usersTypes;
}
