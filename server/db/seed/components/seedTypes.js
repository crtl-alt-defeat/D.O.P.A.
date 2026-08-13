import { createType } from "../../queries/types.js";

export default async function seedTypes() {
  const types = [];
  types.push(await createType("custom"));
  types.push(await createType("self care"));
  types.push(await createType("household"));
  types.push(await createType("work/school"));
  types.push(await createType("relationship"));
  return types;
}
