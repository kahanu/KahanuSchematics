import { SourceFile } from "typescript";
import { Tree, SchematicsException } from "@angular-devkit/schematics";
import { ts } from "../util/version-agnostic-typescript";

export function readIntoSourceFile(host: Tree, fileName: string): SourceFile {
  const buffer = host.read(fileName);
  if (buffer === null) {
    throw new SchematicsException(`File ${fileName} does not exist.`);
  }

  return ts.createSourceFile(
    fileName,
    buffer.toString("utf-8"),
    ts.ScriptTarget.Latest,
    true
  );
}
