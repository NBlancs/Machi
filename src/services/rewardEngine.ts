import { getVariantCount } from "../assets/assetMap";
import { BuildingBucket } from "../types/app";

export function pickBuildingType(focusMinutes: number, streak: number): BuildingBucket {
  if (streak >= 7) {
    return "skyscraper";
  }

  if (focusMinutes >= 50) {
    return "long";
  }

  if (focusMinutes >= 30) {
    return "medium";
  }

  return "short";
}

export function pickVariantIndex(type: BuildingBucket, seed: number): number {
  const count = getVariantCount(type);
  return Math.abs(seed) % count;
}
