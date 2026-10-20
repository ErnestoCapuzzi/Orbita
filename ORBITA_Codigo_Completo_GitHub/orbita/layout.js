// Pixel rectangles -> world coordinates. The UI, not the screen ratio,
// defines the space available to the garden.
export function worldField(width,height,rect,verticalHalf){
 const units=verticalHalf*2/height;
 return {left:(rect.left-width/2)*units,right:(rect.right-width/2)*units,top:(height/2-rect.top)*units,bottom:(height/2-rect.bottom)*units,units,width:rect.width,height:rect.height};
}
export function fittedRadius(field,count,level){
 const base=Math.max(13,Math.min(27,Math.sqrt(field.width*field.height/Math.max(12,count))*.29));
 return base*(.94+level*.09)*field.units;
}
export function constrain(value,low,high){return low>high?(low+high)/2:Math.max(low,Math.min(high,value))}
