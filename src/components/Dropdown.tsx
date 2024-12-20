import { useState } from "react";

export default function Dropdown({ options, onSelect }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: any) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown">
      <img src="/old-furrchat/assets/markdown/T.png" onClick={toggleDropdown} className="markdown-item"/>
      {isOpen && (
        <div className="dropdown-menu" style={{ position: 'absolute' }}>
          <select
            onChange={(e) => handleOptionSelect({ value: e.target.value, label: e.target.value })}
            style={{ padding: '8px', boxShadow: '1px solid #ccc', borderRadius: '4px' }}
          >
            {options.map((option: any) => (
              <option key={option.value} value={option.value} style={{ padding: '4px' }}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}