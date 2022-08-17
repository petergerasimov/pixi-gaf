/**
 * AS3 ByteArray "Wrapper"
 * @author Mathieu Anthoine
 */
export default class GAFBytesInput extends BytesInput {

	constructor(b:Bytes, pos?:number, len?:number) 
	{
		super(b, pos, len);	
	}	
	
	// AS3 readByte
	readSByte():number {
		var lByte:number = readByte();
		return lByte > 128 ? lByte-256 : lByte;
	}
	
	readUnsignedByte ():number {
		return readByte();
	}
	
	readShort():number {
		var lByte:number = readnumber16();
		return lByte > 32767 ? lByte-65536 : lByte;
	}	
	
	readUnsignedShort ():number {
		return readnumber16();
	}
	
	readnumber ():number {
		return readnumber32();
		//var lnumber:number = readnumber32();
		//lnumber = lnumber > 2147483648 ? lnumber - 4294967296 : lnumber;
		//return cast(lnumber, number);
	}
	
	readUnsignednumber():number {
		return untyped readnumber32();
	}

	/**
	* may return an Unsigned number32 but number32 are converted to number32 if they are above 2147483648
	* @return signed number32
	*/
	private readnumber32 ():number {
		var lA:number = readnumber16();
		var lB:number = readnumber16();
		return (lB << 16) + lA;
	}
	
	readboolean ():boolean{
		return readSByte() != 0;
	}
	
	readUTF ():string {
		return readString(readUnsignedShort());
	}
	
	
}