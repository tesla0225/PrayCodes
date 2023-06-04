import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class WebViewProvider implements vscode.WebviewViewProvider {
  private _context: vscode.ExtensionContext;
  
  constructor(
    private extensionUri: vscode.Uri,
    context: vscode.ExtensionContext
  ) {
    this._context = context;
  }
  

  public resolveWebviewView(webviewView: vscode.WebviewView) {
     console.log('resolveWebviewView was called');
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
    let html = fs.readFileSync(indexPath, 'utf8');

    html = html.replace('{{styleUri}}', styleUri.toString());
    html = html.replace('{{scriptUri}}', scriptUri.toString());

    webviewView.webview.html = html;

    webviewView.webview.onDidReceiveMessage(
      async (message) => {
          console.log('message received');
        switch (message.command) {
          case 'saveFormData':
            // メッセージからデータを取得して保存する処理
            // console.log(message.data);
            await this._context.workspaceState.update('myKey', message.data);
            break;
          case 'loadFormData':
            // 保存したデータを取得してメッセージで返す処理
            // eslint-disable-next-line no-case-declarations
            const data = this._context.workspaceState.get('myKey');
            webviewView.webview.postMessage({
              command: 'loadFormData',
              data: data,
            });
            console.log(data);
        } 
      },
      undefined,
      this._context.subscriptions // サブスクリプションを適切に処理するための第3引数
    );
  }
}
