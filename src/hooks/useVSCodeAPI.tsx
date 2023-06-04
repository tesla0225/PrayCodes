import { useEffect, useState } from 'react';
import { Message } from '../../types';

type VSCodeAPI = {
  loadCommand: string;
  saveCommand: string;
  key: string;
};

export const useVSCodeAPI = ({ loadCommand, saveCommand, key }: VSCodeAPI) => {
  const [data, setData] = useState<{ [key: string]: any } | null>(null);

useEffect(() => {
  const message: Message = {
    command: loadCommand,
    data: { key },
  };
  window.vscodeAPI.postMessage(message, '*');

  const eventListener = (event: MessageEvent<Message>) => {
    // Check if the event was triggered by the same key
    if (event.data.command === loadCommand && event.data.data?.key === key) {
      setData(event.data.data);
    }
  };

  window.addEventListener('message', eventListener);

  return () => {
    window.removeEventListener('message', eventListener);
  };
}, [loadCommand, key]);

  const saveData = async (data: { [key: string]: any }) => {
    console.log("saveData------------------")
    console.log("key: ", key);
    console.log("data: ", data);
    const message: Message = {
      command: saveCommand,
      data: { key, ...data },
    };

    try {
      await window.vscodeAPI.postMessage(message, '*');
      // Increase trigger state to trigger data refresh
      return 'Data posted successfully';
    } catch (error) {
      console.error('Error posting data:', error);
      throw 'Error posting data';
    }
  };

  const postData = (data: { [key: string]: any }) => {
    const message: Message = {
      command: 'postFormData',
      data: { key, ...data },
    };
    window.vscodeAPI.postMessage(message, '*');
  };

  return { data, saveData, postData };
};
