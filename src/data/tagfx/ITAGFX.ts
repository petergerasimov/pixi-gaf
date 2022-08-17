import { Point, utils } from "pixi.js";
import TextureWrapper from "../textures/TextureWrapper";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default interface ITAGFX extends utils.EventEmitter
{
 	texture:TextureWrapper;
	
 	textureSize:Point;
	
 	textureScale:number;
	
 	textureFormat:string;
	
 	sourceType:string;
	
 	source:any;
	
 	ready:boolean;
}