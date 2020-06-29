import {
  ViewType,
  isViewType,
  ValType,
  isValType,
  SortKey,
  ImgTypeStr,
  isImgTypeStr,
  Entity,
  isEntity,
  entities,
} from "../record";
import { Model } from "../model";
import { Tagged } from "../types";

const delimiter = "/";
const nestedDelimiter = "+";

export class Location {
  viewType: ViewType;

  topChart: "nipype" | null = null;
  middleChart: "exclude" | ImgTypeStr | null = null;
  bottomChart: ValType | null = null;

  sortKey: SortKey | null = null;
  hash: string | null = null;

  constructor(viewType: ViewType) {
    this.viewType = viewType;
  }

  clone(): Location {
    const loc = new Location(this.viewType);

    loc.topChart = this.topChart;
    loc.middleChart = this.middleChart;
    loc.bottomChart = this.bottomChart;

    loc.sortKey = this.sortKey;
    loc.hash = this.hash;

    return loc;
  }

  static default(): Location {
    const loc = new Location("charts");
    loc.topChart = "nipype";
    loc.middleChart = "exclude";
    loc.bottomChart = "mean_fd";
    return loc;
  }

  static validateFragmentIdentifier(fi: string): boolean {
    try {
      Location.fromFragmentIdentifier(fi);
      return true;
    } catch {}
    return false;
  }
  static fromFragmentIdentifier(fi: string): Location {
    const parts = fi.split(delimiter);
    parts.shift();
    const viewType = parts.shift();
    if (!isViewType(viewType)) {
      throw new Error(`Location fragmentIdentifier has unknown ViewType '${viewType}'`);
    }
    const loc = new Location(viewType);
    if (viewType == "explore" || viewType === "zoom") {
      const sortKeyStr = parts.shift();
      if (sortKeyStr === "by-type") {
        loc.sortKey = "type";
      } else if (sortKeyStr === "by-subject") {
        loc.sortKey = "subject";
      }
      const hash = parts.shift();
      loc.hash = hash;
    } else if (viewType === "charts") {
      const chartSpecStr = parts.shift();
      const chartArray = chartSpecStr.split(nestedDelimiter);
      if (!chartArray.length) {
        throw new Error(`Location fragmentIdentifier needs at least one chart`);
      }
      let chartStr = chartArray.shift();
      if (chartStr === "nipype") {
        loc.topChart = "nipype";
        chartStr = chartArray.shift();
      }
      if (chartStr === "exclude" || isImgTypeStr(chartStr)) {
        loc.middleChart = chartStr;
        if (chartArray.length) {
          chartStr = chartArray.shift();
        }
      }
      if (isValType(chartStr)) {
        loc.bottomChart = chartStr;
      }
      if (chartArray.length) {
        throw new Error(
          `Location fragmentIdentifier has invalid charts specification '${chartSpecStr}'`
        );
      }
    }
    return loc;
  }
  toFragmentIdentifier(): string {
    if (this.viewType == "explore" || this.viewType === "zoom") {
      if (this.sortKey === null) {
        throw new Error(`Location missing sortKey`);
      }
      if (this.hash === null) {
        throw new Error(`Location missing hash`);
      }
      return `#/${this.viewType}/by-${this.sortKey}/${this.hash}`;
    } else if (this.viewType == "charts") {
      const charts: Array<string> = new Array<string>();
      if (this.topChart !== null) {
        charts.push(this.topChart);
      }
      if (this.middleChart !== null) {
        charts.push(this.middleChart);
      }
      if (this.bottomChart !== null) {
        charts.push(this.bottomChart);
      }
      // if (charts.length === 0) {
      //   throw new Error(`Not showing any chart`);
      // }
      const chartsStr = charts.join(nestedDelimiter);
      return `#/${this.viewType}/${chartsStr}`;
    }
  }

  static makeDynamicHref(
    obj: Tagged,
    viewType: ViewType | "infer",
    sortKey?: SortKey
  ): string {
    if (viewType == "explore" || viewType === "zoom" || viewType === "infer") {
      const inferStringArray = ["infer"];
      for (const k of entities) {
        if (obj[k]) {
          inferStringArray.push(`${k}-${obj[k]}`);
        }
      }
      const inferHashString = inferStringArray.join(nestedDelimiter);
      const inferSortKeyString = sortKey ? `by-${sortKey}` : "infer";
      return `#/${viewType}/${inferSortKeyString}/${inferHashString}`;
    } else if (viewType == "charts") {
      return Location.default().toFragmentIdentifier();
    }
  }
  resolveDynamicHref(href: string, model: Model): string {
    const parts = href.split(delimiter);
    parts.shift();
    let viewType = parts.shift();
    if (viewType === "infer" && (this.viewType === "explore" || this.viewType === "zoom")) {
      viewType = this.viewType;
    }
    if (!isViewType(viewType)) {
      throw new Error(`Location fragmentIdentifier has unknown ViewType '${viewType}'`);
    }
    const loc = new Location(viewType);
    if (viewType === "explore" || viewType === "zoom") {
      const sortKeyStr = parts.shift();
      if (sortKeyStr === "by-type") {
        loc.sortKey = "type";
      } else if (sortKeyStr === "by-subject") {
        loc.sortKey = "subject";
      } else if (sortKeyStr === "infer") {
        loc.sortKey = this.sortKey ? this.sortKey : "subject"; // safe default
      }
      const couldBeDynamic = parts.shift();
      const couldBeDynamicArray = couldBeDynamic.split(nestedDelimiter);
      const inferOrHash = couldBeDynamicArray.shift();
      if (inferOrHash === "infer") {
        if (couldBeDynamicArray.length > 0) {
          const query: Tagged = {};
          if (this.hash !== null) {
            const currentImg = model.imgsByHash[this.hash];
            for (const k of entities) {
              query[k] = currentImg[k];
            }
          }
          const entitiesInOrder: Array<Entity> = new Array<Entity>();
          for (const queryString of couldBeDynamicArray) {
            const queryStringSplit = queryString.split("-");
            const entity = queryStringSplit.shift();
            const value = queryStringSplit.join("-");
            if (isEntity(entity)) {
              entitiesInOrder.push(entity);
              query[entity] = value;
            }
          }
          for (const entity of entities) {
            if (!entitiesInOrder.includes(entity)) {
              entitiesInOrder.push(entity);
            }
          }
          loc.hash = model.database.closest(query, entitiesInOrder).hash;
        } else {
          loc.hash = this.hash ? this.hash : model.imgsArray[0].hash; // safe default
        }
      } else {
        loc.hash = inferOrHash;
      }
      return loc.toFragmentIdentifier();
    }
    return href;
  }
}
