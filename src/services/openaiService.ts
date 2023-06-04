import { Configuration, OpenAIApi } from 'openai';
import * as vscode from 'vscode';

// VSCode の設定から apiKey と model を取得
const apiKey = vscode.workspace
  .getConfiguration()
  .get('extension.openai.apiKey') as string;
const aiModel = vscode.workspace
  .getConfiguration()
  .get('extension.openai.model') as string | 'gpt-3.5-turbo';

const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

export async function ask(content: string, model: string = aiModel) {
  const response = await openai.createChatCompletion({
    model: model,
    messages: [{ role: 'user', content: content }],
    temperature:0

  });

  const answer = response.data.choices[0].message?.content;
  console.log(answer);
  return answer;
}
