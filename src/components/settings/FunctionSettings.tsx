import React, { useState, useCallback, useEffect, FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Accordion } from '../base/Accordion';
import { useVSCodeAPI } from '../../hooks/useVSCodeAPI';

const languages = [
  { name: 'JavaScript', label: 'JavaScript' },
  { name: 'TypeScript', label: 'TypeScript' },
  { name: 'Python', label: 'Python' },
  { name: 'Ruby', label: 'Ruby' },
  { name: 'PHP', label: 'PHP' },
  { name: 'Go', label: 'Go' },
];

interface FormData {
  key: string;
  settings: {
    function: {
      languages: string;
    };
  };
}

interface AdditionalProps {
  formData: Partial<FormData>;
}

const Additional: FC<AdditionalProps> = ({ formData }) => {
  console.log("formData: ", formData)
  if (!formData) {
    return <p>Loading...</p>;
  }
  return <p>言語: {formData?.settings?.function?.languages || '未設定'}</p>;
};

export const FunctionSettings: FC = () => {
  const apiInput = {
    loadCommand: 'loadFormData',
    saveCommand: 'saveFormData',
    key: 'functionSettings',
  };

  const { data, saveData } = useVSCodeAPI(apiInput);

  const methods = useForm<FormData>();
  const { register, handleSubmit, setValue, watch } = methods;
  const [notice, setNotice] = useState('保存');
  const [isAccordionChecked, setIsAccordionChecked] = useState(false);

  const watchedForm = watch();

  const onSubmit = useCallback(
    (formData: FormData) => {
      formData.key = apiInput.key;
      saveData(formData).then(() => {
        setIsAccordionChecked(false);
        setNotice((prevNotice) => {
          if (prevNotice === '保存') {
            const timeoutId = setTimeout(() => {
              setNotice('保存');
            }, 2000);
            return '保存しました';
          }
          return prevNotice;
        });
      });
    },
    [saveData]
  );

  useEffect(() => {
    if(data){
      const languagesSet = data?.settings.function?.languages
        if (languages.map(({ name }) => name).includes(languagesSet)) {
          setValue('settings.function.languages', languagesSet);
        }
    }

  }, [setValue, data]);

  return (
    <Accordion
      title="設定"
      id="function"
      additional={<Additional formData={watchedForm} />}
      checked={isAccordionChecked}
      setChecked={setIsAccordionChecked}
    >
      <FormProvider {...methods}>
        <form>
          <div className="flex flex-col">
            <label className="font-bold mb-2">Languages</label>
            {languages.map((language, index) => (
              <div key={index} className="mb-2">
                <input
                  id={language.name}
                  type="radio"
                  {...register('settings.function.languages')}
                  value={language.name}
                  className="mr-2"
                />
                <label htmlFor={language.name}>{language.label}</label>
              </div>
            ))}
            <button
              className="bg-green-500 text-white p-2 rounded cursor-pointer"
              type="button"
              onClick={handleSubmit(onSubmit)}
            >
              {notice}
            </button>
          </div>
        </form>
      </FormProvider>
    </Accordion>
  );
};
