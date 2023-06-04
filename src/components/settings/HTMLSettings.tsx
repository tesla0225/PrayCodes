import React, { useState, useCallback, useEffect, FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Accordion } from '../base/Accordion';
import { useVSCodeAPI } from '../../hooks/useVSCodeAPI';

interface FormData {
  key: string;
  settings: {
    html: {
      BEM: boolean;
      jQuery: boolean;
      otherLibrary: boolean;
      otherStyleLibraryName?: string;
      otherLibraryName?: string;
    };
  };
}

interface AdditionalProps {
  formData: Partial<FormData>;
}

const Additional: FC<AdditionalProps> = ({ formData }) => {
  if (!formData) {
    return <p>Loading...</p>;
  }

  return (
    <p>
      jQuery: {formData?.settings?.html?.jQuery ? '使用する' : '使用しない'}
      <br />
      BEM: {formData?.settings?.html?.BEM ? '使用する' : '使用しない'}
      <br />
      その他のライブラリ:{' '}
      {formData?.settings?.html?.otherLibrary
        ? formData?.settings?.html?.otherLibraryName || '未指定'
        : '使用しない'}
    </p>
  );
};

export const HTMLSettings: FC = () => {
  const methods = useForm<FormData>();
  const { register, watch, handleSubmit, setValue } = methods;
  const [notice, setNotice] = useState('保存');
  const [isAccordionChecked, setIsAccordionChecked] = useState(false);

  const apiInput = {
    loadCommand: 'loadFormData',
    saveCommand: 'saveFormData',
    key: 'htmlSettings',
  };

  const { data, saveData } = useVSCodeAPI(apiInput);
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

  const watchOtherLibrary = watch('settings.html.otherLibrary', false);

useEffect(() => {
  const allowedValues = [true, false];

  const bemValue = data?.settings.html?.BEM;
  if (allowedValues.includes(bemValue)) {
    setValue('settings.html.BEM', bemValue);
  }

  const jQueryValue = data?.settings.html?.jQuery;
  if (allowedValues.includes(jQueryValue)) {
    setValue('settings.html.jQuery', jQueryValue);
  }

  const otherLibraryValue = data?.settings.html?.otherLibrary;
  if (allowedValues.includes(otherLibraryValue)) {
    setValue('settings.html.otherLibrary', otherLibraryValue);
  }

  const otherLibraryNameValue = data?.settings.html?.otherLibraryName;
  if(otherLibraryNameValue !== undefined){
  setValue('settings.html.otherLibraryName', otherLibraryNameValue);
  }

  
}, [setValue, data]);

  return (
    <Accordion
      title="設定"
      id="html"
      additional={<Additional formData={watchedForm} />}
      checked={isAccordionChecked}
      setChecked={setIsAccordionChecked}
    >
      <FormProvider {...methods}>
        <form>
          <div className="flex flex-col">
            <div className="mb-2">
              <input
                id="BEM"
                type="checkbox"
                {...register('settings.html.BEM')}
                className="mr-2"
              />
              <label htmlFor="BEM">Use BEM</label>
            </div>

            <div className="mb-2">
              <input
                id="jQuery"
                type="checkbox"
                {...register('settings.html.jQuery')}
                className="mr-2"
              />
              <label htmlFor="jQuery">Use jQuery</label>
            </div>

            <div className="mb-2">
              <input
                id="otherLibrary"
                type="checkbox"
                {...register('settings.html.otherLibrary')}
                className="mr-2"
              />
              <label htmlFor="otherLibrary">Other Library</label>
            </div>

            {watchOtherLibrary && (
              <>
                <div className="mb-2">
                  <label htmlFor="otherLibraryName" className="font-bold mb-2">
                    Other Library Name
                  </label>
                  <input
                    id="otherLibraryName"
                    {...register('settings.html.otherLibraryName')}
                    className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border rounded-md"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="otherLibraryStyleName"
                    className="font-bold mb-2"
                  >
                    Other Style Library Name
                  </label>
                  <input
                    id="otherLibraryStyleName"
                    {...register('settings.html.otherStyleLibraryName')}
                    className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border rounded-md"
                  />
                </div>
              </>
            )}
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
