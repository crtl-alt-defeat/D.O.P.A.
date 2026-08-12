import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";

export default function TypesFormItem({
  user,
  type,
  selectedTypes,
  syncSelectedTypes,
}) {
  const { addSelectedType, removeSelectedType } = useAuth();
  const [isChecked, setIsChecked] = useState(null);
  const [error, setError] = useState(null);

  async function getIsChecked() {
    const findSelected = selectedTypes.find((selectedType) => {
      return (selectedType.id = type.id);
    });

    const checked = findSelected != null;
    await setIsChecked(checked);
  }

  async function handleUpdateType(formData) {
    setError(null);

    const selected = formData.get("selectType");

    try {
      if (selected) {
        //add type to users_types
        addSelectedType(type.id);
        setIsChecked(true);
      } else {
        //remove type from users_types
        removeSelectedType(type.id);
        setIsChecked(false);
      }

      syncSelectedTypes();
    } catch (e) {
      console.error(e.message);
      setError(e.message);
    }
  }

  useEffect(() => {
    getIsChecked();
  }, []);

  return isChecked != null ? (
    <form action={handleUpdateType}>
      <label>
        <input
          type="checkbox"
          name="selectType"
          onChange={(event) => {
            //event.preventDefault();
            event.target.form.requestSubmit();
          }}
          defaultChecked={isChecked}
        />
        {type.name}
        {error && <p role="alert">{error}</p>}
      </label>
    </form>
  ) : (
    <p>loading...</p>
  );
}
