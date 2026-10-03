(function(){
const root=document.documentElement;
try{const v=localStorage.getItem('lang');if(v==='en'||v==='cs')root.lang=v;}catch(e){}
const lb=document.getElementById('lang');
if(lb)lb.addEventListener('click',()=>{root.lang=root.lang==='cs'?'en':'cs';try{localStorage.setItem('lang',root.lang);}catch(e){}});
let DB={};try{DB=DATA;}catch(e){console.error('data.js not loaded',e);}
const OP=DB.opportunities||[],PR=DB.projects||[];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const T=(a,b)=>`<span class="cs">${a}</span><span class="en">${b}</span>`;
const both=fn=>['cs','en'].map(l=>`<div class="${l}">${fn(l)}</div>`).join('');
const U=x=>/^(https?:|mailto:|\/)/.test(x)?x:'/'+x;
const tag=i=>typeof i.open==='boolean'?`<span class="tag ${i.open?'on':''}">${i.open?T('Otevřeno','Open'):T('Uzavřeno','Closed')}</span>`:'';
const txt=v=>!v?'':Array.isArray(v)?`<ul>${v.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:String(v).split(/\n\n+/).map(x=>`<p>${esc(x)}</p>`).join('');
const dt=(i,l)=>(i[l]&&i[l].dates)||i.dates||'';const pl=(i,l)=>[(i[l]&&i[l].country)||i.country,i.location].filter(Boolean).join(', ');
const row=(base,i)=>{const u=`/${base}/${i.slug}/`;return `<article class="row"><div class="when">${both(l=>`${esc(dt(i,l))}<br>${esc(pl(i,l))}`)}</div><div>${both(l=>`<h3><a href="${u}">${esc(i[l].title)}</a>${tag(i)}</h3><p>${esc(i[l].short||'')}</p><a href="${u}">${l==='cs'?'Více':'More'}</a>`)}</div></article>`};
function lists(){
  const list=document.getElementById('list');if(!list)return;
  const k=list.dataset.source;
  const items=k==='opportunities'?OP:k==='latest'?OP.filter(o=>o.open!==false).slice(0,3):PR.filter(p=>(p.status==='completed')===(k==='completed'));
  const base=(k==='opportunities'||k==='latest')?'opportunities':'projects';
  if(items.length)list.innerHTML=items.map(i=>row(base,i)).join('');
}
function detail(){
  const D=document.getElementById('dbody');if(!D)return;
  const isO=document.body.dataset.page==='opportunity';
  const S=location.pathname.split('/').filter(x=>x&&x!=='index.html').pop();
  const i=(isO?OP:PR).find(x=>x.slug===S);
  const H={cs:{back:'Zpět',place:'Místo',dates:'Termín',deadline:'Uzávěrka přihlášek',details:'Podrobný popis',req:'Požadavky na účastníky',covered:'Co je hrazeno',apply:'Přihlásit se',info:'Infopack',report:'Stáhnout report (PDF)',nf:'Stránka nenalezena.'},
           en:{back:'Back',place:'Place',dates:'Dates',deadline:'Application deadline',details:'Detailed description',req:'Participant requirements',covered:'What is covered',apply:'Apply',info:'Infopack',report:'Download report (PDF)',nf:'Page not found.'}};
  if(!i){D.innerHTML=both(l=>`<p>${H[l].nf}</p><a class="back" href="/">${H[l].back}</a>`);return;}
  const back='/'+(isO?'opportunities':(i.status==='completed'?'completed-projects':'projects'))+'/';
  document.title=i.cs.title+' | Momentum Association';
  const place=[i.country,i.location].filter(Boolean).join(', ');
  const meta=(h,l)=>`<dl class="meta">${[[h.place,pl(i,l)],[h.dates,dt(i,l)],[h.deadline,isO?i.deadline:'']].filter(r=>r[1]).map(r=>`<dt>${r[0]}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl>`;
  const sec=(h,v)=>v&&v.length?`<h2 class="sh">${h}</h2>${txt(v)}`:'';
  const btn=(u,t)=>u?`<a class="btn" href="${esc(U(u))}">${t}</a> `:'';
  const heroOf=l=>{const s=typeof i.hero==='string'?i.hero:(i.hero&&i.hero[l]);return s?`<img class="herophoto" src="${esc(U(s))}" alt="${esc(i[l].title)}">`:''};
  D.innerHTML=both(l=>{const t=i[l],h=H[l];
    return `<a class="back" href="${back}">${h.back}</a>${heroOf(l)}<h1 class="pt">${esc(t.title)}${tag(i)}</h1><p class="lead">${esc(t.short||'')}</p>${meta(h,l)}${sec(h.details,t.details)}${isO?sec(h.req,t.requirements)+sec(h.covered,t.covered)+(t.cta?`<p class="lead">${esc(t.cta)}</p>`:'')+btn(i.applyUrl,t.applyLabel||h.apply)+btn(i.infopack,h.info):btn(i.report,h.report)}`})
    +((i.photos||[]).length?`<div class="gal">${i.photos.map(p=>`<img src="${esc(U(p))}" alt="" loading="lazy">`).join('')}</div>`:'');
}
[lists,detail].forEach(f=>{try{f();}catch(e){console.error(e);}});
})();
