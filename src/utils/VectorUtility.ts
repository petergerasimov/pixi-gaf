/**
 * AS3 Conversion
 * @author Mathieu Anthoine
 * 
 */
export class VectorUtility
{

	public static fillMatrix(v:Array<number>,
			a00:number, a01:number, a02:number, a03:number, a04:number,
			a10:number, a11:number, a12:number, a13:number, a14:number,
			a20:number, a21:number, a22:number, a23:number, a24:number,
			a30:number, a31:number, a32:number, a33:number, a34:number):void
	{
		v[0]=a00;v[1]=a01;v[2]=a02;v[3]=a03;v[4]=a04;
		v[5]=a10;v[6]=a11;v[7]=a12;v[8]=a13;v[9]=a14;
		v[10]=a20;v[11]=a21;v[12]=a22;v[13]=a23;v[14]=a24;
		v[15]=a30;v[16]=a31;v[17]=a32;v[18]=a33;v[19]=a34;
	}

	public static copyMatrix(source:Array<number>, dest:Array<number>):void
	{
		const l:number=dest.length;
		for(let i = 0; i < l; i++)
		{
			source[i]=dest[i];
		}
	}
}