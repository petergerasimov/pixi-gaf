import GAFLoader from "./core/GAFLoader";
import ZipToGAFAssetConverter from "./core/ZipToGAFAssetConverter";

import GAFBundle from "./data/GAFBundle";
import GAFGFXData from "./data/GAFGFXData";
import GAFTimeline from "./data/GAFTimeline";

import GAFImage from "./display/GAFImage";
import GAFMovieClip from "./display/GAFMovieClip";
import GAFTexture from "./display/GAFTexture";

import * as events from "./events/GAFEvent";

const core = { GAFLoader, ZipToGAFAssetConverter };
const data = { GAFBundle, GAFGFXData, GAFTimeline };
const display = { GAFImage, GAFMovieClip, GAFTexture }


export const GAFLibrary = { core, data, display, events };