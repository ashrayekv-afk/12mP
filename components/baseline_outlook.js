/* Live sensitivity of frozen NKPI; fictional forecast stays in a separate preview. */
(function(root){'use strict';
const S=typeof module!=='undefined'&&module.exports?require('./schema.js'):root.NKPI,E=S.esc;
const fmt=(v,d=1)=>Number.isFinite(v)?v.toFixed(d):'—';
const sign=v=>(v>0?'+':v<0?'−':'')+Math.abs(v).toFixed(1);
const name=k=>S.features.find(f=>f.key===k)?.label||'Age';
function summarize(current,result,dirty=false,config=null){
 const out={eye:current.eye,status:'unavailable',title:'Awaiting baseline values',reason:'Import or enter a single visit, verify the values, then calculate.',demo:current.demo===true};
 if(!current.enabled)return {...out,title:'Eye not included',reason:'Enable this eye to assess its baseline inputs.'};
 if(dirty)return {...out,title:'Source changed',reason:'Reimport confirmed values before reviewing baseline sensitivity.'};
 if(!result)return out;
 try{
  if(result.eye!==current.eye||S.stable(S.canonical(current))!==S.stable(result.case))throw new Error('Recalculate after changing measurements.');
  if(!config)throw new Error('Reconnect the calculator and calculate again.');
  S.verifyBaseline(result,config);
  return {...out,...result.baseline_outlook,title:result.case.mode==='longitudinal'?'Two-visit mode':result.status==='held'?'Inputs need review':'Baseline NKPI',demo:result.case.demo===true};
 }catch(error){return {...out,title:'Recalculation needed',reason:error.message};}
}
function render(p,disclosureKey='',opened=false){
 const heading='<header class="bl-eye-heading"><h3>'+E(p.eye==='OD'?'OD · Right eye':'OS · Left eye')+'</h3><span class="bl-pill">'+(p.demo?'SYNTHETIC INPUTS':'SINGLE VISIT')+'</span></header>';
 if(p.status!=='ready')return '<article class="bl-eye bl-empty" data-baseline-eye="'+E(p.eye)+'">'+heading+'<h3>'+E(p.title)+'</h3><p>'+E(p.reason)+'</p></article>';
 const lead=p.rows[0],band=v=>Number(v.toFixed(0))<33?'Lower':Number(v.toFixed(0))<67?'Intermediate':'Higher',changesBand=band(p.score_low)!==band(p.score_high);
 const rows=p.rows.map(r=>{const f=S.features.find(x=>x.key===r.key);return '<tr><th>'+E(f.label)+'</th><td>'+fmt(r.value,f.decimals)+'</td><td>±'+fmt(r.reference_pair_limit,3)+(f.unit?' '+E(f.unit):'')+'</td><td>'+fmt(r.score_low)+'–'+fmt(r.score_high)+'</td></tr>';}).join('');
 return '<article class="bl-eye" data-baseline-eye="'+E(p.eye)+'">'+heading+
 '<div class="bl-kicker">Current baseline NKPI</div><div class="bl-current">'+fmt(p.current_nkpi,0)+'<span>/ 100</span></div><p class="bl-score-caption">CXL-associated research index</p>'+
 '<div class="bl-sensitivity"><div class="bl-kicker">If the scan inputs vary</div><div class="bl-range"><strong>'+fmt(p.score_low)+'–'+fmt(p.score_high)+'</strong><span>NKPI points</span></div><div class="bl-track" role="img" aria-label="Current NKPI '+fmt(p.current_nkpi)+'; hypothetical stress-test envelope '+fmt(p.score_low)+' to '+fmt(p.score_high)+'"><span class="bl-track-span" style="left:'+p.score_low+'%;width:'+(p.score_high-p.score_low)+'%"></span><span class="bl-track-dot" style="left:'+Math.min(99,Math.max(1,p.current_nkpi))+'%"></span></div><div class="bl-axis"><span>0</span><span>100</span></div><p><b>'+ (changesBand?'Descriptive score band can change':'Same descriptive band in this test')+'</b><br>Hypothetical input variation · not a confidence interval.</p></div>'+
 '<div class="bl-priority"><span>Largest input sensitivity</span><strong>'+E(name(lead.key))+'</strong><small>Up to '+fmt(lead.maximum_shift)+' NKPI points when varied alone.</small></div>'+
 '<div class="bl-contributors"><h4>Top contributors to this NKPI</h4>'+p.top_contributors.map(e=>'<div><span>'+E(name(e.key))+'</span><b>'+sign(e.effect)+' pts</b></div>').join('')+'<p class="micro">Compared with the training median, one input at a time. These effects do not add up.</p></div>'+
 '<details class="bl-details"'+(disclosureKey?' data-disclosure="'+E(disclosureKey)+'"':'')+(opened?' open':'')+'><summary>Inspect scan sensitivity</summary><div class="table-wrap"><table><thead><tr><th>Input</th><th>Entered</th><th>Tested change</th><th>NKPI range</th></tr></thead><tbody>'+rows+'</tbody></table></div><p>The large range combines all six input extremes in the score-lowering and score-raising directions. The rows vary only one input. Age stays fixed at '+fmt(p.age_fixed)+' years.</p><p>Published same-day pair-repeatability limits set the test sizes. Correlated measurements are varied independently as a stress test; those combinations are not a predicted future cornea. Source errors, model uncertainty and actual scan quality are not quantified.</p><p>'+(p.within_training_ranges?'All seven inputs are within individual development ranges; this does not establish model reliability.':'Outside individual development ranges: '+E(p.outside_training_ranges.join(', '))+'.')+'</p><p>Scan quality: '+(p.scan_quality==='ok'?'recorded as acceptable':'unconfirmed')+' · Treatment history: '+(p.treatment==='untreated'?'recorded as untreated':'unconfirmed')+'.'+(p.clipped?' Perturbations were clipped at calculator input bounds.':'')+'</p><p>References: <a href="https://doi.org/10.1038/s41598-020-76020-6" target="_blank" rel="noopener noreferrer">Neuhann 2020</a> and <a href="https://doi.org/10.1371/journal.pone.0228992" target="_blank" rel="noopener noreferrer">Gustafsson 2020</a>. This supplement does not change NKPI.</p></details>'+
 '<div class="bl-forecast-status"><span>12-month progression probability</span><b>Patient forecast not released</b><small>The tested baseline candidate does not yet support reliable absolute-risk estimates.</small></div></article>';
}
function preview(){
 return '<div class="bl-fiction"><div class="bl-fiction-label">FICTIONAL DESIGN EXAMPLE · NO PATIENT DATA</div><h3>What a validated baseline forecast could look like</h3><p>All percentages, contributors and ranges below are invented to demonstrate the interface.</p><div class="bl-demo-grid">'+[
 {eye:'OD · Right eye',p:18,range:'14–22%',note:'Narrower illustrative range',drivers:['Age 24','Lower baseline curvature','Greater baseline thickness']},
 {eye:'OS · Left eye',p:62,range:'38–74%',note:'Illustrative sensitivity to thickness',drivers:['Age 24','Steeper baseline curvature','Lower baseline thickness']}
 ].map((d,i)=>'<article class="bl-demo-eye '+(i?'bl-demo-focus':'')+'"><h4>'+d.eye+'</h4><div class="bl-demo-number">'+d.p+'<span>%</span></div><b>Illustrative 12-month progression probability</b><ul>'+d.drivers.map(x=>'<li>'+x+'</li>').join('')+'</ul><details><summary>Inspect fictional sensitivity</summary><strong>'+d.range+'</strong><p>'+d.note+'</p></details></article>').join('')+'</div><p>This is a fictional bilateral case, age 24, with one visit and no prior CXL. No percentage is copied into calculations, PDF reports or numeric exports. The current NKPI is never relabelled as a progression probability.</p></div>';
}
const api={summarize,render,preview};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.NKPIBaseline=api;
})(typeof window!=='undefined'?window:globalThis);
