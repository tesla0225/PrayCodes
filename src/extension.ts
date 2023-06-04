
import * as vscode from 'vscode';
import * as path from 'path';
import * as fse from 'fs-extra';
import { Message } from '../types';

import { CommandHandlers } from './services/commonHandlers';

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension activated');
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'praycode.webview',
      new WebViewProvider(context.extensionUri, context)
    )
  );
}

class WebViewProvider implements vscode.WebviewViewProvider {
  private _context: vscode.ExtensionContext;
  private _webviewView: vscode.WebviewView | undefined;

  constructor(
    private extensionUri: vscode.Uri,
    context: vscode.ExtensionContext
  ) {
    this._context = context;
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._webviewView = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
    };

    const styleUri = webviewView.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'tailwind.min.css')
    );
    const scriptUri = webviewView.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'dist', 'bundle.js')
    );

    const indexPath = path.join(this.extensionUri.fsPath, 'index.html');
    let html = fse.readFileSync(indexPath, 'utf8');

    html = html.replace('{{styleUri}}', styleUri.toString());
    html = html.replace('{{scriptUri}}', scriptUri.toString());

    webviewView.webview.html = html;
    webviewView.webview.onDidReceiveMessage(
      this.handleMessage.bind(this),
      undefined,
      this._context.subscriptions
    );
  }

  private async handleMessage(message: Message) {
    try {
      await new CommandHandlers(this._context, this._webviewView).handleCommand(
        message
      );
      this._webviewView?.webview.postMessage('postDataComplete');
    } catch (error) {
      console.error(`Error handling command ${message.command}:`, error);
       this._webviewView?.webview.postMessage('error');
    }
  }
}
