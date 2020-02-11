import * as vscode from "vscode";

// add these notes when autorefresh is done
// ### Configurations

// autorefresh is set to `true` by default.

// add `"taskOutline.autorefresh": false` into your user settings to turn it off

export class TaskProvider implements vscode.TreeDataProvider<TreeTask> {
  // make an event emitter
  private _onDidChangeTreeData: vscode.EventEmitter<TreeTask | null> = new vscode.EventEmitter<TreeTask | null>();
  // stick it to the extended TreeDataProvider hook
  readonly onDidChangeTreeData: vscode.Event<TreeTask | null> = this
    ._onDidChangeTreeData.event;

  private autoRefresh: boolean = true;

  constructor(private context: vscode.ExtensionContext) {
    this.autoRefresh =
      vscode.workspace.getConfiguration("taskOutline").get("autorefresh") ||
      true;
  }

  public refresh(): void {
    // fire and event that connects to TreeDataProvider's onDidChangeTreeData hook
    this._onDidChangeTreeData.fire();
  }

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
