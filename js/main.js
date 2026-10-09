(function(){
const root=document.documentElement;
try{
root.classList.add('js');
try{const v=localStorage.getItem('lang');if(v==='en'||v==='cs')root.lang=v;}catch(e){}
const $=id=>document.getElementById(id);
const safe=f=>{try{f()}catch(e){console.error(e)}};
const lb=$('lang');
if(lb)lb.addEventListener('click',()=>{root.lang=root.lang==='cs'?'en':'cs';try{localStorage.setItem('lang',root.lang);}catch(e){}});
const hd=$('site-header');
safe(()=>{const onScroll=()=>{if(hd)hd.classList.toggle('scrolled',(scrollY||0)>8)};addEventListener('scroll',onScroll,{passive:true});onScroll();});
const bg=$('burger'),nv=$('nav');
safe(()=>{if(bg&&nv){const set=o=>{nv.classList.toggle('open',o);bg.setAttribute('aria-expanded',String(o))};
  bg.addEventListener('click',()=>set(!nv.classList.contains('open')));
  nv.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('a'))set(false)});
  addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});}});
let still=false;try{still=matchMedia('(prefers-reduced-motion:reduce)').matches}catch(e){}
const hero=document.querySelector('.hero');
safe(()=>{if(hero&&!still&&matchMedia('(pointer:fine)').matches)hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5).toFixed(3));hero.style.setProperty('--my',((e.clientY-r.top)/r.height-.5).toFixed(3));});});
function reveal(){const els=document.querySelectorAll('.rv:not(.in)');
  if(still||!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return;}
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.1,rootMargin:'0px 0px -4% 0px'});
  els.forEach(e=>io.observe(e));}
let DB={};try{DB=DATA;}catch(e){console.error('data.js not loaded',e);}
const OP=DB.opportunities||[],PR=DB.projects||[];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const both=fn=>['cs','en'].map(l=>`<div class="${l}">${fn(l)}</div>`).join('');
const U=x=>/^(https?:|mailto:|\/)/.test(x)?x:'/'+x;
const T=(a,b)=>`<span class="cs">${a}</span><span class="en">${b}</span>`;
const tag=i=>typeof i.open==='boolean'?`<span class="tag ${i.open?'on':''}">${i.open?T('Otevřeno','Open'):T('Uzavřeno','Closed')}</span>`:'';
const txt=v=>!v?'':Array.isArray(v)?`<ul>${v.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:String(v).split(/\n\n+/).map(x=>`<p>${esc(x)}</p>`).join('');
const dt=(i,l)=>(i[l]&&i[l].dates)||i.dates||'';
const pl=(i,l)=>[(i[l]&&i[l].country)||i.country,i.location].filter(Boolean).join(', ');
const hs=(i,l)=>{const h=i.hero;return typeof h==='string'?h:((h&&h[l])||'')};
const pic=(i,l)=>{const s=hs(i,l);return s?`<img src="${esc(U(s))}" alt="${esc(i[l].title)}" loading="lazy">`:'<div class="noimg"><img src="/images/logo.png" alt=""></div>'};
const MORE={cs:'Zobrazit detail',en:'View details'};
const card=(base,i)=>{const u=`/${base}/${i.slug}/`;
  return `<article class="card rv${base==='projects'?' proj':''}"><a class="card-img" href="${u}" tabindex="-1" aria-hidden="true">${both(l=>pic(i,l))}</a><div class="card-b">${both(l=>`${tag(i)}${i.report?'<span class="tag on">PDF report</span>':''}<h3><a href="${u}">${esc(i[l].title)}</a></h3><p class="when"><b>${esc(dt(i,l))}</b><br>${esc(pl(i,l))}</p><p>${esc(i[l].short||'')}</p><a class="more" href="${u}">${MORE[l]}</a>`)}</div></article>`};
function lists(){
  const list=$('list');if(!list)return;
  const k=list.dataset.source;
  const items=k==='opportunities'?OP:k==='latest'?OP.filter(o=>o.open!==false).slice(0,3):PR.filter(p=>(p.status==='completed')===(k==='completed'));
  const base=(k==='opportunities'||k==='latest')?'opportunities':'projects';
  if(items.length)list.innerHTML=items.map(i=>card(base,i)).join('');
}
function detail(){
  const D=$('dbody');if(!D)return;
  const isO=document.body.dataset.page==='opportunity';
  const S=location.pathname.split('/').filter(x=>x&&x!=='index.html').pop();
  const i=(isO?OP:PR).find(x=>x.slug===S);
  const H={cs:{back:'Zpět',place:'Místo',dates:'Termín',deadline:'Uzávěrka přihlášek',details:'Podrobný popis',req:'Požadavky na účastníky',covered:'Co je hrazeno',apply:'Přihlásit se',info:'Infopack',report:'Stáhnout report (PDF)',nf:'Stránka nenalezena.'},
           en:{back:'Back',place:'Place',dates:'Dates',deadline:'Application deadline',details:'Detailed description',req:'Participant requirements',covered:'What is covered',apply:'Apply',info:'Infopack',report:'Download report (PDF)',nf:'Page not found.'}};
  if(!i){D.innerHTML=both(l=>`<p>${H[l].nf}</p><a class="back" href="/">${H[l].back}</a>`);return;}
  const back='/'+(isO?'opportunities':(i.status==='completed'?'completed-projects':'projects'))+'/';
  document.title=i.cs.title+' | Momentum Association';
  const meta=(h,l)=>{const rows=[[h.place,pl(i,l)],[h.dates,dt(i,l)],[h.deadline,isO?i.deadline:'']].filter(r=>r[1]);return rows.length?`<div class="meta">${rows.map(r=>`<div class="m"><small>${r[0]}</small><b>${esc(r[1])}</b></div>`).join('')}</div>`:''};
  const sec=(h,v)=>v&&v.length?`<h2 class="sh">${h}</h2>${txt(v)}`:'';
  const btn=(u,t,c)=>u?`<a class="btn ${c}" href="${esc(U(u))}">${t}</a>`:'';
  const hasHero=!!(hs(i,'cs')||hs(i,'en'));
  D.innerHTML=`<div class="od${hasHero?'':' nop'}">`+both(l=>{const t=i[l],h=H[l];
    const ctas=`<div class="ctas">${isO?btn(i.applyUrl,t.applyLabel||h.apply,'')+btn(i.infopack,h.info,'blue'):btn(i.report,h.report,'blue')}</div>`;
    return `<div class="od-head"><a class="back" href="${back}">${h.back}</a><div>${tag(i)}</div><h1 class="pt">${esc(t.title)}</h1><p class="lead">${esc(t.short||'')}</p>${meta(h,l)}${ctas}</div>`
     +(hasHero?`<figure class="od-poster"><img src="${esc(U(hs(i,l)||hs(i,l==='cs'?'en':'cs')))}" alt="${esc(t.title)}"></figure>`:'')
     +`<div class="od-body">${sec(h.details,t.details)}${isO?sec(h.req,t.requirements)+sec(h.covered,t.covered)+(t.cta?`<p class="lead cta">${esc(t.cta)}</p>`:'')+ctas:''}</div>`})+'</div>'
     +((i.photos||[]).length?`<div class="gal">${i.photos.map(p=>`<img src="${esc(U(p))}" alt="" loading="lazy">`).join('')}</div>`:'');
}
[lists,detail].forEach(safe);
document.querySelectorAll('.sec-h,.band,.prose,.team,.contact,.pill').forEach(e=>e.classList.add('rv'));
safe(reveal);
}catch(e){console.error(e);root.classList.add('rv-off');}
})();
