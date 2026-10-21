import assert from 'node:assert/strict';
import {CHAPTERS,getChapter,medal,cleanProgress} from '../resonance.js';
// Search actual fusion choices, including multi-goal stages. Every winning
// route must create the goals from its supplied seeds within its budget.
function minimumFusions(ch){
 const queue=[{counts:ch.seed,goals:ch.goals.map(()=>0),moves:0}],seen=new Set();
 for(let head=0;head<queue.length;head++){
  const s=queue[head];if(ch.goals.every((g,i)=>s.goals[i]>=g.count))return s.moves;
  if(s.moves>=ch.moves)continue;
  for(let level=0;level<5;level++)if(s.counts[level]>=3){
   const counts=[...s.counts],goals=[...s.goals],next=(level+1)%5;counts[level]-=3;counts[next]++;
   ch.goals.forEach((g,i)=>{if(g.level===next)goals[i]=Math.min(g.count,goals[i]+1)});
   const key=counts.join(',')+'|'+goals.join(',');if(seen.has(key))continue;seen.add(key);queue.push({counts,goals,moves:s.moves+1});
  }
 }
 return Infinity;
}
for(let i=0;i<32;i++){const ch=getChapter(i),min=minimumFusions(ch);assert.ok(Number.isFinite(min)&&min<=ch.moves,`${ch.name} cannot be won`);assert.ok(ch.seed.reduce((a,b)=>a+b,0)<=33);if(i<8)console.log(`${i+1}. ${ch.name}: solvable in ${min} fusions / ${ch.moves} moves`)}
assert.equal(CHAPTERS.length,8);assert.equal(medal(0,18),1);assert.equal(medal(5,18),2);assert.equal(medal(10,18),3);
assert.deepEqual(cleanProgress(null),{highest:0,current:0,stars:{}});
assert.deepEqual(cleanProgress({highest:3,current:9,stars:{0:3,1:5,99:2}}),{highest:3,current:3,stars:{0:3}});
assert.equal(getChapter(8).infinite,true);
console.log('32 chapters checked, including 24 infinite stages. Progress and rating checks passed.');
