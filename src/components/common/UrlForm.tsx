import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Accordion } from "../base/Accordion";

type Props = {
  name: string;
};

export const UrlForm = ({ name }:Props) => {
  const { register } = useFormContext();
  console.log("name",name);
  const [isAccordionChecked, setIsAccordionChecked] = useState(false);

  return (
    <Accordion title="URL" id="url"
    setChecked={setIsAccordionChecked}
    checked={isAccordionChecked}>
      <div className="mb-4">
        <label htmlFor="post" className="block text-gray-700">
          Post先URL:
        </label>
        <input
          type="text"
          id="post"
          {...register(`${name}.urls.post`)}
          className="border border-gray-300 p-1 rounded mt-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="get" className="block text-gray-700">
          Get先URL:
        </label>
        <input
          type="text"
          id="get"
          {...register(`${name}.urls.get`)}
          className="border border-gray-300 p-1 rounded mt-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="put" className="block text-gray-700">
          Put先URL:
        </label>
        <input
          type="text"
          id="put"
          {...register(`${name}.urls.put`)}
          className="border border-gray-300 p-1 rounded mt-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="delete" className="block text-gray-700">
          Delete先URL:
        </label>
        <input
          type="text"
          id="delete"
          {...register(`${name}.urls.delete`)}
          className="border border-gray-300 p-1 rounded mt-1 w-full"
        />
      </div>
    </Accordion>
  );
};