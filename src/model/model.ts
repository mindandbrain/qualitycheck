import { Comparator, PropertyComparator, PropertiesComparator } from "./comparator";
import { Deferred } from "./utils";

import { Val, Img, SubjectWorkflowStatus, PreprocStatus, Location } from "./dataclass";
import { ValType, ImgType, Rating, Entity, entities } from "./record";
import { RatingProperty, LocationProperty } from "./property";
import { Database } from "./database";

export class Model {
  vals: { [key in ValType]: Array<Val> } = {
    fd_mean: new Array<Val>(),
    fd_perc: new Array<Val>(),
    aroma_noise_frac: new Array<Val>(),
    mean_gm_tsnr: new Array<Val>(),
  };

  imgsByHash: { [key: string]: Img } = {};
  imgsArray: Array<Img> = new Array<Img>();
  database: Database = new Database();

  preprocStatuses: { [key: string]: Array<PreprocStatus> } = {};
  subjectWorkflowStatuses: Map<string, SubjectWorkflowStatus> = new Map<
    string,
    SubjectWorkflowStatus
  >();

  locationProperty: LocationProperty = new LocationProperty();

  ratingPropertiesByHash: Map<string, RatingProperty> = new Map<string, RatingProperty>();

  protected constructor() {}

  protected async sort() {
    const numc: Comparator<Val> = PropertyComparator<Val>("number");
    for (const key in this.vals) {
      this.vals[key] = this.vals[key].sort(numc);
      for (const [index, val] of this.vals[key].entries()) {
        val.index = index;
      }
    }
    const ic: Comparator<Img> = PropertiesComparator<Img>([
      "sub",
      "suffix",
      "task",
      "ses",
      "run",
      "dir",
      "typeIndex",
    ]);
    this.imgsArray.sort(ic);
    for (const [index, img] of this.imgsArray.entries()) {
      img.index = index;
    }
    this.database.put(this.imgsArray);
  }

  protected addImg(img: Img) {
    this.imgsArray.push(img);
    this.imgsByHash[img.hash] = img;
    this.ratingPropertiesByHash.set(img.hash, new RatingProperty(img.hash));
  }

  static async load(): Promise<Model> {
    const model = new Model();

    const reportExecDfd: Deferred = new Deferred();
    const reportImgsDfd: Deferred = new Deferred();
    const reportPreprocDfd: Deferred = new Deferred();
    const reportValsDfd: Deferred = new Deferred();

    window["report"] = async (str) => {
      const obj = JSON.parse(str);
      let dfd: Deferred | null = null;
      if (obj instanceof Array) {
        for (const element of obj) {
          if ("status" in element) {
            // reportpreproc.js
            const preprocStatus = await PreprocStatus.load(element);
            const sub = preprocStatus.sub;
            if (!(sub in model.preprocStatuses)) {
              model.preprocStatuses[sub] = new Array<PreprocStatus>();
            }
            model.preprocStatuses[sub].push(preprocStatus);
            dfd = reportPreprocDfd;
          } else if ("path" in element) {
            // reportimgs.js
            const img = await Img.load(element);
            if (img !== null) {
              model.addImg(img);
            }
            dfd = reportImgsDfd;
          } else {
            // reportvals.js
            for (const val of Val.load(element)) {
              model.vals[val.type].push(val);
            }
            dfd = reportValsDfd;
          }
        }
      } else {
        // reportexec.js
        model.subjectWorkflowStatuses = await SubjectWorkflowStatus.load(obj);
        reportExecDfd.resolve();
      }
      if (dfd !== null) {
        dfd.resolve();
      }
    };

    const loadScript = async (src): Promise<void> => {
      await new Promise((resolve, reject) => {
        var scriptElement: HTMLScriptElement = document.createElement("script");
        scriptElement.src = src;

        scriptElement.addEventListener("error", (event) => {
          reject(`Failed to load ${src} with error ${JSON.stringify(event)}`);
        });
        scriptElement.addEventListener("load", resolve);

        document.body.appendChild(scriptElement);
      });
    };

    await Promise.all([
      loadScript("reportexec.js"),
      loadScript("reportimgs.js"),
      loadScript("reportpreproc.js"),
      loadScript("reportvals.js"),
      reportExecDfd.promise,
      reportImgsDfd.promise,
      reportPreprocDfd.promise,
      reportValsDfd.promise,
    ]);
    await model.sort();
    return model;
  }
}
