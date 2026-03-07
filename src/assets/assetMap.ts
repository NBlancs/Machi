import { BuildingBucket } from "../types/app";

export const cityBackground = require("../../FigmaAssets/building-bg.png");
export const appLogo = require("../../FigmaAssets/Logo.png");
export const appWordmark = require("../../FigmaAssets/MACHI.png");

const shortBuildings = [
  require("../../FigmaAssets/pixel-building-bg-removed.png"),
  require("../../FigmaAssets/pixel-building-bg-removed 1.png"),
];

const mediumBuildings = [
  require("../../FigmaAssets/pixel-building-2-removebg-preview.png"),
  require("../../FigmaAssets/pixel-building-2-removebg-preview 1.png"),
  require("../../FigmaAssets/pixel-building-2-removebg-preview 2.png"),
  require("../../FigmaAssets/pixel-building-2-removebg-preview 3.png"),
];

const longBuildings = [
  require("../../FigmaAssets/pixel-building-3-removebg-preview.png"),
  require("../../FigmaAssets/pixel-building-3-removebg-preview 1.png"),
  require("../../FigmaAssets/pixel-building-3-removebg-preview 2.png"),
];

const skyscrapers = [
  require("../../FigmaAssets/pixel-building-3.jpg"),
  require("../../FigmaAssets/pixel-building-2.jpg"),
  require("../../FigmaAssets/pixel-building.jpg"),
];

const buildingSprites: Record<BuildingBucket, number[]> = {
  short: shortBuildings,
  medium: mediumBuildings,
  long: longBuildings,
  skyscraper: skyscrapers,
};

export function getBuildingSprite(type: BuildingBucket, variantIndex: number): number {
  const variants = buildingSprites[type];
  return variants[variantIndex % variants.length];
}

export function getVariantCount(type: BuildingBucket): number {
  return buildingSprites[type].length;
}
