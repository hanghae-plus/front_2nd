import { OPTIONS } from "../constant";

export default function Selector({ selectedOptionId, setSelectedOptionId }) {
  const handleSelectChange = (e) => {
    setSelectedOptionId(e.target.value);
  };

  const Option = ({ option }) => {
    return (
      <option value={option.id} key={option.id} onChange={handleSelectChange}>
        {option.name} - {option.cost}원
      </option>
    );
  };

  return (
    <select
      id="product-select"
      className="border rounded p-2 mr-2"
      value={selectedOptionId}
      onChange={handleSelectChange}
    >
      {OPTIONS.map((option) => (
        <Option option={option} />
      ))}
    </select>
  );
}
