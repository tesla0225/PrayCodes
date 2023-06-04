/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Message } from '../../types';
import { MessageService } from './messageService';
import { createFileInWorkspace } from './fileServices';
import { ask } from './openaiService';
import * as vscode from 'vscode';

export function loadConfiguration() {
const hasApiKey =
  vscode.workspace.getConfiguration().get('extension.openai.apiKey') !==
  "";
  console.log(
    'hasApiKey',
    vscode.workspace.getConfiguration().get('extension.openai.apiKey')
  );

  const model = vscode.workspace
    .getConfiguration()
    .get('extension.openai.model') as string;

  return { hasApiKey, model };
}

type AnyObject = { [key: string]: any; };

const removeEmptyProperties = (obj: AnyObject): AnyObject => {
  const newObj: AnyObject = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') {
      newObj[key] = removeEmptyProperties(obj[key]); // recurse
    } else if (obj[key] != null && obj[key] !== '') {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

export class CommandHandlers {
  constructor(
    private _context: vscode.ExtensionContext,
    private _webviewView: vscode.WebviewView | undefined
  ) {}

  public async handleCommand(message: Message) {
    const commandHandlers: Record<string, (message: Message) => Promise<void>> =
      {
        saveFormData: this.saveFormData.bind(this),
        loadFormData: this.loadFormData.bind(this),
        postFormData: this.postFormData.bind(this),
        loadConfiguration: this.loadConfiguration.bind(this),
      };

    const commandHandler = commandHandlers[message.command];
    if (!commandHandler) {
      console.log(`No handler for command ${message.command}`);
      return;
    }

    await commandHandler(message);
  }

  private async saveFormData(message: Message) {
    await this._context.workspaceState.update(message.data.key, message.data);
  }

  private async loadFormData(message: Message) {
    const loadData = this._context.workspaceState.get(message.data.key);
    const data = loadData ? loadData : null;
    console.log('loadData', loadData);

    if (this._webviewView) {
      this._webviewView.webview.postMessage({
        command: 'loadFormData',
        data: data,
      });
    }
  }

  private async loadConfiguration(message: Message) {
    const configuration = loadConfiguration();
    console.log('configuration', configuration);

    if (this._webviewView) {
      this._webviewView.webview.postMessage({
        command: 'loadConfiguration',
        data: configuration,
      });
    }
  }

  private async postFormData(message: Message) {
    const messageService = new MessageService(this._context);

    // @ts-ignore
    message.data = removeEmptyProperties(message.data);
    console.log('message', message);

    const question = messageService.getQuestionFromMessage(message);
    const fileName = messageService.getFilenameFromMessage(message,message.data.name);

    const answer = await ask(question);
    const directory = this._context.workspaceState.get('directorySettings');

    console.log(question);
    if (answer !== undefined) {
      await createFileInWorkspace(
        // @ts-ignore
        directory?.settings.directory.path,
        fileName,
        answer
      );
    }
  }
}
