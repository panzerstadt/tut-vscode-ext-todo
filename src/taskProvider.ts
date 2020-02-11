import * as vscode from "vscode";

export class TaskProvider implements vscode.TreeDataProvider<TreeTask> {
  constructor(private context: vscode.ExtensionContext) {}

  public async getChildren(task?: TreeTask): Promise<TreeTask[]> {
    let tasks = await vscode.tasks.fetchTasks().then(v => v);

    let treeTasks: TreeTask[] = [];

    if (tasks.length !== 0) {
      tasks.forEach((tTask, i) => {
        treeTasks[i] = new TreeTask(
          tTask.definition.type,
          tTask.name,
          vscode.TreeItemCollapsibleState.None,
          {
            command: "taskOutline.executeTask",
            title: "Execute",
            arguments: [tTask]
          }
        );
      });
    }

    return treeTasks;
  }

  getTreeItem(task: TreeTask): vscode.TreeItem {
    return task;
  }
}

export class TreeTask extends vscode.TreeItem {
  type: string;

  constructor(
    type: string,
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.type = type;
    this.command = command;
  }
}
