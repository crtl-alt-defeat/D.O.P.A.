import { getTypeByName } from "../../queries/types.js";
import { createUserType } from "../../queries/usersTypes.js";

export default async function seedUsersTypes(users, types) {
  const customType = await getTypeByName("custom");
  const validTypes = types.filter((type) => type.id != customType.id);

  const usersTypes = [];
  for (const user of users) {
    //add a random number of desired goal types to a user
    let numTypes = Math.ceil(Math.random() * validTypes.length);
    for (let j = 0; j < numTypes; j++) {
      //only add new types to the user
      let foundUnique = false;
      do {
        //randomly pick a type
        const newType = getRandomType(validTypes);

        //check if user already has an entry for picked type
        foundUnique = isUnique(usersTypes, user, newType);

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

function getRandomType(typesArr) {
  return typesArr[Math.floor(Math.random() * typesArr.length)];
}

function isUnique(usersTypes, user, type) {
  const findPair = usersTypes.find(
    (userType) => userType.user_id == user.id && userType.type_id == type.id,
  );

  return !findPair;
}
