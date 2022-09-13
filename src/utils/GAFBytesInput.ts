/**
 * AS3 ByteArray "Wrapper"
 * @author Mathieu Anthoine
 */
export default class GAFBytesInput {
	bigEndian = true;
	constructor(private buffer: ArrayBuffer, public position = 0, public length = buffer.byteLength) {}

	readBytes(position: number, length: number) {
		this.position += position;
		return new Uint8Array(this.buffer.slice(this.position,this.position += length));
	}

	readByte() {
		return (new Uint8Array(this.buffer.slice(this.position++,this.position)))[0];
	}

	readSByte() {
		return this.readByte() - 128;
	}
	
	readUnsignedByte () {
		return this.readByte();
	}

	readUint16() {
		return this.readByte() | (this.readByte() << 8);
	}

	readUint16BE() {
		return (this.readByte() << 8) | this.readByte();
	}

	readInt16() {
		return this.readUint16() - 32768;
	}

	readInt16BE() {
		return this.readUint16BE() - 32768;
	}

	// Couldn't find in haxe docs what this is supposed to do
	readnumber16() {
		return this.bigEndian ? this.readInt16BE() : this.readInt16();
	}
	
	readShort() {
		const lByte:number = this.readnumber16();
		return lByte > 32767 ? lByte-65536 : lByte;
	}	
	
	readUnsignedShort () {
		return this.readnumber16();
	}
	
	readnumber () {
		return this.readnumber32();
		// // var lnumber:number = readnumber32();
		// // lnumber = lnumber > 2147483648 ? lnumber - 4294967296 : lnumber;
		// // return cast(lnumber, number);
	}
	
	readUnsignednumber() {
		return this.readnumber32();
	}

	// may return an Unsigned number32 but number32 are converted to number32 if they are above 2147483648
	private readnumber32 () {
		const lA:number = this.readnumber16();
		const lB:number = this.readnumber16();
		return (lB << 16) + lA;
	}
	
	readboolean () {
		return this.readSByte() != 0;
	}
	
	readUTF() {
		return String.fromCharCode(this.readUint16());
	}
	
	
}