import { getProject } from "@schematics/angular/utility/project";
import { SchematicsException, Tree } from "@angular-devkit/schematics";
import { getWorkspacePath } from "@schematics/angular/utility/config";
import { normalize } from "@angular-devkit/core";
import { readIntoSourceFile } from "./source-file";

// /**
//  * Insert new styles content into host file CSS file.
//  * @param tree The host tree that describes the project.
//  * @param hostFile The filename of the file the new text will be inserted into.
//  * @param stylesToInsert The string content to be inserted into the host file.
//  */
export function addFixedHeaderStyles(
    tree: Tree,
    hostFile: string,
    stylesToInsert: string
  ) {
    // Get the path to the workspace
    const path = getWorkspacePath(tree);
  
    // Read the path as a buffer.
    const configBuffer = tree.read(path);
    if (configBuffer === null) {
      throw new SchematicsException(`Could not find (${path})`);
    }
    // Returns the angular.json content.
    const config = JSON.parse(configBuffer.toString());
  
    // Get the projects node from angular.json.
    const project = getProject(tree, config.defaultProject);
  
    // Create the path to the styles.css file.
    const stylesPath = normalize(`${project.sourceRoot}/${hostFile}`);
  
    const sourceFile = readIntoSourceFile(tree, stylesPath);
    const sourceFileText = sourceFile.getText();
  
    if (sourceFileText.includes(stylesToInsert)) {
      return;
    }
  
    // If the path to the styles file exists, update the file with the new styles.
    if (tree.exists(stylesPath)) {
      const fileEntry = tree.get(stylesPath);
      if (!fileEntry) {
        throw new Error(`The file (${stylesPath}) does not exist.`);
      }
  
      const recorder = tree.beginUpdate(stylesPath);
      recorder.insertLeft(0, stylesToInsert);
  
      tree.commitUpdate(recorder);
    }
  }
  