import { strings } from "@angular-devkit/core";
import { Schema } from "@schematics/angular/component/schema";
import { Rule, SchematicContext, SchematicsException } from "@angular-devkit/schematics";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { getWorkspace } from "@schematics/angular/utility/config";
import { getProjectFromWorkspace, getProjectMainFile } from "@angular/cdk/schematics/utils";
import { Change, InsertChange } from "@schematics/angular/utility/change";
import { addProviderToModule, insertImport } from "@schematics/angular/utility/ast-utils";
import { getAppModulePath } from "@schematics/angular/utility/ng-ast-utils";
import {
    ModuleOptions,
    buildRelativePath
  } from "@schematics/angular/utility/find-module";
import * as ts from "typescript";
import { CoreOptions } from "../core/CoreOptions";
  
const { dasherize, classify, camelize } = strings;
const stringUtils = { dasherize, classify, camelize };


export function insertImportStatements(options: CoreOptions): Rule {
    return (tree: Tree, _context: SchematicContext) => {
  
      const workspace = getWorkspace(tree);
      const project = getProjectFromWorkspace(workspace, options.workspaceHostProject);
      const mainFile = getProjectMainFile(project);
      const appModulePath = getAppModulePath(tree, mainFile);
      const typeName = 'service';
      
      options.module = appModulePath;
      options.path = options.path + '/core/interceptors';
      options.name = 'HttpRequestInterceptor';
  
      // console.log('options 2: ', options);
      const context = createAddTypeToModuleContext(tree, options, typeName);
      
      let modulePath = options.module || "";
  
      const moduleChanges: Change[] = addProviderToModule(
        context.source,
        modulePath,
        context.classifiedName,
        context.relativePath
      );

      // console.log('options 3: ', options);
      // console.log('moduleChanges: ', moduleChanges);
  
      // Modify the first Change which has the code to insert the service into
      // the providers array.  We need to change that to the interceptor object.
      // Instead of inserting this: 
      //   providers: [HttpRequestInterceptorService]
      // ... insert this:
      //   providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptorService, multi: true }]
      const firstChange = moduleChanges[0] as InsertChange;
  
      const serviceName = `${options.name}` + stringUtils.classify(typeName);
      const toInsert = `{ provide: HTTP_INTERCEPTORS, useClass: ${serviceName}, multi: true }`;
      firstChange.toAdd = toInsert;
  
      // Now add the import statement for the constant.
      const httpConstant = insertImport(context.source, modulePath, 'HTTP_INTERCEPTORS', '@angular/common/http');

      moduleChanges[2] = httpConstant;
  
      const moduleRecorder = tree.beginUpdate(modulePath);
      for (const change of moduleChanges) {
        if (change instanceof InsertChange) {
          moduleRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      tree.commitUpdate(moduleRecorder);
  
      return tree;
    };
  }

  
//#region Add Type to Module

export class AddToModuleContext {
    source: ts.SourceFile;
    relativePath: string;
    classifiedName: string;
  }
  
  /**
   * Create the context to add to module.
   * @param tree Tree
   * @param options Standard options including a "typeName" such as 'service', 'module', 'component', etc.
   */
  function createAddTypeToModuleContext(
    tree: Tree,
    options: ModuleOptions,
    typeName: string
  ): AddToModuleContext {
    const result = new AddToModuleContext();
  
    if (!options.module) {
      throw new SchematicsException(`Module not found.`);
    }
  
    const text = tree.read(options.module);
  
    if (text === null) {
      throw new SchematicsException(`File ${options.module} does not exist!`);
    }
    const sourceText = text.toString("utf-8");
    result.source = ts.createSourceFile(
      options.module,
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );
  
    const modulePath =
      `${options.path}/` +
      stringUtils.dasherize(options.name) +
      "." +
      stringUtils.camelize(typeName);

    result.relativePath = buildRelativePath(options.module, modulePath);
  
    result.classifiedName =
      stringUtils.classify(options.name) + stringUtils.classify(typeName);
  
    return result;
  }
  
  //#endregion
  