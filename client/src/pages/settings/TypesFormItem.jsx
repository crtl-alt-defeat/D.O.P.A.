import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";

export default function TypesFormItem({
  user,
  type,
  selectedTypes,
  syncSelectedTypes,
  refreshSettings,
}) {
  // ❌ REMOVE syncSelectedTypes() from top-level
  // It caused infinite API calls and browser meltdown.

  const { addSelectedType, removeSelectedType } = useAuth();
  const [isChecked, setIsChecked] = useState(null);
  const [error, setError] = useState(null);

  async function getIsChecked() {
    const findSelected = selectedTypes.find((selectedType) => {
      return selectedType.id == type.id;
    });

    const checked = findSelected != null;
    setIsChecked(checked);
  }

  async function handleUpdateType(formData) {
    setError(null);

    const selected = formData.get("selectType");

    try {
      if (selected) {
        await addSelectedType(type.id);
        setIsChecked(true);
      } else {
        await removeSelectedType(type.id);
        setIsChecked(false);
      }

      // Refresh local + parent state
      await syncSelectedTypes();
      refreshSettings();
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

/* import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";

export default function TypesFormItem({
  user,
  type,
  selectedTypes,
  syncSelectedTypes,
  refreshSettings,
}) {
  /*   if (selected) {
    addSelectedType(type.id);
    setIsChecked(true);
  } else {
    removeSelectedType(type.id);
    setIsChecked(false);
  } *

  syncSelectedTypes();

  const { addSelectedType, removeSelectedType } = useAuth();
  const [isChecked, setIsChecked] = useState(null);
  const [error, setError] = useState(null);

  async function getIsChecked() {
    const findSelected = selectedTypes.find((selectedType) => {
      return selectedType.id == type.id;
    });

    const checked = findSelected != null;
    await setIsChecked(checked);
  }

  async function handleUpdateType(formData) {
    setError(null);

    const selected = formData.get("selectType");

    try {
      if (selected) {
        await addSelectedType(type.id);
        setIsChecked(true);
      } else {
        await removeSelectedType(type.id);
        setIsChecked(false);
      }

      syncSelectedTypes();
      refreshSettings(); // <-- ADD THIS
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
} */
