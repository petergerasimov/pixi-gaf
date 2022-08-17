import { BaseTexture } from "pixi.js";
import TextureWrapper from "../textures/TextureWrapper";
import TAGFXBase from "./TAGFXBase";

/**
 * @author Mathieu Anthoine
 */
export default class TAGFXsourcePixi extends TAGFXBase
{

	private bob:string;
	
	constructor(source:string) 
	{
		super();
		this._source = source;
		this.bob = source;
	}
	
	override get sourceType(): string {
		return "Texture_Pixi";
	}

	override get texture(): TextureWrapper
	{
		return new TextureWrapper(BaseTexture.from(this._source));
	}
	
}