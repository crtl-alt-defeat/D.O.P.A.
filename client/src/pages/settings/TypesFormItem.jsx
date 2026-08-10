import { useState } from "react";

export default function TypesFormItem({
  type,
  selectedTypes,
  syncSelectedTypes,
}) {
  const [error, setError] = useState(null);

  const findSelected = selectedTypes.find((selectedType) => {
    return (selectedType.id = type.id);
  });
  const isSelected = findSelected != null;

  async function handleUpdateType(formData) {
    setError(null);
  }

  return (
    <form action={handleUpdateType}>
      <label>
        <input type="checkbox" name="selectType" defaultChecked={isSelected} />
        {type.name}
      </label>
    </form>
  );
}
