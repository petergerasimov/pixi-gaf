import { BufferUtility } from "bufferutility";

/**
 * AS3 ByteArray "Wrapper"
 * @author Mathieu Anthoine
 */
export default class GAFBytesInput extends BufferUtility {
	bigEndian = false;
	constructor(b: ArrayBuffer, pos = 0, len?:number) 
	{
		super(b.slice(0, len) as Buffer);
		this.position = pos;
	}
	
	readUnsignedByte ():number {
		return this.readByte();
	}

	// Couldn't find in haxe docs what this is supposed to do
	readnumber16() {
		return this.bigEndian ? this.readInt16BE() : this.readInt16();
	}
	
	readShort():number {
		const lByte:number = this.readnumber16();
		return lByte > 32767 ? lByte-65536 : lByte;
	}	
	
	readUnsignedShort ():number {
		return this.readnumber16();
	}
	
	readnumber ():number {
		return this.readnumber32();
		// var lnumber:number = readnumber32();
		// lnumber = lnumber > 2147483648 ? lnumber - 4294967296 : lnumber;
		// return cast(lnumber, number);
	}
	
	readUnsignednumber():number {
		return this.readnumber32();
	}

	// may return an Unsigned number32 but number32 are converted to number32 if they are above 2147483648
	private readnumber32 ():number {
		const lA:number = this.readnumber16();
		const lB:number = this.readnumber16();
		return (lB << 16) + lA;
	}
	
	readboolean ():boolean{
		return this.readSByte() != 0;
	}
	
	readUTF ():string {
		return this.readString(this.readUnsignedShort());
	}
	
	
}