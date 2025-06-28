import React from 'react';

type Props = {
  label: string;
  options: string[];
  selected: string | null;
  onChange: (val: string) => void;
};

const RadioInput = ({ label, options, selected, onChange }: Props) => (
  <div>
    <h2 className="text-lg font-semibold mb-2">{label}</h2>
    <div className="grid grid-cols-1 gap-1">
      {options.map((option) => (
        <label key={option} className="flex items-center">
          <input
            type="radio"
            name={label}
            className="mr-2"
            value={option}
            checked={selected === option}
            onChange={() => onChange(option)}
          />
          {option}
        </label>
      ))}
    </div>
  </div>
);

export default RadioInput;