import IGAFDisplayObject from "./IGAFDisplayObject";
import IGAFTexture from "./IGAFTexture";

/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export default interface IGAFImage extends IGAFDisplayObject
{	assetTexture:IGAFTexture;
	
	textureSmoothing:string;
}