import React, { useState, useEffect } from 'react';
import Props from '../common/PropsForm';
import { FormProvider, useForm } from 'react-hook-form';
import { FrontendSettings } from '../settings/FrontendSettings';
import { DirectorySettings } from '../settings/DirectorySettings';
import { useVSCodeAPI } from '../../hooks/useVSCodeAPI';

type FrontendFormProps = {
  type: string;
};

export const FrontendForm = ({ type }: FrontendFormProps) => {
  const formMethods = useForm();
  const { register, handleSubmit } = formMethods;
  const apiInput = {
    loadCommand: 'loadFormData',
    saveCommand: 'saveFormData',
    key: 'frontend',
  };
  const { postData } = useVSCodeAPI(apiInput);

  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    postData(data);
  };

  useEffect(() => {
    function handleMessage(event) {
      if (event.data === 'postDataComplete') {
        setLoading(false);
      }
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

    // useEffect(() => {
    //   function handleMessage(event) {
    //     if (event.data === 'error') {
    //       setError("エラーが発生しました");
    //     }
    //   }

    //   window.addEventListener('message', handleMessage);

    //   return () => {
    //     window.removeEventListener('message', handleMessage);
    //   };
    // }, []);

  return (
    <>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" defaultValue={type} {...register('type')} />
          <FrontendSettings />

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
              コンポーネント名:
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              required
              className="border border-gray-300 p-1 rounded mt-1 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700">
              コンポーネントの概要:
            </label>
            <textarea
              id="description"
              {...register('frontend.description')}
              required
              className="border border-gray-300 p-1 rounded mt-1 w-full"
            ></textarea>
          </div>
          <Props name="frontend" />
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
              ライブラリ名:
            </label>
            <input
              type="text"
              id="name"
              {...register('frontend.library')}
              className="border border-gray-300 p-1 rounded mt-1 w-full"
            />
          </div>

          {/* <UrlForm name="frontend" /> */}
          <DirectorySettings />
          <input
            type="submit"
            value={loading ? '生成中です...' : '送信'}
            className="bg-green-500 text-white p-2 rounded cursor-pointer"
            disabled={loading}
          />
        </form>
      </FormProvider>
    </>
  );
};
