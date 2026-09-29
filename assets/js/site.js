(function(){
  var LANGS=['es','en','fr'];
  var dict=window.I18N||{};
  var nodes=[].slice.call(document.querySelectorAll('[data-i18n]'));
  var attrNodes=[].slice.call(document.querySelectorAll('[data-i18n-attr]'));
  var titleKey=document.body.getAttribute('data-title-key');
  var esTitle=document.title;

  // cache Spanish (source) text once
  nodes.forEach(function(el){ el.setAttribute('data-es',el.innerHTML); });
  attrNodes.forEach(function(el){
    var p=el.getAttribute('data-i18n-attr').split(':');
    el.setAttribute('data-es-'+p[0],el.getAttribute(p[0])||'');
  });

  function detect(){
    var q=new URLSearchParams(location.search).get('lang');
    if(q&&LANGS.indexOf(q)>-1) return q;
    try{ var s=localStorage.getItem('ab_lang'); if(s&&LANGS.indexOf(s)>-1) return s; }catch(e){}
    var n=(navigator.language||'es').slice(0,2).toLowerCase();
    return LANGS.indexOf(n)>-1?n:'es';
  }

  function apply(lang){
    var d=dict[lang]||{};
    document.documentElement.lang=lang;
    nodes.forEach(function(el){
      var k=el.getAttribute('data-i18n');
      var v=(lang==='es')?el.getAttribute('data-es'):d[k];
      el.innerHTML=(v!==undefined)?v:el.getAttribute('data-es');
    });
    attrNodes.forEach(function(el){
      var p=el.getAttribute('data-i18n-attr').split(':');
      var v=(lang==='es')?el.getAttribute('data-es-'+p[0]):d[p[1]];
      if(v!==undefined) el.setAttribute(p[0],v);
    });
    if(titleKey){ document.title=(lang==='es')?esTitle:(d[titleKey]||esTitle); }
    [].forEach.call(document.querySelectorAll('.lang button'),function(b){
      b.classList.toggle('on',b.getAttribute('data-lang')===lang);
    });
    try{ localStorage.setItem('ab_lang',lang); }catch(e){}
  }

  [].forEach.call(document.querySelectorAll('.lang button'),function(b){
    b.addEventListener('click',function(){ apply(b.getAttribute('data-lang')); });
  });
  apply(detect());

  // mobile menu
  var burger=document.getElementById('burger'), menu=document.getElementById('menu');
  if(burger&&menu){
    burger.addEventListener('click',function(){
      var o=menu.classList.toggle('open');
      burger.setAttribute('aria-expanded',o?'true':'false');
      document.body.style.overflow=o?'hidden':'';
    });
    [].forEach.call(menu.querySelectorAll('a'),function(a){
      a.addEventListener('click',function(){ menu.classList.remove('open'); document.body.style.overflow=''; });
    });
  }

  // reveal on scroll
  var rv=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    },{threshold:.12});
    [].forEach.call(rv,function(el){ io.observe(el); });
  } else { [].forEach.call(rv,function(el){ el.classList.add('in'); }); }

  // footer year
  var y=document.getElementById('yr'); if(y) y.textContent=new Date().getFullYear();

  // contact form: thank-you redirect back to this page
  var nu=document.getElementById('nextUrl');
  if(nu && /^https?:/.test(location.protocol)){
    nu.value=location.origin+location.pathname.replace(/[^\/]*$/,'')+'contact.html?sent=1';
  }
  if(new URLSearchParams(location.search).get('sent')==='1'){
    var m=document.getElementById('sentMsg'); if(m) m.style.display='block';
  }
})();
