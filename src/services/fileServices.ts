import * as vscode from 'vscode';
import * as path from 'path';
import * as fse from 'fs-extra';

export async function createDirectoryIfNotExists(directoryPath: string) {
  const exists = await fse.pathExists(directoryPath);
  if (!exists) {
    const directoryUri = vscode.Uri.file(directoryPath);
    await vscode.workspace.fs.createDirectory(directoryUri);
  }
}

async function generateUniqueFilePath(
  directory: string,
  filename: string,
  extension: string
): Promise<string> {
  let uniqueFilename = filename;
  let counter = 1;
  while (
    await fse.pathExists(path.join(directory, `${uniqueFilename}${extension}`))
  ) {
    uniqueFilename = `${filename}(${counter})`;
    counter += 1;
  }
  return path.join(directory, `${uniqueFilename}${extension}`);
}

export async function createFileInWorkspace(
  relativeFolderPath: string,
  fileName: string,
  content: string
) {
  if (vscode.workspace.workspaceFolders === undefined) {
    console.error('No workspace folders found.');
    return;
  }

  const folderPath = path.join(
    vscode.workspace.workspaceFolders[0].uri.fsPath,
    relativeFolderPath
  );

  await createDirectoryIfNotExists(folderPath);

  const fileExtension = path.extname(fileName);
  const fileBaseName = path.basename(fileName, fileExtension);

  const uniqueFilePathString = await generateUniqueFilePath(
    folderPath,
    fileBaseName,
    fileExtension
  );

  const filePath = vscode.Uri.file(uniqueFilePathString);
  await vscode.workspace.fs.writeFile(filePath, Buffer.from(content));
  console.log('File created.');
}
