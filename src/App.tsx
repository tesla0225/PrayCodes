import React, { useState,FC,memo } from 'react';
import ReactDOM from 'react-dom';
import { FrontendForm } from './components/frontend/FrontendForm';
import { HTMLForm } from './components/frontend/HTMLForm';
import { FunctionForm } from './components/frontend/FunctionForm';
import { JSONForm } from './components/frontend/JSONForm';
import { Logo } from '../src/components/assets/logo';
import { useVSCodeConfig } from './hooks/useVSCodeConfig';


import { QueryClient, QueryClientProvider } from 'react-query';

type errorProps = {
  hasApiKey: boolean;
};
const queryClient = new QueryClient();

const FORM_COMPONENTS = {
  frontend: FrontendForm,
  html: HTMLForm,
  backend: FunctionForm,
  json: JSONForm,
};

const ApiKeyError:FC<errorProps> = ({hasApiKey}) => {

  return (
    <>
      <h3 className={hasApiKey ? '' : 'text-red-600 text-lg font-bold'}>
        {hasApiKey ? '' : 'APIキーが設定されていません'}
      </h3>
      <p className="text-gray-500 text-sm">
        APIキーを設定するには、VSCodeの設定画面から、
        <br />
        Code > 基本設定 > 設定 > 拡張機能 > PrayCode > API key for OpenAI 
        <br />
        を設定してください。
        <br />
        設定後、VSCodeを再起動してください。
        <br />
        {/** ChatGPTへのリンク */}
        <a
          href="https://platform.openai.com/account/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          APIキーを取得する
        </a>
      </p>
    </>
  );
};



const App = () => {
  const [formType, setFormType] = useState('frontend');
  const SelectedFormComponent = FORM_COMPONENTS[formType] || FrontendForm;
  const {config,loading} = useVSCodeConfig();
  const { hasApiKey } = config || { hasApiKey: false };

  if (loading) {
    return null; // またはローディングインジケータ
  }



  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-white rounded p-8 ">
        {!hasApiKey && <ApiKeyError hasApiKey={hasApiKey} />}
        <h1 className="text-2xl font-bold mb-4 text-blue-500">
          <Logo />
        </h1>

        <div className="flex space-x-4 mb-4 border-b-2 border-gray-200 hidden">
          <button
            onClick={() => setFormType('frontend')}
            className={`py-2 px-4 ${
              formType === 'frontend'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
          >
            Components
          </button>
          <button
            onClick={() => setFormType('html')}
            className={`py-2 px-4 ${
              formType === 'html'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
          >
            HTML
          </button>
          <button
            onClick={() => setFormType('backend')}
            className={`py-2 px-4 ${
              formType === 'backend'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
          >
            Function
          </button>
          {/* <button
            onClick={() => setFormType('json')}
            className={`py-2 px-4 ${formType === 'json' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            JSON
          </button> */}
        </div>
        <div>
          <SelectedFormComponent key={formType} type={formType} />
        </div>
      </div>
    </QueryClientProvider>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
