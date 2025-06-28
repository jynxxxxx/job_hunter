import React from 'react';

type Props = {
  placeholder: string;
  value: string | null;
  onChange: (val: string) => void;
};

const FreeTextInput = ({ placeholder, value, onChange }: Props) => (
  <textarea
    rows={3}
    className="w-full p-2 border border-gray-300 rounded"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
  />
);

export default FreeTextInput;