// Remove only near-white pixels connected to the outside.
// White enclosed inside the lettering stays white.
export const prepareLogo = async (file:File):Promise<string> => {
  const bitmap=await createImageBitmap(file);
  const ratio=Math.min(1,1800/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement('canvas');
  canvas.width=Math.round(bitmap.width*ratio);
  canvas.height=Math.round(bitmap.height*ratio);
  const ctx=canvas.getContext('2d');
  if(!ctx)throw new Error('画像処理を開始できませんでした');
  ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
  bitmap.close();
  const {width:w,height:h}=canvas;
  const data=ctx.getImageData(0,0,w,h);
  const px=data.data;
  const seen=new Uint8Array(w*h);
  const queue=new Uint32Array(w*h);
  let head=0,tail=0;
  const push=(p:number)=>{
    if(seen[p])return;
    seen[p]=1;
    const k=p*4;
    if(px[k+3]<12||(px[k]>238&&px[k+1]>238&&px[k+2]>238)){
      queue[tail++]=p;
    }
  };
  for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}
  for(let y=0;y<h;y++){push(y*w);push(y*w+w-1);}
  while(head<tail){
    const p=queue[head++];
    px[p*4+3]=0;
    const x=p%w,y=Math.floor(p/w);
    if(x>0)push(p-1);if(x<w-1)push(p+1);
    if(y>0)push(p-w);if(y<h-1)push(p+w);
  }
  let minX=w,minY=h,maxX=-1,maxY=-1;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    if(px[(y*w+x)*4+3]>24){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
  }
  if(maxX<0)throw new Error('ロゴの輪郭が見つかりませんでした');
  ctx.putImageData(data,0,0);
  const output=document.createElement('canvas');
  output.width=maxX-minX+1+40;output.height=maxY-minY+1+40;
  output.getContext('2d')!.drawImage(canvas,minX,minY,maxX-minX+1,maxY-minY+1,20,20,maxX-minX+1,maxY-minY+1);
  return output.toDataURL('image/png');
};
