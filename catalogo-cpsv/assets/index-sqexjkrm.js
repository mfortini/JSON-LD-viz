(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function s(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(i){if(i.ep)return;i.ep=!0;const n=s(i);fetch(i.href,n)}})();const de={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/1":"Iscrizione scuola/università e/o richiesta borsa di studio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/2":"Invalidità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/3":"Ricerca di lavoro, avvio nuovo lavoro, disoccupazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/4":"Pensionamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/5":"Richiesta o rinnovo patente","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/6":"Registrazione/possesso veicolo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/7":"Accesso al trasporto pubblico","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/8":"Compravendita/affitto casa/edifici/terreni, costruzione o ristrutturazione casa/edificio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/9":"Cambio di residenza/domicilio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/10":"Espatrio per lavoro, studio, pensionamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/11":"Richiesta passaporto, visto e assistenza viaggi internazionali","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/12":"Nascita di un bambino, richiesta adozioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/13":"Matrimonio e/o cambio stato civile","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/14":"Morte ed eredità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/15":"Prenotazione e disdetta visite/esami","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/16":"Denuncia crimini","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/17":"Dichiarazione dei redditi, versamento e riscossione tributi/imposte e contributi","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/18":"Accesso luoghi della cultura","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/19":"Possesso, cura, smarrimento animale da compagnia"},ue={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/1":"Istruzione e formazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/2":"Salute","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/3":"Lavoro e occupazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/4":"Previdenza e assistenza","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/5":"Mobilità e trasporti","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/6":"Veicoli e motorizzazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/7":"Trasporto pubblico","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/8":"Casa e territorio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/9":"Anagrafe e residenza","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/10":"Estero e mobilità internazionale","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/11":"Documenti di viaggio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/12":"Famiglia e nascite","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/13":"Stato civile","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/14":"Successioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/15":"Sanità e prestazioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/16":"Sicurezza e denunce","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/17":"Fisco e tributi","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/18":"Cultura e turismo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/19":"Animali","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/20":"Altro"};function v(t){if(t==null)return null;if(typeof t=="string")return t.trim()||null;if(Array.isArray(t)){for(const e of t){const s=v(e);if(s)return s}return null}if(typeof t=="object"){if(typeof t["@value"]=="string")return t["@value"].trim()||null;if(typeof t.value=="string")return t.value.trim()||null}return null}function V(t){return t==null?[]:Array.isArray(t)?t:[t]}function fe(t){return t==null?null:typeof t=="string"?t:typeof t=="object"&&t["@id"]?String(t["@id"]):null}function O(t,e){const s=t==null?void 0:t["@type"];return V(s).map(String).some(i=>i===e||i.endsWith(e)||i.includes(e))}function B(t,e=180){if(!t)return"";const s=t.replace(/\s+/g," ").trim();return s.length<=e?s:`${s.slice(0,e-1).trim()}…`}function c(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const pe=/\s*(?:leggi\s+(?:di\s+pi[uù]|meno)|mostra\s+(?:di\s+pi[uù]|meno)|read\s+more|show\s+more|nascondi)\s*/gi,ve=/((?:[A-ZÀÈÉÌÒÙ][A-ZÀÈÉÌÒÙ0-9'’\-\/]{1,}(?:\s+|,\s*))+[A-ZÀÈÉÌÒÙ][A-ZÀÈÉÌÒÙ0-9'’\-\/]{1,})/g;function w(t){if(!t)return null;let e=String(t);return e=e.replace(/<script[\s\S]*?<\/script>/gi," "),e=e.replace(/<style[\s\S]*?<\/style>/gi," "),e=e.replace(/<[^>]+>/g," "),e=e.replace(/&nbsp;/gi," "),e=e.replace(/&amp;/gi,"&"),e=e.replace(pe," "),e=e.replace(/\r\n/g,`
`),e=e.split(/\n{2,}/).map(s=>s.replace(/[^\S\n]+/g," ").replace(/\n/g," ").trim()).filter(Boolean).join(`

`),e||null}function ge(t){const e=w(t);if(!e)return[];if(e.includes(`

`)){const r=[];for(const d of e.split(`

`)){const u=d.trim();if(u)if(me(u))r.push({heading:u.replace(/\s+/g," ").trim(),text:""});else{const p=r[r.length-1];p&&p.heading&&!p.text?p.text=u:r.push({heading:null,text:u})}}return r.filter(d=>d.heading||d.text)}const s=[...e.matchAll(ve)];if(!s.length)return[{heading:null,text:e}];const o=s.map(r=>({index:r.index,title:r[1].replace(/\s+/g," ").trim()})).filter(r=>r.title.length>=10&&r.title.split(/\s+/).length>=2);if(!o.length)return[{heading:null,text:e}];const i=[];for(const r of o){const d=i[i.length-1];d&&r.index<d.index+d.title.length||i.push(r)}const n=[],a=i[0];if(a.index>0){const r=e.slice(0,a.index).trim();r&&n.push({heading:null,text:r})}for(let r=0;r<i.length;r++){const d=i[r].index+i[r].title.length,u=r+1<i.length?i[r+1].index:e.length,p=e.slice(d,u).trim();n.push({heading:i[r].title,text:p})}return n.filter(r=>r.heading||r.text)}function k(t){const e=ge(t);return e.length?e.map(s=>{const o=[];return s.heading&&o.push(`<h3 class="h5 mt-3 mb-2">${c(he(s.heading))}</h3>`),s.text&&o.push(`<p class="mb-2">${c(s.text)}</p>`),o.join("")}).join(""):""}function me(t){const e=t.replace(/\s+/g," ").trim();return e.length<5||e.length>80||!/[A-ZÀÈÉÌÒÙ]/.test(e)||e!==e.toLocaleUpperCase("it")||e.split(/\s+/).length>8?!1:/^[A-ZÀÈÉÌÒÙ0-9][A-ZÀÈÉÌÒÙ0-9'’\-\/\s,;:]+$/.test(e)}function he(t){return t.toLocaleLowerCase("it").replace(/(^|[\s,/])(\S)/g,(s,o,i)=>o+i.toLocaleUpperCase("it"))}const ee="./cpsv_full.jsonld";function be(t=window.location.hash){const e=(t||"").replace(/^#/,"");let s=null,o="/";if(e.startsWith("catalog=")){const r=e.indexOf("&"),d=r===-1?e.slice(8):e.slice(8,r);s=decodeURIComponent(d),o=r===-1?"/":e.slice(r+1)||"/"}else e&&(o=e.startsWith("/")?e:`/${e}`);o.startsWith("/")||(o=`/${o}`);let i="list",n=null;const a=o.match(/^\/servizio\/(.+)$/);return a&&(i="detail",n=decodeURIComponent(a[1])),{catalog:s,path:o,view:i,serviceId:n}}function F({catalog:t,path:e="/"}){const s=e.startsWith("/")?e:`/${e}`;return t?`#catalog=${encodeURIComponent(t)}&${s}`:`#${s}`}function te(t){return!t||!String(t).trim()?ee:String(t).trim()}async function ye(t){const e=te(t);let s;try{s=await fetch(e,{credentials:"same-origin"})}catch(i){const n=new Error(`Impossibile scaricare il catalogo (${e}). Verifica URL, CORS o rete.`);throw n.cause=i,n.code="NETWORK",n}if(!s.ok){const i=new Error(`Catalogo non disponibile (HTTP ${s.status}): ${e}`);throw i.code="HTTP",i}let o;try{o=await s.json()}catch(i){const n=new Error(`Il file non è un JSON valido: ${e}`);throw n.cause=i,n.code="JSON",n}if(!o||typeof o!="object"||!Array.isArray(o["@graph"])){const i=new Error("JSON-LD senza @graph: file non utilizzabile come catalogo CPSV.");throw i.code="SHAPE",i}return{doc:o,url:e}}function y(t){return V(t).map(fe).filter(Boolean)}function P(t,e){const s=[];for(const o of t){const i=e.get(o);if(!i)continue;const n=w(v(i["dct:title"])||v(i["skos:prefLabel"])),r=w(v(i["dct:description"])||v(i["rdfs:comment"]))||n;r&&s.push({id:o,title:n,text:r})}return s}function we(t,e){var r;let s=null;const o=t["foaf:page"];if(typeof o=="string"&&o.startsWith("http")?s=o:(r=o==null?void 0:o["@id"])!=null&&r.startsWith("http")&&(s=o["@id"]),!s)for(const d of y(t["cpsv:hasWebSiteChannel"])){const u=e.get(d),p=u==null?void 0:u["foaf:page"];if(typeof p=="string"&&p.startsWith("http")){s=p;break}}!s&&typeof t["@id"]=="string"&&t["@id"].startsWith("http")&&(s=t["@id"].split("#")[0]);const i=[],n=new Set,a=d=>{if(!d||!d.startsWith("http"))return;const u=d.split("#")[0];s&&u.replace(/\/$/,"")===s.replace(/\/$/,"")||n.has(u)||(n.add(u),i.push(d))};for(const d of["cpsv:hasOtherElectronicChannel","cpsv:hasChannel"])for(const u of y(t[d])){const p=e.get(u);if(!p){u.startsWith("http")&&!u.includes("#")&&a(u);continue}const h=p["foaf:page"];typeof h=="string"?a(h):h!=null&&h["@id"]&&a(h["@id"])}return{sheetUrl:s,applicationUrls:i}}function $e(t,e){const s=t["@graph"]||[],o=new Map;for(const l of s)l&&l["@id"]&&o.set(String(l["@id"]),l);const i=new Map;for(const l of s)l&&(O(l,"PublicOrganisation")||O(l,"cv:PublicOrganisation"))&&i.set(l["@id"],{id:l["@id"],title:v(l["dct:title"])||l["@id"],homepage:typeof l["foaf:homepage"]=="string"?l["foaf:homepage"]:null});const n=[];for(const l of s){if(!l||!O(l,"PublicService"))continue;const z=y(l["cv:hasCompetentAuthority"]||l["cpsv:producedBy"])[0]||null,C=z?i.get(z):null,W=y(l["cpsv:isPartOfEvent"]),_=y(l["cpsv:hasTheme"]),oe=y(l["cpsv:hasInput"]),Z=P(oe,o),le=y(l["cpsv:hasProcessingTime"]),H=P(le,o),G=v(l["aci:processingTime"]);G&&H.push({id:`${l["@id"]}#aci-time`,text:G});const ne=y(l["cpsv:hasOutput"]),J=P(ne,o),K=y(l["cv:addressee"]),x=P(K,o);if(!x.length)for(const m of K){const E=o.get(m),Y=v(E==null?void 0:E["dct:title"])||v(E==null?void 0:E["skos:prefLabel"]);Y?x.push({id:m,text:Y}):m.includes("#addressee-")&&x.push({id:m,text:decodeURIComponent(m.split("#addressee-").pop())})}const Q=w(v(l["aci:costDescription"])||v(l["cpsv:hasCost"])),{sheetUrl:S,applicationUrls:j}=we(l,o),re=[S,...j].filter(Boolean),ae=w(v(l["dct:title"])||v(l["cpsv:name"]))||"Servizio",X=w(v(l["dct:description"])),ce=w(v(l["dct:abstract"]))||X;n.push({id:l["@id"],title:ae,description:X,abstract:ce,orgId:z,orgTitle:(C==null?void 0:C.title)||null,lifeEventIds:W,themeIds:_,lifeEventLabels:W.map(m=>e.lifeEvents[m]||m.split("/").pop()),themeLabels:_.map(m=>e.themes[m]||`Tema ${m.split("/").pop()}`),addressees:x,inputs:Z,outputs:J,processingTimes:H,cost:Q,sheetUrl:S,applicationUrls:j,onlineUrls:re,hasOnlineChannel:j.length>0,pageUrl:S||l["@id"],flags:{hasInput:Z.length>0,hasOutput:J.length>0,hasTime:H.length>0,hasCost:!!Q,hasOnline:j.length>0,hasSheet:!!S}})}n.sort((l,f)=>l.title.localeCompare(f.title,"it"));const a=[...i.values()].sort((l,f)=>l.title.localeCompare(f.title,"it")),r=new Map,d=new Map;for(const l of n){for(const f of l.lifeEventIds)r.set(f,(r.get(f)||0)+1);for(const f of l.themeIds)d.set(f,(d.get(f)||0)+1)}const u=[...r.entries()].map(([l,f])=>({id:l,label:e.lifeEvents[l]||l.split("/").pop(),count:f})).sort((l,f)=>l.label.localeCompare(f.label,"it")),p=[...d.entries()].map(([l,f])=>({id:l,label:e.themes[l]||`Tema ${l.split("/").pop()}`,count:f})).sort((l,f)=>l.label.localeCompare(f.label,"it")),h=V(t["cpsv-portalone:sourceCatalogs"]).map(l=>({id:l==null?void 0:l["@id"],title:v(l==null?void 0:l["dct:title"])||(l==null?void 0:l["@id"])}));return{services:n,orgsById:i,nodesById:o,facets:{orgs:a,lifeEvents:u,themes:p},meta:{title:"Catalogo dei servizi della PA",modified:t["dct:modified"]||null,sources:h,count:n.length}}}function Ee(t,e){const s=(e.q||"").trim().toLocaleLowerCase("it");return t.filter(o=>!(e.org&&o.orgId!==e.org||e.lifeEvent&&!o.lifeEventIds.includes(e.lifeEvent)||e.theme&&!o.themeIds.includes(e.theme)||e.onlineOnly&&!o.flags.hasOnline||s&&!`${o.title} ${o.abstract||""} ${o.orgTitle||""}`.toLocaleLowerCase("it").includes(s)))}const N=24,M="Catalogo dei servizi della PA",Ie="Trova e consulta i servizi digitali della Pubblica Amministrazione";function L({catalogUrl:t,meta:e,error:s,detail:o=null}){const i=c(F({catalog:ie(t),path:"/"})),n=e?`${e.count} serviz${e.count===1?"io":"i"} disponibili`:"Caricamento…";return`
<a class="visually-hidden-focusable" href="#main">Vai al contenuto</a>
<header class="it-header-wrapper it-header-sticky">
  <div class="it-nav-wrapper">
    <div class="it-header-center-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="it-header-center-content-wrapper">
              <div class="it-brand-wrapper">
                <a href="${i}" aria-label="${c(M)} — torna all’elenco">
                  <div class="it-brand-text">
                    <div class="it-brand-title">${c(M)}</div>
                    <div class="it-brand-tagline d-none d-md-block">${c(Ie)}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  ${o?ze(o,{homeHref:i}):""}
</header>

<main id="main" class="container my-4 mb-5">
  ${s?`<div class="alert alert-danger" role="alert">
          <h2 class="alert-heading h5">Non è stato possibile caricare il catalogo</h2>
          <p class="mb-0">${c(s)}</p>
        </div>`:""}
  ${o?"":`<p class="text-secondary mb-4">${c(n)}</p>`}
  <div id="view-root"></div>
</main>

<footer class="it-footer">
  <div class="it-footer-main">
    <div class="container py-4">
      <h2 class="h5 mb-2">${c(M)}</h2>
      <p class="mb-0">
        Le informazioni mostrate derivano dalle schede pubbliche degli enti erogatori.
        Se un dettaglio (tempi, costi, documenti) non compare, non è disponibile nella fonte.
      </p>
    </div>
  </div>
</footer>
`}function ze(t,{homeHref:e}){var n;const s=t.sheetUrl||t.pageUrl,o=s?`<a
        class="btn btn-light btn-lg service-sheet-cta"
        href="${c(s)}"
        rel="noopener noreferrer"
        target="_blank"
      >
        Vai alla scheda dell’Ente
        ${Ce()}
        <span class="visually-hidden">(si apre in un altro sito)</span>
      </a>`:'<p class="small mb-0 service-header-muted">Scheda ufficiale non indicata nel catalogo.</p>',i=((n=t.lifeEventLabels)==null?void 0:n.length)>0?`<div class="service-header-pills mt-3" role="list" aria-label="Momenti della vita">
          ${t.lifeEventLabels.map(a=>`<span class="service-header-pill" role="listitem">${c(a)}</span>`).join("")}
        </div>`:"";return`
<div class="service-header">
  <div class="container py-4">
    <nav class="breadcrumb-container mb-3" aria-label="Sei qui">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="${e}">Catalogo</a><span class="separator" aria-hidden="true">/</span></li>
        <li class="breadcrumb-item active" aria-current="page">${c(B(t.title,64))}</li>
      </ol>
    </nav>
    <div class="row align-items-start g-3">
      <div class="col-lg-8">
        <p class="service-header-org mb-1">${c(t.orgTitle||"Ente erogatore")}</p>
        <h1 class="service-header-title mb-0">${c(t.title)}</h1>
        ${i}
      </div>
      <div class="col-lg-4 d-flex justify-content-lg-end align-items-start">
        ${o}
      </div>
    </div>
  </div>
</div>`}function Ce(){return`<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M21 3v6h-1V4.7l-7.6 7.7-.8-.8L19.3 4H15V3h6zm-4 16.5c0 .3-.2.5-.5.5h-12c-.3 0-.5-.2-.5-.5v-12c0-.3.2-.5.5-.5H12V6H4.5C3.7 6 3 6.7 3 7.5v12c0 .8.7 1.5 1.5 1.5h12c.8 0 1.5-.7 1.5-1.5V12h-1v7.5z"/>
  </svg>`}function ie(t){return!t||t==="./cpsv_full.jsonld"?null:t}function Ae(t){if(!t)return"Ente";const e=String(t).match(/\b(ACI|INPS|AdE|INAIL|ANPR|MIT|Agenzia delle Entrate|Motorizzazione)\b/i);if(!e)return B(t,36);const s=e[1];return/agenzia delle entrate/i.test(t)?"Agenzia delle Entrate":/motorizzazione/i.test(t)?"Motorizzazione":/anpr/i.test(t)?"ANPR":(s.toUpperCase()===s||s.length<=5,s)}function q({id:t,name:e,label:s,optionsHtml:o,value:i}){return`
<div class="mb-3">
  <label class="form-label" for="${c(t)}">${c(s)}</label>
  <select class="form-select" id="${c(t)}" name="${c(e)}">
    ${o}
  </select>
</div>`}function Le({index:t,filterState:e}){const{facets:s}=t,o=['<option value="">Tutti gli enti</option>',...s.orgs.map(a=>`<option value="${c(a.id)}" ${e.org===a.id?"selected":""}>${c(a.title)}</option>`)].join(""),i=['<option value="">Tutte le fasi</option>',...s.lifeEvents.map(a=>`<option value="${c(a.id)}" ${e.lifeEvent===a.id?"selected":""}>${c(a.label)}</option>`)].join(""),n=['<option value="">Tutti i temi</option>',...s.themes.map(a=>`<option value="${c(a.id)}" ${e.theme===a.id?"selected":""}>${c(a.label)}</option>`)].join("");return`
<div class="row">
  <aside class="col-lg-4 col-xl-3 mb-4" aria-labelledby="filters-title">
    <div class="border rounded p-3 bg-white shadow-sm">
      <h2 class="h5" id="filters-title">Filtra i servizi</h2>
      <form id="filters-form" class="mt-3">
        <div class="mb-3">
          <label class="form-label" for="filter-q">Cerca</label>
          <input
            type="search"
            class="form-control"
            id="filter-q"
            name="q"
            value="${c(e.q||"")}"
            placeholder="Es. bollo, pensione, residenza"
            autocomplete="off"
          />
        </div>
        ${q({id:"filter-org",name:"org",label:"Ente erogatore",optionsHtml:o,value:e.org})}
        ${q({id:"filter-le",name:"lifeEvent",label:"Momento della vita",optionsHtml:i,value:e.lifeEvent})}
        ${q({id:"filter-theme",name:"theme",label:"Argomento",optionsHtml:n,value:e.theme})}
        <button type="button" class="btn btn-outline-primary btn-sm" id="filters-reset">
          Azzera filtri
        </button>
      </form>
    </div>
  </aside>

  <section class="col-lg-8 col-xl-9" aria-live="polite">
    <p class="mb-3 fw-semibold" id="results-count"></p>
    <div class="row g-4" id="results-grid"></div>
    <nav class="mt-4" aria-label="Paginazione dei risultati" id="pager"></nav>
  </section>
</div>
`}function Te(t,{catalogUrl:e,page:s,filterState:o={}}){const i=ie(e),n=(s-1)*N,a=t.slice(n,n+N);return a.length?a.map(r=>{const d=F({catalog:i,path:`/servizio/${encodeURIComponent(r.id)}`}),u=Ae(r.orgTitle),p=r.lifeEventIds[0]||"",h=r.lifeEventLabels[0]?B(r.lifeEventLabels[0],40):null,l=o.org&&o.org===r.orgId,f=o.lifeEvent&&o.lifeEvent===p,z=r.orgId?`<button
            type="button"
            class="chip chip-simple ${l?"chip-filter-active":""}"
            data-filter-org="${c(r.orgId)}"
            aria-pressed="${l?"true":"false"}"
            title="Filtra per ${c(u)}"
          ><span class="chip-label">${c(u)}</span></button>`:"",C=p?`<button
            type="button"
            class="chip chip-simple ${f?"chip-filter-active":""}"
            data-filter-life-event="${c(p)}"
            aria-pressed="${f?"true":"false"}"
            title="Filtra per questo momento della vita"
          ><span class="chip-label">${c(h)}</span></button>`:"";return`
<div class="col-md-6">
  <div class="card-wrapper card-space h-100">
    <div class="card card-bg no-after h-100 border">
      <div class="card-body d-flex flex-column">
        <div class="chip-list mb-3" role="group" aria-label="Filtri rapidi">
          ${z}
          ${C}
        </div>
        <h3 class="card-title h5">
          <a href="${c(d)}">${c(r.title)}</a>
        </h3>
        <p class="card-text mb-4">
          ${c(B(r.abstract||"Descrizione non disponibile per questo servizio.",180))}
        </p>
        <div class="mt-auto">
          <a class="btn btn-outline-primary btn-sm" href="${c(d)}">
            Vai alla scheda
          </a>
        </div>
      </div>
    </div>
  </div>
</div>`}).join(""):`
<div class="col-12">
  <div class="alert alert-info" role="status">
    Nessun servizio corrisponde ai filtri scelti. Prova ad allargare la ricerca.
  </div>
</div>`}function xe(t,e){const s=Math.max(1,Math.ceil(t/N));if(s<=1)return"";const o=[];for(let i=1;i<=s;i++)o.push(`<li class="page-item ${i===e?"active":""}">
        <a class="page-link" href="#" data-page="${i}" ${i===e?'aria-current="page"':""}>${i}</a>
      </li>`);return`<ul class="pagination justify-content-center">${o.join("")}</ul>`}function Se(t){const e=[];return t.addressees.length&&e.push(A("A chi è rivolto",U(t.addressees))),t.inputs.length&&e.push(A("Cosa serve",U(t.inputs))),t.processingTimes.length&&e.push(A("Tempi",U(t.processingTimes))),t.cost&&e.push(A("Costi",k(t.cost))),t.outputs.length&&e.push(A("Cosa si ottiene",U(t.outputs))),`
${t.description?`<div class="font-serif service-description">${k(t.description)}</div>`:'<p class="text-secondary">Descrizione non disponibile per questo servizio.</p>'}
<div class="mt-4">
  ${e.join("")||'<p class="text-secondary">Non ci sono altri dettagli disponibili nella scheda pubblica.</p>'}
</div>
`}function A(t,e){return`
<section class="mb-4 pb-3 border-bottom">
  <h2 class="h4">${c(t)}</h2>
  ${e}
</section>`}function U(t){return t.map(e=>`<div class="mb-3 service-block-text">${k(e.text)}</div>`).join("")}const je={lifeEvents:de,themes:ue},T=document.getElementById("app");let b=null,g={q:"",org:"",lifeEvent:"",theme:"",onlineOnly:!1},$=1,R=0;function Pe(t){return!t||t===ee?null:t}async function Ue(t){const e=te(t);if(b&&b.docUrl===e)return b;const s=++R;T.innerHTML=L({catalogUrl:e,meta:null,error:null});const o=document.getElementById("view-root");o&&(o.innerHTML='<p class="text-muted" role="status">Caricamento catalogo…</p>');try{const{doc:i,url:n}=await ye(e);return s!==R||(b={docUrl:n,index:$e(i,je)}),b}catch(i){if(s!==R)return null;b=null,T.innerHTML=L({catalogUrl:e,meta:null,error:i.message||String(i)});const n=document.getElementById("view-root");return n&&(n.innerHTML=`
        <div class="alert alert-warning" role="alert">
          <h2 class="h5">Catalogo non disponibile</h2>
          <p>Riprova tra poco oppure torna all’elenco principale.</p>
          <p class="mb-0"><a class="btn btn-primary btn-sm" href="#/">Torna al catalogo</a></p>
        </div>`),null}}function D(){const t=document.getElementById("filter-q"),e=document.getElementById("filter-org"),s=document.getElementById("filter-le"),o=document.getElementById("filter-theme"),i=document.getElementById("filter-online");t&&(t.value=g.q||""),e&&(e.value=g.org||""),s&&(s.value=g.lifeEvent||""),o&&(o.value=g.theme||""),i&&(i.checked=!1)}function Be(){var o,i;const t=document.getElementById("filters-form");if(!t)return;const e=()=>{var n,a,r,d;g={q:((n=document.getElementById("filter-q"))==null?void 0:n.value)||"",org:((a=document.getElementById("filter-org"))==null?void 0:a.value)||"",lifeEvent:((r=document.getElementById("filter-le"))==null?void 0:r.value)||"",theme:((d=document.getElementById("filter-theme"))==null?void 0:d.value)||"",onlineOnly:!1},$=1,I()};t.addEventListener("change",e),t.addEventListener("submit",n=>{n.preventDefault(),e()});let s;(o=document.getElementById("filter-q"))==null||o.addEventListener("input",()=>{clearTimeout(s),s=setTimeout(e,200)}),(i=document.getElementById("filters-reset"))==null||i.addEventListener("click",()=>{g={q:"",org:"",lifeEvent:"",theme:"",onlineOnly:!1},$=1,D(),I()})}function He(t){t&&(t.querySelectorAll("[data-filter-org]").forEach(e=>{e.addEventListener("click",s=>{var i;s.preventDefault(),s.stopPropagation();const o=e.getAttribute("data-filter-org")||"";g.org=g.org===o?"":o,$=1,D(),I(),(i=document.getElementById("results-count"))==null||i.scrollIntoView({behavior:"smooth",block:"start"})})}),t.querySelectorAll("[data-filter-life-event]").forEach(e=>{e.addEventListener("click",s=>{var i;s.preventDefault(),s.stopPropagation();const o=e.getAttribute("data-filter-life-event")||"";g.lifeEvent=g.lifeEvent===o?"":o,$=1,D(),I(),(i=document.getElementById("results-count"))==null||i.scrollIntoView({behavior:"smooth",block:"start"})})}))}function I(){if(!b)return;const t=Ee(b.index.services,g),e=document.getElementById("results-count"),s=document.getElementById("results-grid"),o=document.getElementById("pager");e&&(e.textContent=t.length===1?"1 servizio trovato":`${t.length} servizi trovati`),s&&(s.innerHTML=Te(t,{catalogUrl:b.docUrl,page:$,filterState:g}),He(s)),o&&(o.innerHTML=xe(t.length,$),o.querySelectorAll("[data-page]").forEach(i=>{i.addEventListener("click",n=>{n.preventDefault(),$=Number(i.getAttribute("data-page"))||1,I(),e==null||e.scrollIntoView({behavior:"smooth",block:"start"})})}))}async function se(){const t=be(),e=await Ue(t.catalog);if(!e)return;if(t.view==="detail"){const o=e.index.services.find(n=>n.id===t.serviceId);if(!o){T.innerHTML=L({catalogUrl:e.docUrl,meta:e.index.meta,error:null});const n=document.getElementById("view-root");n&&(n.innerHTML=`
          <div class="alert alert-warning" role="alert">
            Servizio non trovato in questo catalogo.
            <a href="${F({catalog:Pe(e.docUrl),path:"/"})}">Torna all’elenco</a>
          </div>`);return}T.innerHTML=L({catalogUrl:e.docUrl,meta:e.index.meta,error:null,detail:o});const i=document.getElementById("view-root");i&&(i.innerHTML=Se(o)),window.scrollTo(0,0);return}T.innerHTML=L({catalogUrl:e.docUrl,meta:e.index.meta,error:null});const s=document.getElementById("view-root");s&&(s.innerHTML=Le({index:e.index,filterState:g,catalogUrl:e.docUrl}),Be(),I())}window.addEventListener("hashchange",()=>{se()});se();
