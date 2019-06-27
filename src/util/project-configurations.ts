import { WorkspaceProject } from '@angular-devkit/core/src/workspace';

export function getProjectTargetConfigurations(
  project: WorkspaceProject,
  buildTarget = "build"
) {
  if (
    project.architect &&
    project.architect[buildTarget] &&
    project.architect[buildTarget].options &&
    project.architect[buildTarget].configurations
  ) {
    return project.architect[buildTarget].configurations;
  }

  throw new Error(
    `${project.root}/architect/${buildTarget}/configurations not found.`
  );
}