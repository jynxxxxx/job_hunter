'use client'

import { useState } from "react";

export function useFormState<T>(defaultForm: T) {
  const [form, setForm] = useState<T>(defaultForm);

  const updateField = (field: keyof T, value: any) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const toggleCheckbox = (field: keyof T, value: string, max: number) => {
    const current = form[field] as unknown as string[];
    if (current.includes(value)) {
      setForm({ ...form, [field]: current.filter((v) => v !== value) });
    } else {
      if (current.length >= max) return;
      setForm({ ...form, [field]: [...current, value] });
    }
  };

  return { form, updateField, toggleCheckbox };
}