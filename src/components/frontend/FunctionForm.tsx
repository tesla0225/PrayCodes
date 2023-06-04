import React from 'react';
import Props from '../common/PropsForm';
import { FormProvider, useForm } from 'react-hook-form';
import { UrlForm } from '../common/UrlForm';
import { FunctionSettings } from '../settings/FunctionSettings';
import { DirectorySettings } from '../settings/DirectorySettings';
import { useVSCodeAPI } from '../../hooks/useVSCodeAPI';

export const FunctionForm = ({type}) => {
  const formMethods = useForm();

  const { register, handleSubmit } = formMethods;
  const apiInput = {
    loadCommand: 'loadFormData',
    saveCommand: 'saveFormData',
    key: 'function',
  };
  const { postData } = useVSCodeAPI(apiInput);

  const onSubmit = (data) => {
    postData(data);
  };

  return (
    <>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" defaultValue={type} {...register('type')} />
          <FunctionSettings />
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
              関数名:
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
              関数の概要:
            </label>
            <textarea
              id="description"
              {...register('backend.description')}
              required
              className="border border-gray-300 p-1 rounded mt-1 w-full"
            ></textarea>
          </div>
          <Props name="backend" />
          <UrlForm name="backend" />
          <DirectorySettings />
          <input
            type="submit"
            value="送信"
            className="bg-green-500 text-white p-2 rounded cursor-pointer"
          />
        </form>
      </FormProvider>
    </>
  );
};
