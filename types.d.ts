declare global {
  interface Window {
    vscodeAPI: any;
  }
}

export {};

export type DirectorySettingsMessage = {
  settings: {
    directory: {
      path: string;
      name: string;
    };
  };
  key: string;
};

export type FrontendSettingsMessage = {
  settings: {
    frontend: {
      path: string;
      name: string;
    };
  };
  key: string;
};

export type FunctionSettingsMessage = {
  settings: {
    backend: {
      path: string;
      name: string;
    };
  };
  key: string;
};

export type HTMLSettingsMessage = {
  settings: {
    html: {
      path: string;
      name: string;
    };
  };
  key: string;
};

export type Message = {
  command: string;
  data: {
    key: string;
    [key: string]: any;
  };
}



