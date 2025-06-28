import React from 'react';

type Props = {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string) => void;
  max?: number;
};

const ToggleInput = ({ label, options, selected, onChange, max = 2 }: Props) => (
  <div>
    <h2 className="text-lg font-semibold mb-2">{label}</h2>
    <div className="grid grid-cols-1 gap-1">
      {options.map((option) => (
        <label key={option} className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={selected.includes(option)}
            onChange={() => {
              if (selected.includes(option)) {
                onChange(option);
              } else if (selected.length < max) {
                onChange(option);
              }
            }}
          />
          {option}
        </label>
      ))}
    </div>
  </div>
);

export default ToggleInput;