import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DirectorySettings } from '../settings/DirectorySettings';
import { useVSCodeAPI } from '../../hooks/useVSCodeAPI';

export const JSONForm = ({ type }) => {
  const formMethods = useForm();

  const { register, handleSubmit } = formMethods;
  const apiInput = {
    loadCommand: 'loadFormData',
    saveCommand: 'saveFormData',
    key: 'json',
  };
  const { postData } = useVSCodeAPI(apiInput);

  const onSubmit = (data) => {
    postData(data);
  };

  return (
    <>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            id="json" 
            {...register('json')}
            required
            className="border border-gray-300 p-1 rounded mt-1 w-full"
          ></textarea>
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
