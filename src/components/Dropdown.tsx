import { memo, useState } from 'react';

function Dropdown({ options, onSelect }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [, setSelectedOption] = useState(options[0]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option:any) => {
    onSelect(option);
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown">
    <img src="/furrchat/assets/markdown/Heading.png" alt="heading" height="48" title="Heading" onClick={toggleDropdown}/>
    {isOpen && (
  <div className="dropdown-menu">
    {options.map((option:any) => (
      <button
        key={option.value}
        onClick={() => handleOptionSelect(option)}
      >
        {option.label}
      </button>
    ))}
  </div>
)}


    </div>
  );
}

export default memo(Dropdown);
