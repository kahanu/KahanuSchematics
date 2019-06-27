import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  Tree,
  apply,
  chain,
  mergeWith,
  move,
  noop,
  template,
  url,
} from '@angular-devkit/schematics';
import { Schema as ServiceOptions } from './schema';
import { getProject, buildDefaultPath } from '@schematics/angular/utility/project';
import { parseName } from '@schematics/angular/utility/parse-name';
import { applyLintFix } from '@schematics/angular/utility/lint-fix';


export default function (options: ServiceOptions): Rule {
  return (host: Tree) => {
    // console.log('service with base options: ', options);
    // const workspace = getWorkspace(host);
    
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    const project = getProject(host, options.project);

    if (options.path === undefined) {
      options.path = buildDefaultPath(project);
    }

    // options.skipTests = options.skipTests || !options.spec;

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const templateSource = apply(url('./files'), [
    //options.skipTests ? filter(path => !path.endsWith('.spec.ts.template')) : noop(),
      template({
        ...strings,
        // 'if-flat': (s: string) => options.flat ? '' : s,
        ...options,
      }),
      move(parsedPath.path),
    ]);

    return chain([
      mergeWith(templateSource),
      options.lintFix ? applyLintFix(options.path) : noop(),
    ]);
  };
}