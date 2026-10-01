'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),S=require('../components/schema.js'),B=require('../components/baseline_outlook.js');
const make=(eye='OD')=>({...S.blank(eye),enabled:true,age:24,verified:true,treatment:'untreated',scan_quality:{first:'ok'},first:{A:7.2,B:5.8,C:480,Kmax:52,BAD_D:4,ARTmax:230}});
const service=eyes=>JSON.parse(execFileSync('python3',['-c',"import sys,json;from nkpi.service import configuration,calculate;print(json.dumps({'config':configuration(),'result':calculate(json.load(sys.stdin),include_pdf=False)}))"],{cwd:root,input:JSON.stringify({eyes}),encoding:'utf8'}));
const data=service([make(),make('OS')]);
for(const eye of ['OD','OS']){
 const c=make(eye),r=data.result.eyes[eye];assert(S.verify(c,r,data.config));
 const p=B.summarize(c,r,false,data.config.baseline_outlook),h=B.render(p);
 assert.equal(p.status,'ready');assert(h.includes('Largest input sensitivity'));assert(h.includes('Patient forecast not released'));
 assert(!h.includes('18%'));assert(!h.includes('62%'));assert(!h.includes('clinical progression probability'));
 assert.equal(B.summarize({...c,first:{...c.first,C:479}},r,false,data.config.baseline_outlook).status,'unavailable');
 assert.equal(B.summarize(c,r,true,data.config.baseline_outlook).status,'unavailable');
 for(const edit of [p=>p.eye='OS'===eye?'OD':'OS',p=>p.input_sha256='x',p=>p.version='old',p=>p.current_nkpi+=1,p=>p.score_low-=1,p=>p.score_high+=1,p=>p.forecast.probability=.62,p=>p.forecast.horizon_months=6,p=>p.rows[0].value+=1,p=>p.rows[0].reference_pair_limit*=2,p=>p.rows[0].maximum_shift+=1,p=>p.rows.pop(),p=>p.top_contributors[0].effect+=1,p=>p.scan_quality='unknown',p=>p.age_fixed+=1,p=>p.largest_sensitivity='C',p=>p.within_training_ranges=false]){
  const bad=structuredClone(r);edit(bad.baseline_outlook);assert.throws(()=>S.verify(c,bad,data.config));assert.equal(B.summarize(c,bad,false,data.config.baseline_outlook).status,'unavailable');
 }
}
const held=make();held.verified=false;const hr=service([held]);assert(S.verify(held,hr.result.eyes.OD,hr.config));assert.equal(B.summarize(held,hr.result.eyes.OD,false,hr.config.baseline_outlook).status,'unavailable');
const c=make();c.mode='longitudinal';c.latest={...c.first};c.interval_days=180;const pair=service([c]);assert(S.verify(c,pair.result.eyes.OD,pair.config));assert(B.render(B.summarize(c,pair.result.eyes.OD,false,pair.config.baseline_outlook)).includes('Two-visit mode'));
const html=fs.readFileSync(path.join(root,'components/index.html'),'utf8');assert(!/<details[^>]*id="baseline-drawer"[^>]*\bopen\b/.test(html));assert(html.indexOf('id="baseline-drawer"')>html.indexOf('id="results-area"'));assert(html.indexOf('id="baseline-drawer"')<html.indexOf('id="progression-drawer"'));assert(B.preview().includes('FICTIONAL DESIGN EXAMPLE'));assert(!JSON.stringify(data.result).includes('fictional'));
console.log('PASS baseline contract: both eyes, independent score arithmetic, tampering, held cases, longitudinal separation, stale source rejection and isolated fictional preview.');
