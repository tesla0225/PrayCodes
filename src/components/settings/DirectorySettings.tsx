import React, { useState, useCallback, useEffect, FC } from 'react';
import { Accordion } from '../base/Accordion';
import { FormProvider, useForm } from 'react-hook-form';
import { useVSCodeAPI } from '../../hooks/useVSCodeAPI';

interface FormData {
  key: string;
  settings: {
    directory: {
      path: string;
      name: string;
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
      保存先: {formData?.settings?.directory?.path || '未設定'}
      {/* <br/>
      保存ファイル名: {formData?.settings?.directory?.name || '未設定'} */}
    </p>
  );
};

export const DirectorySettings: FC = () => {
  const methods = useForm<FormData>();
  const { register, handleSubmit, setValue, watch } = methods;

  const apiInput = {
    loadCommand: 'loadFormData',
    saveCommand: 'saveFormData',
    key: 'directorySettings',
  };

  const { data, saveData } = useVSCodeAPI(apiInput);
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
    console.log("data: ", data);
    if (data) {
      setValue('settings.directory.path', data?.settings.directory?.path);
      setValue('settings.directory.name', data?.settings.directory?.name);
    }
  }, [setValue, data]);

  return (
    <Accordion
      title="保存設定"
      id="Directory"
      additional={<Additional formData={watchedForm} />}
      checked={isAccordionChecked}
      setChecked={setIsAccordionChecked}
    >
      <FormProvider {...methods}>
        <form>
          <div className="mb-4 flex flex-col">
            <label htmlFor="save" className="block text-gray-700">
              保存先ディレクトリ:
            </label>
            <input
              type="text"
              id="save"
              {...register('settings.directory.path')}
              required
              className="border border-gray-300 p-1 rounded mt-1 w-full"
            />
            {/* <label htmlFor="name" className="block text-gray-700">
              保存ファイル名:
            </label>
            <input
              type="text"
              id="name"
              {...register('settings.directory.name')}
              required
              className="border border-gray-300 p-1 rounded mt-1 w-full"
            /> */}
            
            <button
              type="button"
              className="bg-green-500 text-white p-2 rounded cursor-pointer"
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
