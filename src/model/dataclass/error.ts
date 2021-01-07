import { Tagged } from "../types";
import { isEntity } from "../record/entity";

const nodeNameRegex = /^nipype\.[\w_]+_wf\.single_subject_(?<sub>[^_]+)_wf(?:\.func_preproc_(?<tags>(?:_?[^_]+_[^_]+)+)_wf)?/;

export class NodeError implements Tagged {
  sub: string;
  task?: string;
  ses?: string;
  run?: string;
  dir?: string;

  protected constructor(sub: string) {
    this.sub = sub;
  }

  static async load(obj: any): Promise<NodeError> {
    if (!("node" in obj)) {
      throw new Error("NodeError missing node name");
    }

    const nodename = obj.node;

    const found = nodename.match(nodeNameRegex);

    if (found === null) {
      throw new Error(
        `Cannot parse NodeError node name '${nodename}'`
      );
    }
    
    const sub: string = found.groups.sub;
    const nodeError: NodeError = new NodeError(sub);

    const tags: string = found.groups.tags;
    if (tags !== undefined) {
      const splitTags: string[] = tags.split("_");
      while (splitTags.length > 1) {  // ensure we have at least two left
        let entity = splitTags.shift();
        let value = splitTags.shift();
        
        if (isEntity(entity)) {
          nodeError[entity] = value;
        } 
      }
    }
 
    return nodeError;
  }
}
