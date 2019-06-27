import { Rule, SchematicContext, Tree, apply, url, template, move, chain, branchAndMerge, mergeWith } from '@angular-devkit/schematics';
import { getWorkspace } from "@schematics/angular/utility/config";
import { parseName } from "@schematics/angular/utility/parse-name";
import { strings } from '@angular-devkit/core';
import { CoreOptions } from './CoreOptions';
import { addEnvironmentsApiProperty } from '../util/project-environment-file';
import { insertImportStatements } from '../util/app-module-updates-and-imports';

export default function (options: CoreOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);

    if (!options.project) {
      options.project = Object.keys(workspace.projects)[0];
    }
    const project = workspace.projects[options.project];

    if (options.path === 'core') {
      const projectDirName = project.projectType === 'application' ? 'app' : 'lib';
      if (projectDirName === 'app') {
        options.path = `/${project.root}/src/${projectDirName}`;
      } else {
        options.path = `/${project.sourceRoot}`  
      }
    }

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ...options
      }),
      () => { //console.debug('path', parsedPath.path )
    },
      move(parsedPath.path)
    ]);

    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource)
      ])),
      addEnvironmentsApiProperty(options),
      insertImportStatements(options)
    ]);

    return rule(host, context);

    // return host;
  };
}

