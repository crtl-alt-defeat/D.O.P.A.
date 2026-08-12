import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getTypes } from "../../api/types";

//components
import TypesFormItem from "./TypesFormItem";

export default function TypesForm({ user }) {
  const { getSelectedTypes } = useAuth();
  const [types, setTypes] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState(null);

  useEffect(() => {
    syncTypes();
  }, []);

  useEffect(() => {
    syncSelectedTypes();
  }, []);

  async function syncTypes() {
    const data = await getTypes();
    setTypes(data);
  }

  async function syncSelectedTypes() {
    const data = await getSelectedTypes();
    setSelectedTypes(data);
  }

  return selectedTypes ? (
    <section>
      <h3>Update Your Types</h3>
      <ul>
        {types.map((type) => {
          return (
            <TypesFormItem
              key={type.id}
              user={user}
              type={type}
              selectedTypes={selectedTypes}
              syncSelectedTypes={syncSelectedTypes}
            />
          );
        })}
      </ul>
    </section>
  ) : (
    <section>
      <h3></h3>
      <p>loading types...</p>
    </section>
  );
}
