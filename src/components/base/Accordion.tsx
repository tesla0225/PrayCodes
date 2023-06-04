import React, { useState } from 'react';

type Props = {
  id: string;
  title: string;
  children: React.ReactNode;
  additional?: React.ReactNode | string;
  checked?: boolean;
  setChecked: (checked: boolean) => void;
};

export const Accordion = ({
  id,
  title,
  children,
  additional,
  checked,
  setChecked,
}: Props) => {

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="accordion mb-4">
      <input
        type="checkbox"
        id={id}
        hidden
        checked={checked}
        onChange={handleCheckboxChange}
      />
      <label htmlFor={id} className="block text-gray-700 cursor-pointer">
        {additional && (checked ? title : additional)}
        {!additional && title}
      </label>
      <div className="accordion-content mt-2">{children}</div>
    </div>
  );
};

