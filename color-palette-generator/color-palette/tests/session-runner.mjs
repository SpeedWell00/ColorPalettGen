import { build } from 'esbuild';
import { rm } from 'node:fs/promises';
const output = new URL('../.session-test.mjs', import.meta.url);
await build({entryPoints:['tests/session.jsx'],outfile:output.pathname,bundle:true,platform:'node',format:'esm',packages:'external',plugins:[{name:'mock-supabase',setup(build){build.onLoad({filter:/src\/lib\/supabase.js$/},()=>({contents:`
export const controls = {loads:[], saves:[], emit:null};
export const supabase = {
 auth: {onAuthStateChange(callback) {controls.emit=callback; queueMicrotask(()=>callback('INITIAL_SESSION',null)); return {data:{subscription:{unsubscribe(){}}}}; }},
 from() {return {
 select() {return {eq(){return {order(){return new Promise(resolve=>controls.loads.push(resolve));}}}};},
 insert() {return {select(){return {single(){return new Promise(resolve=>controls.saves.push(resolve));}}}};}
 };}
};` }));}}]});
try { await import(output.href); } finally { await rm(output); }
