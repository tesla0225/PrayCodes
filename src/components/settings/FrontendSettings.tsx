import React, { useState, useEffect, useCallback, FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Accordion } from '../base/Accordion';
import { useVSCodeAPI } from '../../hooks/useVSCodeAPI';

type FrontendFrameworks = 'React' | 'Vue';

interface APIInput {
  loadCommand: string;
  saveCommand: string;
  key: string;
}

interface Framework {
  name: string;
  label: string;
}

interface FormData {
  key: string;
  settings: {
    frontend: {
      frameworks: 'React' | 'Vue';
      cssFrameworks: {
        React: string;
        Vue: string;
      };
      cssFrameworksOther?: {
        React: string;
        Vue: string;
      };
      languages: string;
    };
  };
}

interface AdditionalProps {
  formData: Partial<FormData>;
}

interface FormItemProps {
  item: Framework;
  register: (...args: any[]) => any;
  settingsKey: string;
}

const API_INPUT: APIInput = {
  loadCommand: 'loadFormData',
  saveCommand: 'saveFormData',
  key: 'frontendSettings',
};

const SETTINGS_KEY = 'settings.frontend';

const FRAMEWORKS: Framework[] = [
  { name: 'React', label: 'React' },
  { name: 'Vue', label: 'Vue' },
];

const FRAMEWORK_CSS_MAPPING: Record<string, Framework[]> = {
  React: [
    { name: 'CSS Modules', label: 'CSS Modules' },
    { name: 'Styled Components', label: 'Styled Components' },
    { name: 'Tailwind CSS', label: 'Tailwind CSS' },
    { name: 'Other', label: 'Other' },
  ],
  Vue: [
    { name: 'Tailwind CSS', label: 'Tailwind CSS' },
    { name: 'Bulma', label: 'Bulma' },
    { name: 'Vuetify', label: 'Vuetify' },
    { name: 'Other', label: 'Other' },
  ],
};

const LANGUAGES: Framework[] = [
  { name: 'TypeScript', label: 'TypeScript' },
  { name: 'JavaScript', label: 'JavaScript' },
];

const FormItem: FC<FormItemProps> = ({ item, register, settingsKey }) => (
  <div className="mb-2">
    <input
      id={item.name}
      type="radio"
      {...register(`${SETTINGS_KEY}.${settingsKey}`)}
      value={item.name}
      className="mr-2"
    />
    <label htmlFor={item.name}>{item.label}</label>
  </div>
);

const Additional: FC<AdditionalProps> = ({ formData }) => {

  const currentFramework = formData?.settings?.frontend.frameworks;
  return (
    <p>
      Frontend: {currentFramework || '未設定'}
      <br />
      Language: {formData?.settings?.frontend?.languages || '未設定'}
      <br />
      CSS Framework:{' '}
      {formData?.settings?.frontend?.cssFrameworks[currentFramework] ||
        '未設定'}
      <br />
      {formData?.settings?.frontend?.cssFrameworks[currentFramework] === 'Other'
        ? 'その他のCSS Framework:' +
          formData?.settings?.frontend?.cssFrameworksOther[currentFramework]
        : ''}
      <br />
    </p>
  );
};

export const FrontendSettings: FC = () => {
  const { data, saveData } = useVSCodeAPI(API_INPUT);

  const methods = useForm<FormData>();
  const { register, handleSubmit, setValue, watch ,getValues} = methods;

  const [isAccordionChecked, setIsAccordionChecked] = useState(false);
  const [dynamicCssFrameworks, setDynamicCssFrameworks] = useState(
    FRAMEWORK_CSS_MAPPING[data?.settings?.frontend?.frameworks || 'React']
  );

  const watchedForm = watch();

  const onSubmit = useCallback(
    (formData: FormData) => {
      formData.key = API_INPUT.key;
      saveData(formData).then(() => {
        setIsAccordionChecked(false);
      });
    },
    [saveData]
  );

  const watchFrontendFramework = watch(`${SETTINGS_KEY}.frameworks`);
  useEffect(() => {
    if (watchFrontendFramework in FRAMEWORK_CSS_MAPPING) {
      setDynamicCssFrameworks(FRAMEWORK_CSS_MAPPING[watchFrontendFramework]);
    }
  }, [watchFrontendFramework, setValue]);

  const setFormData = useCallback(
    (key, value) => {
      setValue(`${SETTINGS_KEY}.${key}`, value);
    },
    [setValue]
  );

  useEffect(() => {
    if (data) {
      const frontendFramework = data?.settings.frontend
        ?.frameworks as FrontendFrameworks;
      const cssFramework =
        data?.settings.frontend?.cssFrameworks[frontendFramework];
      const language = data?.settings.frontend?.languages;

      setFormData('frameworks', frontendFramework);
      setFormData(`cssFrameworks.${frontendFramework}`, cssFramework);
      setFormData('languages', language);

      if (
        cssFramework === 'Other' &&
        data?.settings.frontend?.cssFrameworksOther[frontendFramework]
      ) {
        setFormData(
          `cssFrameworksOther.${frontendFramework}`,
          data?.settings.frontend?.cssFrameworksOther[frontendFramework]
        );
      }
    }
  }, [setValue, data, setFormData]);



  return (
    <Accordion
      title="フロントエンド設定"
      id="frontend"
      additional={<Additional formData={watchedForm} />}
      checked={isAccordionChecked}
      setChecked={(checked) => {
        if (!checked) {
          onSubmit(getValues()); // <-- Add this line
        }
        setIsAccordionChecked(checked);
      }}
    >
      <FormProvider {...methods}>
        <form>
          <div className="flex flex-col">
            <label className="font-bold mb-2">Frontend Frameworks</label>
            {FRAMEWORKS.map((framework, index) => (
              <FormItem
                key={index}
                item={framework}
                register={register}
                settingsKey="frameworks"
              />
            ))}
            <label className="font-bold mb-2">CSS Frameworks</label>
            {dynamicCssFrameworks.map((cssFramework, index) => (
              <FormItem
                key={index}
                item={cssFramework}
                register={register}
                settingsKey={`cssFrameworks.${watch(
                  `${SETTINGS_KEY}.frameworks`
                )}`}
              />
            ))}
            {watch(
              `${SETTINGS_KEY}.cssFrameworks.${watch(
                `${SETTINGS_KEY}.frameworks`
              )}`
            ) === 'Other' && (
              <div className="mb-2 flex flex-col justify-between w-full">
                <label htmlFor="cssFrameworksOther" className="mr-2">
                  Other CSS Framework
                </label>
                <input
                  id="cssFrameworksOther"
                  className="border border-gray-300 p-1 rounded w-full"
                  {...register(
                    `${SETTINGS_KEY}.cssFrameworksOther.${watch(
                      `${SETTINGS_KEY}.frameworks`
                    )}`
                  )}
                />
              </div>
            )}
            <label className="font-bold mb-2">Languages</label>
            {LANGUAGES.map((language, index) => (
              <FormItem
                key={index}
                item={language}
                register={register}
                settingsKey="languages"
              />
            ))}
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="bg-blue-500 text-white p-2 rounded mb-4"
            >
              保存
            </button>
          </div>
        </form>
      </FormProvider>
    </Accordion>
  );
};
