(function(){
const B=document.body,R=B.dataset.root,root=document.documentElement;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const T=(a,b)=>`<span class="cs">${a}</span><span class="en">${b}</span>`;
const both=fn=>['cs','en'].map(l=>`<div class="${l}">${fn(l)}</div>`).join('');
const U=x=>/^(https?:|mailto:)/.test(x)?x:R+x;
const tag=i=>typeof i.open==='boolean'?`<span class="tag ${i.open?'on':''}">${i.open?T('Otevřeno','Open'):T('Uzavřeno','Closed')}</span>`:'';
const txt=v=>!v?'':Array.isArray(v)?`<ul>${v.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:String(v).split(/\n\n+/).map(x=>`<p>${esc(x)}</p>`).join('');
const NAV=[['about','O nás','About'],['opportunities','Příležitosti','Opportunities'],['projects','Projekty','Projects'],['completed-projects','Dokončené projekty','Completed projects'],['partners','Pro partnery','For partners'],['contact','Kontakt','Contact']];
document.getElementById('site-header').innerHTML=`<a class="brand" href="${R}">Momentum</a><nav>${NAV.map(n=>`<a href="${R}${n[0]}/"${B.dataset.nav===n[0]?' class="on"':''}>${T(n[1],n[2])}</a>`).join('')}</nav><button id="lang" type="button" aria-label="Language">${T('EN','CZ')}</button>`;
document.getElementById('site-footer').innerHTML=`<div class="eu"><img class="cs" src="${R}images/eu-cs.jpg" alt="Spolufinancováno Evropskou unií"><img class="en" src="${R}images/eu-en.jpg" alt="Co-funded by the European Union"></div><div>&copy; Momentum Association, z. s.</div>`;
const OP=DATA.opportunities||[],PR=DATA.projects||[];
const row=(base,i)=>{const u=`${R}${base}/${i.slug}/`;return `<article class="row"><div class="when">${esc(i.dates||'')}<br>${esc([i.country,i.location].filter(Boolean).join(', '))}</div><div>${both(l=>`<h3><a href="${u}">${esc(i[l].title)}</a>${tag(i)}</h3><p>${esc(i[l].short||'')}</p><a href="${u}">${l==='cs'?'Více':'More'}</a>`)}</div></article>`};
const list=document.getElementById('list');
if(list){const k=list.dataset.source;
  const items=k==='opportunities'?OP:k==='latest'?OP.filter(o=>o.open!==false).slice(0,3):PR.filter(p=>(p.status==='completed')===(k==='completed'));
  const base=(k==='opportunities'||k==='latest')?'opportunities':'projects';
  if(items.length)list.innerHTML=items.map(i=>row(base,i)).join('');}
const D=document.getElementById('dbody');
if(D){const isO=B.dataset.page==='opportunity';
  const S=location.pathname.split('/').filter(x=>x&&x!=='index.html').pop();
  const i=(isO?OP:PR).find(x=>x.slug===S);
  const H={cs:{back:'Zpět',place:'Místo',dates:'Termín',deadline:'Uzávěrka přihlášek',details:'Podrobný popis',req:'Požadavky na účastníky',covered:'Co je hrazeno',apply:'Přihlásit se',info:'Infopack',report:'Stáhnout report (PDF)',nf:'Stránka nenalezena.'},
           en:{back:'Back',place:'Place',dates:'Dates',deadline:'Application deadline',details:'Detailed description',req:'Participant requirements',covered:'What is covered',apply:'Apply',info:'Infopack',report:'Download report (PDF)',nf:'Page not found.'}};
  const back=R+(isO?'opportunities':(i&&i.status==='completed'?'completed-projects':'projects'))+'/';
  if(!i){D.innerHTML=both(l=>`<p>${H[l].nf}</p><a class="back" href="${R}">${H[l].back}</a>`);}
  else{
    document.title=i.cs.title+' | Momentum Association';
    const place=[i.country,i.location].filter(Boolean).join(', ');
    const meta=h=>`<dl class="meta">${[[h.place,place],[h.dates,i.dates],[h.deadline,isO?i.deadline:'']].filter(r=>r[1]).map(r=>`<dt>${r[0]}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl>`;
    const sec=(h,v)=>v&&v.length?`<h2 class="sh">${h}</h2>${txt(v)}`:'';
    const btn=(u,t)=>u?`<a class="btn" href="${esc(U(u))}">${t}</a> `:'';
    D.innerHTML=(i.hero?`<img class="herophoto" src="${esc(U(i.hero))}" alt="">`:'')+both(l=>{const t=i[l],h=H[l];
      return `<a class="back" href="${back}">${h.back}</a><h1 class="pt">${esc(t.title)}${tag(i)}</h1><p class="lead">${esc(t.short||'')}</p>${meta(h)}${sec(h.details,t.details)}${isO?sec(h.req,t.requirements)+sec(h.covered,t.covered)+btn(i.applyUrl,h.apply)+btn(i.infopack,h.info):btn(i.report,h.report)}`})
      +((i.photos||[]).length?`<div class="gal">${i.photos.map(p=>`<img src="${esc(U(p))}" alt="" loading="lazy">`).join('')}</div>`:'');
  }}
try{const v=localStorage.getItem('lang');if(v==='en'||v==='cs')root.lang=v;}catch(e){}
document.getElementById('lang').addEventListener('click',()=>{root.lang=root.lang==='cs'?'en':'cs';try{localStorage.setItem('lang',root.lang);}catch(e){}});
})();
