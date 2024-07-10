import { OPTIONS } from "../constant";

export default function Selector({
  selectOptionIndex,
  setSelectedOptionIndex,
}) {
  const handleSelectChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    setSelectedOptionIndex(selectedIndex);
  };

  const Option = ({ option }) => {
    return (
      <option
        value={option.id}
        key={`option${option.id}`}
        onChange={handleSelectChange}
      >
        {option.name} - {option.cost}원
      </option>
    );
  };

  return (
    <select
      id="product-select"
      className="border rounded p-2 mr-2"
      value={OPTIONS[selectOptionIndex]}
      onChange={handleSelectChange}
    >
      {OPTIONS.map((option) => (
        <Option option={option} />
      ))}
    </select>
  );
}
