import {
  Model,
  Val,
  Location,
  keyPath,
  ValType,
  valTypeImgTypes,
  imgTypeStrs,
  Tagged,
} from "../model";

export class ValViewModel {
  vals: { [key in ValType]: Array<Val> };

  constructor(model: Model) {
    this.vals = model.vals;
    for (const [valType, valArray] of Object.entries(this.vals)) {
      for (const val of valArray) {
        const obj: Tagged = { ...val };
        obj.type = imgTypeStrs[valTypeImgTypes[val.type]];
        val.href = Location.makeDynamicHref(obj, "explore");
      }
    }
  }
}
