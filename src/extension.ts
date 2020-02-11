// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { TaskProvider } from "./taskProvider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export const activate = async (context: vscode.ExtensionContext) => {
  const taskProvider = new TaskProvider(context);

  vscode.window.registerTreeDataProvider("taskOutline", taskProvider);

  vscode.commands.registerCommand("taskOutline.refresh", () =>
    taskProvider.refresh()
  );
  vscode.commands.registerCommand("taskOutline.executeTask", task => {
    console.log(task);
    vscode.tasks.executeTask(task).then(
      onSuccessValue => onSuccessValue,
      onRejectedError => console.error(onRejectedError)
    );
  });
};

// this method is called when your extension is deactivated
export function deactivate() {}
