import { WorkspaceProject } from '@angular-devkit/core/src/workspace';
import { SchematicsException, Tree, Rule } from '@angular-devkit/schematics';
import { getProjectTargetConfigurations } from './project-configurations';
import { getWorkspace } from '@schematics/angular/utility/config';
import { readIntoSourceFile } from './source-file';
import { ts } from './version-agnostic-typescript';
import { getSourceNodes } from '@schematics/angular/utility/ast-utils';
import { getProjectFromWorkspace } from '@angular/cdk/schematics/utils';

interface Schema {
  name?: string;
  project?: string;
  workspaceHostProject?: string;
}

export function addEnvironmentsApiProperty(options: Schema): Rule {
  return (tree: Tree) => {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.workspaceHostProject);
    const envPaths = getProjectEnvironmentFile(project);
  
    if (envPaths.length === 0) {
      return console.warn(`Could not find environment file "${envPaths}".`);
    }
  
    const insertion = ",\n" + `  Api: ''`;
  
    envPaths.forEach(path => {
      const sourceFile = readIntoSourceFile(tree, path);
  
      const sourceFileText = sourceFile.getText();
      if (sourceFileText.includes(insertion)) {
        return;
      }
  
      const nodes = getSourceNodes(sourceFile as any);
      const start = nodes.find(
        node => node.kind === ts.SyntaxKind.OpenBraceToken
      )!;
      const end = nodes.find(
        node => node.kind === ts.SyntaxKind.CloseBraceToken,
        start.end
      )!;
  
      const recorder = tree.beginUpdate(path);
      recorder.insertLeft(end.pos, insertion);
      tree.commitUpdate(recorder);
    });
  
    return tree;
  };
}

function getProjectEnvironmentFile(project: WorkspaceProject): string[] {
  const configurations = getProjectTargetConfigurations(project, 'build');

  if (
    !configurations.production ||
    !configurations.production.fileReplacements ||
    configurations.production.fileReplacements.length === 0
  ) {
    throw new SchematicsException(
      `Could not find the configuration of the workspace config (${
        project.sourceRoot
      })`
    );
  }

  const fileReplacements: any =
    configurations.production.fileReplacements;

  if (fileReplacements.length === 0) {
    throw new SchematicsException(`Could not find the environment paths.`);
  }

  const envArray: string[] = [];
  envArray.push(fileReplacements[0].replace);
  envArray.push(fileReplacements[0].with);

  return envArray;
}