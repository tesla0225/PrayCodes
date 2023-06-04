import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Accordion } from '../base/Accordion';

type Props = {
  name: string;
};

interface AdditionalProps {
  fields: any[];
}

const Props = ({ name }: Props) => {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}.props`,
  });


const Additional: React.FC<AdditionalProps> = ({ fields }) => {
  if (fields.length === 0) return <p>Props</p>;
  return (
    <div className="flex flex-wrap justify-between">
      {fields.map((field, index) => (
        <div key={index} className="w-1/2 p-2">
          <p>
            name: {field.prop_name || '未設定'}
            <br />
            type: {field.prop_type || '未設定'}
            <br />
            description: {field.prop_description || '未設定'}
            <br />
            required: {field.prop_required ? 'はい' : 'いいえ'}
            <br />
          </p>
        </div>
      ))}
    </div>
  );
};
  const [isAccordionChecked, setIsAccordionChecked] = React.useState(false);

  return (
    <Accordion
      title="Props"
      id="Props"
      checked={isAccordionChecked}
      setChecked={setIsAccordionChecked}
      additional={<Additional fields={fields} />}
    >
      <div className="mb-4">
        <div id="props" className="mt-2 flex flex-col">
          {fields.map((field, index) => (
            <div
              className="prop flex flex-col items-start mt-4 space-y-4"
              key={field.id}
            >
              <div className="flex justify-between items-center w-full">
                <label
                  htmlFor={`${name}.props[${index}].prop_name`}
                  className="text-gray-700"
                >
                  Props名:
                </label>
                <button
                  type="button"
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={() => remove(index)}
                >
                  削除
                </button>
              </div>
              <input
                type="text"
                {...register(`${name}.props[${index}].prop_name`)}
                className="border border-gray-300 p-1 rounded w-full"
              />
              <label
                htmlFor={`${name}.props[${index}].prop_type`}
                className="text-gray-700"
              >
                Propsのtypescriptでの型:
              </label>
              <input
                type="text"
                {...register(`${name}.props[${index}].prop_type`)}
                className="border border-gray-300 p-1 rounded w-full"
              />
              <label
                htmlFor={`${name}.props[${index}].prop_description`}
                className="text-gray-700"
              >
                概要:
              </label>
              <input
                type="text"
                {...register(`${name}.props[${index}].prop_description`)}
                className="border border-gray-300 p-1 rounded w-full"
              />
              <label
                htmlFor={`${name}.props[${index}].prop_required`}
                className="text-gray-700"
              >
                必須かどうか:
                <input
                  {...register(`${name}.props[${index}].prop_required`)}
                  type="checkbox"
                  className="ml-2"
                />
              </label>
            </div>
          ))}
          <button
            onClick={() =>
              append({
                prop_name: '',
                prop_type: '',
                prop_description: '',
                prop_required: false,
              })
            }
            type="button"
            id="add_props"
            className="bg-blue-500 text-white p-2 rounded mb-4"
          >
            Propsを追加
          </button>
        </div>
      </div>
    </Accordion>
  );
};

export default Props;
