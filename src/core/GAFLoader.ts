import { Loader, Resource } from "pixi.js";

/**
 * Loader of GAF resources
 * @author Mathieu Anthoine
 */
export default class GAFLoader extends Loader
{

	names:Array<String>=[];
	contents:Array<GAFBytesInput>=[];


	constructor()
	{
		super();
	}

	addGAFFile (pUrl:string):void
	{
		if (pUrl.substring(pUrl.length-4) != ".gaf") throw new Error("GAFLoader supports only .gaf files");
		this.add(pUrl,{loadType: 1,xhrType:"arraybuffer"});
	}

	override load (cb?:any)
	{
		this.use(this.parseData.bind(this));
		return super.load();
	}

	private parseData(pResource:Resource, pNext:() => void): void
	{
		this.names.push(pResource.src);
		const lBytes:Bytes = Bytes.ofData(pResource.data);
		this.contents.push(new GAFBytesInput(lBytes, 0, lBytes.length));
		pNext();
	}

}