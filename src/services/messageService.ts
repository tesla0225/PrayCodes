import { Message } from '../../types';
import * as vscode from 'vscode';


const extensionMap = {
  JavaScript: 'js',
  TypeScript: 'ts',
  Python: 'py',
  Ruby: 'rb',
  PHP: 'php',
  Go: 'go',
};

const frontendExtensionMap = {
  JavaScript: 'jsx',
  TypeScript: 'tsx',
  Vue: 'vue',
};
type Language = 'JavaScript' | 'TypeScript';
type BackendLanguage =
  | 'JavaScript'
  | 'TypeScript'
  | 'Python'
  | 'Ruby'
  | 'PHP'
  | 'Go';
  type MessageType = 'frontend' | 'backend' | 'html';


class QuestionTemplates {
  public frontend(
    data: any,
    settings: any
  ): { question: string; fileExtension: string } {
    console.log(
      'settings.settings.frontend.framework ',
      settings.settings.frontend.framework
    );
  const frontend = settings.settings.frontend;
  const { frameworks, cssFrameworks, cssFrameworksOther, languages } = frontend;

  const currentFramework = frameworks;
  const cssFramework =
    cssFrameworks[currentFramework] === 'Other'
      ? cssFrameworksOther[currentFramework]
      : cssFrameworks[currentFramework];

  const conditions = {
    name: data.name,
    frameworks: currentFramework,
    cssFrameworks: cssFramework,
    languages: languages,
    frontend: data.frontend,
  };

    const text = `
Create a functional, complete, and standalone frontend component.
Prioritize clear naming and readability over comments.
Only include necessary and relevant code.
Indicate the version of imported packages at the start of the file.
Follow standard practices and examples when in doubt.
Use only the libraries specified below.

conditions:
${JSON.stringify(conditions, null, 2)}`;

    // `settings.settings.frontend.languages`の値に応じて`fileExtension`を変更する
    
       let fileExtension = '';
       if (settings.settings.frontend.frameworks.includes('React')) {
         const language = settings.settings.frontend.languages as Language;
         fileExtension =
           language === 'JavaScript' ||
           language === 'TypeScript' 
             ? frontendExtensionMap[language]
             : 'txt';
       } else {
         fileExtension = 'vue';
       }

    return { question: text, fileExtension: fileExtension };
  }

  public backend(
    data: any,
    settings: any
  ): { question: string; fileExtension: string } {
    const text = `Please create a function with the following conditions and output all code.
    Please make sure to write clear naming and easy-to-understand code instead of comments.
Output only the code.
Please comment the version of the library you are using at the top of the code.
Please provide coding using general examples when there is insufficient information.


conditions:
name: ${data.name}
${JSON.stringify(settings.settings.function)}
${JSON.stringify(data.backend)}`;

    // `settings.settings.function.languages`の値に応じて`fileExtension`を変更する
     const backendLanguage = settings.settings.function
       .languages as BackendLanguage;
     const fileExtension =
       backendLanguage in extensionMap ? extensionMap[backendLanguage] : 'txt';

    return { question: text, fileExtension: fileExtension };
  }

  public html(
    data: any,
    settings: any
  ): { question: string; fileExtension: string } {
   const { html } = settings.settings;
   const isOtherStyleLibraryNamePresent = Boolean(html.otherStyleLibraryName);
   const isJQueryPresent = Boolean(html.jQuery);
   const isOtherLibraryPresent = Boolean(html.otherLibrary);
   const isBEM = Boolean(html.BEM);

   const stylingInstructions = `
  For CSS, Use the style tag.

`;

   const bemStyling = `${isBEM ? 'Styled by BEM': ''} `;

   const jqueryScript = `Script by jQuery `;

   const otherLibraryInfo = isOtherLibraryPresent
     ? `
  Use other style library name : ${html.otherStyleLibraryName}
  Use other library name : ${html.otherLibraryName}
`
     : '';

   const text = `
  Create a HTML and CSS with the following conditions and output all code.
  Make sure to write clear naming and easy-to-understand code.
  ${isOtherStyleLibraryNamePresent ? '' : stylingInstructions}
  Output only the code.
  HTML should be marked up properly with semantics in mind.
  Comment the version of the library you are using at the top of the code.

Please fill in the content with styling and markup using general examples when there is insufficient information

  conditions:
  class_name: ${data.name}
  ${isOtherStyleLibraryNamePresent ? '' : bemStyling}
  ${isJQueryPresent ? jqueryScript : ''}
  ${otherLibraryInfo}
  ${JSON.stringify(data.html)}
`;


    return { question: text, fileExtension: 'html' };
  }
}

export class MessageService {
  constructor(private context: vscode.ExtensionContext) {}

  public getQuestionFromMessage(message: Message): string {
    const questionTemplates = new QuestionTemplates();

    // Get settings from workspaceState
    const settingsByType: Record<string, any> = {
      frontend: this.context.workspaceState.get('frontendSettings'),
      backend: this.context.workspaceState.get('functionSettings'),
      html: this.context.workspaceState.get('htmlSettings'),
    };
      const messageType = message.data.type as MessageType;

      const { question } = questionTemplates[messageType](
        message.data,
        settingsByType[message.data.type]
      );

    return question;
  }

  public getFilenameFromMessage(
    message: Message,
    defaultFilename = 'answer'
  ): string {
    const questionTemplates = new QuestionTemplates();
    const settingsByType: Record<string, any> = {
      frontend: this.context.workspaceState.get('frontendSettings'),
      backend: this.context.workspaceState.get('functionSettings'),
      html: this.context.workspaceState.get('htmlSettings'),
    };

    const messageType = message.data.type as MessageType;
    const { fileExtension } = questionTemplates[messageType](
      message.data[message.data.type],
      settingsByType[message.data.type]
    );
    // const directory = this.context.workspaceState.get('directorySettings');
    const filename =  defaultFilename;
    return `${filename}.${fileExtension}`;
  }
}
