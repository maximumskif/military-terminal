const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const path=require('path').join(__dirname,'../dist/scanner.js');
let source=fs.readFileSync(path,'utf8');
const nodes=new Map();function node(id){if(!nodes.has(id))nodes.set(id,{value:'',textContent:'',innerHTML:'',disabled:false,classList:{toggle(){}},querySelectorAll(){return []},insertAdjacentHTML(){}});return nodes.get(id)}
const tools=[];const context=vm.createContext({document:{getElementById:node,querySelectorAll:()=>[],modelContext:{registerTool:t=>tools.push(t)}},localStorage:{getItem:()=>null,setItem(){}},Intl,Date,AbortSignal,fetch:async()=>({ok:true,json:async()=>({results:[],page_metadata:{hasNext:false}})})});
vm.runInContext(source,context);
vm.runInContext(`
if(money(null)!=='Not reported')throw new Error('Missing amount treated as zero');
if(codeLabel({code:'517111',description:'Telecom'})!=='517111 — Telecom')throw new Error('Industry label');
state.rows=[{uei:'ABC123',id:'1'},{uei:'ABC123',id:'2'},{id:'3'},{id:'4'}];
if(groupedCompanies().length!==3)throw new Error('Company identity grouping');
if(!matched({prime:'Prime Example',amount:20},{term:'prime example',minimum:10}))throw new Error('Prime alert matching');
if(esc('<script>')!=='&lt;script&gt;')throw new Error('Unsafe source text');
`,context);
assert.equal(tools.length,1);assert.equal(tools[0].execute({}).awards.length,4);assert.throws(()=>tools[0].execute({unexpected:true}));
(async()=>{vm.runInContext('state.rows=[];state.request={};',context);await vm.runInContext('scan()',context);assert.equal(node('count').textContent,0);context.fetch=async()=>({ok:false,status:503});await vm.runInContext('scan()',context);assert.equal(node('count').textContent,'—');assert.ok(!node('rows').innerHTML.includes('Retrieving'));assert.ok(node('message').textContent.includes('503'));console.log('PASS: identity grouping, missing amounts, code labels, alert matching, escaping, structured read validation, empty results and failed scans.');})();
