import assert from 'node:assert/strict';
import {worldField,fittedRadius,constrain} from '../layout.js';
for(const [w,h,top,bottom] of [[390,844,345,683],[375,667,307,520],[320,568,307,421],[430,932,345,771],[844,390,70,290]]){
 const r={left:w>700?245:14,right:w-14,top,bottom,width:w-(w>700?259:28),height:bottom-top},field=worldField(w,h,r,9.2);
 const projectX=x=>w/2+x/field.units,projectY=y=>h/2-y/field.units;
 assert.ok(Math.abs(projectX(field.left)-r.left)<.001);assert.ok(Math.abs(projectY(field.bottom)-r.bottom)<.001);
 for(const count of [9,12,18,33])for(let level=0;level<5;level++){
  const rad=fittedRadius(field,count,level);assert.ok(Number.isFinite(rad)&&rad>0);
  const x=constrain(-100,field.left+rad*1.12,field.right-rad*1.12),y=constrain(100,field.bottom+rad*1.12,field.top-rad*1.12);
  assert.ok(projectX(x)-rad/field.units>=r.left-.001);assert.ok(projectY(y)-rad/field.units>=r.top-.001);
 }
 console.log(`${w}×${h}: positive playing area; all sphere sizes fit within reserved bounds.`);
}
