const assert=require('node:assert/strict'),{loadLedger,resolveRecipient}=require('../entity-resolution.cjs');const ledger=loadLedger();assert.equal(ledger.relationships[0].effectiveFrom,'2020-04-03');assert.equal(ledger.entities[0].publicListing.ticker,'RTX');for(const input of [{name:'Raytheon'},{name:'Raytheon Company'},{uei:'UNKNOWN',name:'Raytheon Company'}]){const result=resolveRecipient(input,'2026-08-17');assert.equal(result.status,'unresolved');assert.equal(result.publicParent,null);assert.equal(result.ticker,null);}console.log('PASS reviewed dated corporate evidence does not fabricate recipient identity or ticker mappings');
// Operational reviewed bindings (reviews/recipients/raytheon-company.json): coverage is bounded by the reviewed relationship interval.
{const {assessFinancialMateriality}=require('../financial-materiality.cjs');const bound=ledger.identifierBindings.filter(b=>b.entityId==='legal:raytheon-company');assert.ok(bound.length>=40);assert.ok(bound.every(b=>b.reviewStatus==='reviewed_official_record'&&b.reviewFile&&b.sourceUrl.startsWith('https://www.usaspending.gov/recipient/')));assert.equal(new Set(ledger.identifierBindings.map(b=>b.kind+':'+b.value)).size,ledger.identifierBindings.length);
const tucson=resolveRecipient({uei:'VTEWM5QSE598'},'2025-06-01');assert.equal(tucson.status,'identifier_and_relationship_verified');assert.equal(tucson.publicParent,'RTX Corporation');assert.equal(tucson.ticker,null);
for(const [uei,date] of [['VTEWM5QSE598','2020-04-02'],['VTEWM5QSE598','2026-01-01'],['K1H5GGQPBLV5','2025-06-01']])assert.equal(resolveRecipient({uei},date).status,'unresolved');
const event=date=>({eventType:'DEFINITIVE_CONTRACT_AWARD',financial:{headlineAmount:{value:1.2e9,currency:'USD'}},identity:{recipientUei:'VTEWM5QSE598'},timestamps:{eventDate:{value:date}}});const a=assessFinancialMateriality(event('2025-06-01'),ledger);assert.equal(a.revenue.fiscalYearEnd,'2024-12-31');assert.equal(a.band,'notable');assert.equal(assessFinancialMateriality(event('2020-06-01'),ledger).status,'not_assessable');
console.log('PASS operational Raytheon Company UEI bindings resolve only inside reviewed relationship dates; excluded self-parented UEIs and post-evidence dates abstain; RTX revenue bands use the latest prior fiscal year');}
// Collins Aerospace legal entities and the Pratt & Whitney division (bound to the RTX registrant itself).
{const {assessFinancialMateriality}=require('../financial-materiality.cjs');const r=(uei,date)=>resolveRecipient({uei},date);
assert.equal(r('QN1BCFY7JDJ5','2026-09-01').status,'identifier_verified_public_registrant');assert.equal(r('QN1BCFY7JDJ5','2026-09-01').parentEntityId,'sec:0000101829');
for(const [uei,before,after] of [['SWBKVD2EKUH7','2018-11-25','2018-11-26'],['NWJXD3EE75U7','2012-07-25','2012-07-26'],['JC42EBJ5NFJ1','2007-09-30','2010-01-01']]){assert.equal(r(uei,before).status,'unresolved');assert.equal(r(uei,after).status,'identifier_and_relationship_verified');assert.equal(r(uei,'2026-01-01').status,'unresolved');}
// Retired after the latest-award parent check conflicted; recovered UEIs passed it.
for(const uei of ['QPHKSN6NVFB8','K1H5GGQPBLV5'])assert.equal(r(uei,'2024-05-01').status,'unresolved');assert.equal(r('QJ58YL55YKF3','2024-05-01').publicParent,'RTX Corporation');assert.equal(r('KLW3ZYL15493','2025-06-01').publicParent,'RTX Corporation');for(const uei of ['J4Q3HP6NHK47','JZNWHLVKADJ9','NFZTKCLHXAB7','GMBYU6KAN9J3'])assert.equal(r(uei,'2024-05-01').status,'identifier_and_relationship_verified');assert.equal(r('NHXNJALUN738','2026-05-01').status,'identifier_verified_public_registrant');assert.ok(ledger.retiredBindings.every(b=>b.retiredReasons.length&&!ledger.identifierBindings.some(x=>x.value===b.value)));
const a=assessFinancialMateriality({eventType:'DEFINITIVE_CONTRACT_AWARD',financial:{headlineAmount:{value:2.9e9,currency:'USD'}},identity:{recipientUei:'QN1BCFY7JDJ5'},timestamps:{eventDate:{value:'2026-09-01'}}},ledger);assert.equal(a.revenue.fiscalYearEnd,'2025-12-31');assert.equal(a.band,'notable');
console.log('PASS Collins legal-entity bindings respect acquisition/formation dates; Pratt & Whitney division binds to the RTX registrant for live dates; self-parented records abstain');}
// Lockheed Martin (registrant divisions) and Sikorsky (subsidiary from 2015-11-06).
{const r=(uei,date)=>resolveRecipient({uei},date);assert.equal(r('G4KDGE4JFFK7','2026-09-01').status,'identifier_verified_public_registrant');assert.equal(r('G4KDGE4JFFK7','2026-09-01').publicParent,'Lockheed Martin Corporation');
assert.equal(r('UTJWTSLMFNG4','2015-11-05').status,'unresolved');assert.equal(r('UTJWTSLMFNG4','2015-11-06').publicParent,'Lockheed Martin Corporation');assert.equal(r('UTJWTSLMFNG4','2026-03-01').status,'unresolved');
for(const uei of ['MAENKG4UJLK8','MJENSFHZJP11','UT9HCKX9F6Q4'])assert.equal(r(uei,'2025-01-01').status,'unresolved');
const lmt=ledger.entities.find(e=>e.id==='sec:0000936468');assert.equal(lmt.revenueEvidence.length,6);assert.ok(ledger.identifierBindings.filter(b=>b.entityId==='sec:0000936468').length>=40);
console.log('PASS Lockheed Martin division bindings resolve for live dates; Sikorsky resolves only from its 2015-11-06 acquisition through reviewed evidence; conflicting records abstain');}
// Northrop Grumman, General Dynamics, Boeing and L3Harris.
{const r=(uei,date)=>resolveRecipient({uei},date);
assert.equal(r('PK8PM2GNVMP8','2025-06-01').publicParent,'Northrop Grumman Corporation');assert.equal(r('PK8PM2GNVMP8','2019-12-30').status,'unresolved');assert.equal(r('E7BEKJ4V9528','2024-01-01').publicParent,'General Dynamics Corporation');
assert.equal(r('WZWRLY4G3PL8','2026-09-01').status,'identifier_verified_public_registrant');assert.equal(r('QM4EZDV15JL8','2026-09-01').publicParent,'L3Harris Technologies, Inc.');
assert.equal(r('FRJQGQHDX4J3','2019-06-28').status,'unresolved');assert.equal(r('FRJQGQHDX4J3','2026-01-02').publicParent,'L3Harris Technologies, Inc.');assert.equal(r('FRJQGQHDX4J3','2026-01-03').status,'unresolved');
for(const uei of ['D8CMPLV4GKR5','HA3UFSU8FN75','NYM8TAUFLXP3'])assert.equal(r(uei,'2024-01-01').status,'unresolved');
const lhx=ledger.entities.find(e=>e.id==='sec:0000202058');assert.ok(lhx.revenueEvidence.some(x=>x.fiscalYearEnd==='2026-01-02'));
console.log('PASS Northrop/GD subsidiaries resolve from reviewed 2019 listings; Boeing and L3Harris registrants resolve for live dates; L3 merger window and conflicting parents abstain');}
// Leidos, SAIC (2013 spin-off floor), KBR.
{const r=(uei,date)=>resolveRecipient({uei},date);
assert.equal(r('MDSWM6MB1BH7','2023-06-01').publicParent,'Leidos Holdings, Inc.');assert.equal(r('MDSWM6MB1BH7','2020-12-31').status,'unresolved');
assert.equal(r('MMLKPW9JLX64','2026-09-01').status,'identifier_verified_public_registrant');assert.equal(r('MMLKPW9JLX64','2013-09-26').status,'unresolved');assert.equal(r('W86MRS1GLQW5','2026-09-01').status,'unresolved');
assert.equal(r('HYBLSJAMM2F4','2024-06-01').publicParent,'KBR, Inc.');assert.equal(r('HYBLSJAMM2F4','2023-12-28').status,'unresolved');assert.equal(r('L693MQDFLKD1','2024-06-01').status,'unresolved');
assert.ok(ledger.entities.find(e=>e.id==='sec:0001443646').revenueEvidence.some(x=>x.fiscalYearEnd==='2026-03-31'));
console.log('PASS Leidos 100%-owned operating company window; SAIC registrant floored at the 2013-09-27 spin-off; KBR subsidiaries from reviewed listings; unverifiable records abstain');}
// Booz Allen, Huntington Ingalls and Aerojet Rocketdyne (indirect L3Harris subsidiary from 2023-07-28).
{const r=(uei,date)=>resolveRecipient({uei},date);
assert.equal(r('JCBMLGPE6Z71','2024-06-01').publicParent,'Booz Allen Hamilton Holding Corporation');assert.equal(r('JCBMLGPE6Z71','2020-03-30').status,'unresolved');
assert.equal(r('WMXDDH6HJNA5','2023-06-01').publicParent,'Huntington Ingalls Industries, Inc.');assert.equal(r('C3NLZNSMU254','2021-12-30').status,'unresolved');
assert.equal(r('JCZYYYQ7JGF5','2023-07-27').status,'unresolved');assert.equal(r('JCZYYYQ7JGF5','2024-06-01').publicParent,'L3Harris Technologies, Inc.');
console.log('PASS Booz Allen, HII and indirect Aerojet Rocketdyne bindings respect reviewed relationship windows');}
// Textron: Bell and Textron Aviation from the fiscal 2019 listing; Maryland Textron Systems only from fiscal 2020; self-parented records excluded.
{const r=(uei,date)=>resolveRecipient({uei},date);
assert.equal(r('N5QUZAYGPKM3','2024-06-01').publicParent,'Textron Inc.');assert.equal(r('N5QUZAYGPKM3','2024-06-01').ticker,null);assert.equal(r('N5QUZAYGPKM3','2020-01-03').status,'unresolved');assert.equal(r('N5QUZAYGPKM3','2026-01-04').status,'unresolved');
assert.equal(r('SNJ8YY61GB95','2020-06-01').status,'unresolved');assert.equal(r('SNJ8YY61GB95','2021-06-01').publicParent,'Textron Inc.');assert.equal(r('RSCJXUGJNGE3','2022-06-01').publicParent,'Textron Inc.');
for(const uei of ['WEE9WFHMACH9','KUZ4MEX7N6Y3'])assert.equal(r(uei,'2024-06-01').status,'unresolved');
console.log('PASS Textron subsidiary bindings respect reviewed Exhibit 21 windows; Textron Systems starts at its Maryland listing; self-parented records abstain');}
// CACI: core subsidiaries from the fiscal 2019 listing through fiscal 2026; LGS and Azure Summit only at their fiscal 2026 listing; self-parented records excluded.
{const r=(uei,date)=>resolveRecipient({uei},date);
assert.equal(r('N3PBJAVNKF61','2024-06-01').publicParent,'CACI International Inc');assert.equal(r('N3PBJAVNKF61','2019-06-29').status,'unresolved');assert.equal(r('N3PBJAVNKF61','2026-07-01').status,'unresolved');
assert.equal(r('GS59ABNVD6N7','2021-06-01').publicParent,'CACI International Inc');assert.equal(r('W479FKUUKM96','2024-06-01').status,'unresolved');assert.equal(r('P1LMDHFJSYH7','2026-06-30').publicParent,'CACI International Inc');
for(const uei of ['EELEC8QCC3N8','E5E6SMMJYPL3','EPPXR2P9KYU6','QSRTXLFKV857'])assert.equal(r(uei,'2024-06-01').status,'unresolved');
console.log('PASS CACI subsidiary bindings respect reviewed Exhibit 21.1 windows; renamed and truncated listings start at fiscal 2026; self-parented records abstain');}
// Parsons: subsidiaries from their first Exhibit 21.1 listing through fiscal 2025; Xator LLC from fiscal 2022 (acquisition passage names Xator Corporation); registrant and self-parented records abstain.
{const r=(uei,date)=>resolveRecipient({uei},date);
assert.equal(r('NMBCAG1JBKL7','2023-06-01').publicParent,'Parsons Corporation');assert.equal(r('NMBCAG1JBKL7','2019-12-30').status,'unresolved');assert.equal(r('NMBCAG1JBKL7','2026-01-01').status,'unresolved');
assert.equal(r('ZJFDNMA46LT9','2022-06-01').status,'unresolved');assert.equal(r('ZJFDNMA46LT9','2023-06-01').publicParent,'Parsons Corporation');assert.equal(r('H3RFVAELHB73','2020-06-01').status,'unresolved');
for(const uei of ['FFCMDLMXRK49','DT2NPK1X9HD5','QJD7W4CUEN63'])assert.equal(r(uei,'2024-06-01').status,'unresolved');
console.log('PASS Parsons subsidiary bindings respect reviewed Exhibit 21.1 windows; Xator LLC starts at its listing; registrant and self-parented records abstain');}
// BWXT: 100%-owned significant subsidiaries from their Exhibit 21.1 listings; self-parented records abstain.
{const r=(uei,date)=>resolveRecipient({uei},date);
assert.equal(r('SMJQJGD5JEJ3','2023-06-01').publicParent,'BWX Technologies, Inc.');assert.equal(r('SMJQJGD5JEJ3','2019-12-30').status,'unresolved');assert.equal(r('WJYVCPD5HKK7','2020-06-01').publicParent,'BWX Technologies, Inc.');
assert.equal(r('PZDQCRZW7GJ3','2022-06-01').status,'unresolved');assert.equal(r('PZDQCRZW7GJ3','2023-06-01').publicParent,'BWX Technologies, Inc.');assert.equal(r('WJYVCPD5HKK7','2026-01-01').status,'unresolved');
for(const uei of ['UMBKD2WKD8N5','CMT4S6G76QB5'])assert.equal(r(uei,'2024-06-01').status,'unresolved');
console.log('PASS BWXT 100%-owned subsidiary bindings respect reviewed Exhibit 21.1 windows; self-parented and registrant records abstain');}
