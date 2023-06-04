import { useEffect, useState } from 'react';
import { Message } from '../../types';

export const useVSCodeConfig = () => {
  const [config, setConfig] = useState<{
    hasApiKey: boolean;
    model: string;
  } | null>(null);
  const [loading, setLoading] = useState(true); // 新しい loading ステート

  useEffect(() => {
    const message: Message = {
      command: 'loadConfiguration',
    };
    window.vscodeAPI.postMessage(message, '*');
  }, []);

  useEffect(() => {
    const eventListener = (event: MessageEvent<Message>) => {
      if (event.data.command === 'loadConfiguration') {
        setConfig(event.data.data);
        setLoading(false); // ローディングが完了したことを示す
      }
    };

    window.addEventListener('message', eventListener);

    return () => {
      window.removeEventListener('message', eventListener);
    };
  }, []);

  return { config, loading }; // config と loading を返す
};
