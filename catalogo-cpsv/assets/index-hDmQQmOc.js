(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const a of l.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function i(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(o){if(o.ep)return;o.ep=!0;const l=i(o);fetch(o.href,l)}})();const ve={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/1":"Iscrizione scuola/università e/o richiesta borsa di studio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/2":"Invalidità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/3":"Ricerca di lavoro, avvio nuovo lavoro, disoccupazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/4":"Pensionamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/5":"Richiesta o rinnovo patente","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/6":"Registrazione/possesso veicolo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/7":"Accesso al trasporto pubblico","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/8":"Compravendita/affitto casa/edifici/terreni, costruzione o ristrutturazione casa/edificio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/9":"Cambio di residenza/domicilio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/10":"Espatrio per lavoro, studio, pensionamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/11":"Richiesta passaporto, visto e assistenza viaggi internazionali","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/12":"Nascita di un bambino, richiesta adozioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/13":"Matrimonio e/o cambio stato civile","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/14":"Morte ed eredità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/15":"Prenotazione e disdetta visite/esami","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/16":"Denuncia crimini","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/17":"Dichiarazione dei redditi, versamento e riscossione tributi/imposte e contributi","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/18":"Accesso luoghi della cultura","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/19":"Possesso, cura, smarrimento animale da compagnia"},ge={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/1":"Istruzione e formazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/2":"Salute","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/3":"Lavoro e occupazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/4":"Previdenza e assistenza","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/5":"Mobilità e trasporti","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/6":"Veicoli e motorizzazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/7":"Trasporto pubblico","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/8":"Casa e territorio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/9":"Anagrafe e residenza","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/10":"Estero e mobilità internazionale","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/11":"Documenti di viaggio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/12":"Famiglia e nascite","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/13":"Stato civile","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/14":"Successioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/15":"Sanità e prestazioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/16":"Sicurezza e denunce","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/17":"Fisco e tributi","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/18":"Cultura e turismo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/19":"Animali","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/20":"Altro"};function g(e){if(e==null)return null;if(typeof e=="string")return e.trim()||null;if(Array.isArray(e)){for(const t of e){const i=g(t);if(i)return i}return null}if(typeof e=="object"){if(typeof e["@value"]=="string")return e["@value"].trim()||null;if(typeof e.value=="string")return e.value.trim()||null}return null}function _(e){return e==null?[]:Array.isArray(e)?e:[e]}function he(e){return e==null?null:typeof e=="string"?e:typeof e=="object"&&e["@id"]?String(e["@id"]):null}function M(e,t){const i=e==null?void 0:e["@type"];return _(i).map(String).some(o=>o===t||o.endsWith(t)||o.includes(t))}function O(e,t=180){if(!e)return"";const i=e.replace(/\s+/g," ").trim();return i.length<=t?i:`${i.slice(0,t-1).trim()}…`}function c(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const me=/\s*(?:leggi\s+(?:di\s+pi[uù]|meno)|mostra\s+(?:di\s+pi[uù]|meno)|read\s+more|show\s+more|nascondi)\s*/gi,be=/((?:[A-ZÀÈÉÌÒÙ][A-ZÀÈÉÌÒÙ0-9'’\-\/]{1,}(?:\s+|,\s*))+[A-ZÀÈÉÌÒÙ][A-ZÀÈÉÌÒÙ0-9'’\-\/]{1,})/g;function E(e){if(!e)return null;let t=String(e);return t=t.replace(/<script[\s\S]*?<\/script>/gi," "),t=t.replace(/<style[\s\S]*?<\/style>/gi," "),t=t.replace(/<[^>]+>/g," "),t=t.replace(/&nbsp;/gi," "),t=t.replace(/&amp;/gi,"&"),t=t.replace(me," "),t=t.replace(/\r\n/g,`
`),t=t.split(/\n{2,}/).map(i=>i.replace(/[^\S\n]+/g," ").replace(/\n/g," ").trim()).filter(Boolean).join(`

`),t||null}function ye(e){const t=E(e);if(!t)return[];if(t.includes(`

`)){const r=[];for(const u of t.split(`

`)){const d=u.trim();if(d)if(we(d))r.push({heading:d.replace(/\s+/g," ").trim(),text:""});else{const p=r[r.length-1];p&&p.heading&&!p.text?p.text=d:r.push({heading:null,text:d})}}return r.filter(u=>u.heading||u.text)}const i=[...t.matchAll(be)];if(!i.length)return[{heading:null,text:t}];const s=i.map(r=>({index:r.index,title:r[1].replace(/\s+/g," ").trim()})).filter(r=>r.title.length>=10&&r.title.split(/\s+/).length>=2);if(!s.length)return[{heading:null,text:t}];const o=[];for(const r of s){const u=o[o.length-1];u&&r.index<u.index+u.title.length||o.push(r)}const l=[],a=o[0];if(a.index>0){const r=t.slice(0,a.index).trim();r&&l.push({heading:null,text:r})}for(let r=0;r<o.length;r++){const u=o[r].index+o[r].title.length,d=r+1<o.length?o[r+1].index:t.length,p=t.slice(u,d).trim();l.push({heading:o[r].title,text:p})}return l.filter(r=>r.heading||r.text)}function k(e){const t=ye(e);return t.length?t.map(i=>{const s=[];return i.heading&&s.push(`<h3 class="h5 mt-3 mb-2">${c(Ee(i.heading))}</h3>`),i.text&&s.push(`<p class="mb-2">${c(i.text)}</p>`),s.join("")}).join(""):""}function we(e){const t=e.replace(/\s+/g," ").trim();return t.length<5||t.length>80||!/[A-ZÀÈÉÌÒÙ]/.test(t)||t!==t.toLocaleUpperCase("it")||t.split(/\s+/).length>8?!1:/^[A-ZÀÈÉÌÒÙ0-9][A-ZÀÈÉÌÒÙ0-9'’\-\/\s,;:]+$/.test(t)}function Ee(e){return e.toLocaleLowerCase("it").replace(/(^|[\s,/])(\S)/g,(i,s,o)=>s+o.toLocaleUpperCase("it"))}const ne="./cpsv_full.jsonld";function D(e=window.location.hash){const t=(e||"").replace(/^#/,"");let i=null,s="/";if(t.startsWith("catalog=")){const p=t.indexOf("&"),m=p===-1?t.slice(8):t.slice(8,p);i=decodeURIComponent(m),s=p===-1?"/":t.slice(p+1)||"/"}else t&&(s=t.startsWith("/")?t:`/${t}`);const{path:o,query:l}=ze(s),a=o.startsWith("/")?o:`/${o}`;let r="list",u=null;const d=a.match(/^\/servizio\/(.+)$/);return d&&(r="detail",u=decodeURIComponent(d[1])),{catalog:i,path:a,view:r,serviceId:u,filters:Ce(l)}}function I({catalog:e,path:t="/",filters:i}={}){const s=t.startsWith("/")?t:`/${t}`,o=Le(i);return e?`#catalog=${encodeURIComponent(e)}&${s}${o}`:`#${s}${o}`}function $e(e,{replace:t=!1}={}){const i=I(e);Ie(D(window.location.hash||"#"),D(i))||(t?history.replaceState(null,"",i):history.pushState(null,"",i))}function Ie(e,t){return e.catalog===t.catalog&&e.path===t.path&&e.view===t.view&&e.serviceId===t.serviceId&&e.filters.q===t.filters.q&&e.filters.org===t.filters.org&&e.filters.lifeEvent===t.filters.lifeEvent&&e.filters.theme===t.filters.theme&&e.filters.page===t.filters.page}function ze(e){const t=e.indexOf("?");return t===-1?{path:e||"/",query:""}:{path:e.slice(0,t)||"/",query:e.slice(t+1)}}function Ce(e){const t=new URLSearchParams(e||""),i=Number(t.get("p")||"1"),s=Number.isFinite(i)&&i>1?Math.floor(i):1;return{q:t.get("q")||"",org:t.get("ente")||"",lifeEvent:t.get("evento")||"",theme:t.get("tema")||"",page:s}}function Le(e){if(!e)return"";const t=new URLSearchParams;e.q&&t.set("q",String(e.q)),e.org&&t.set("ente",String(e.org)),e.lifeEvent&&t.set("evento",String(e.lifeEvent)),e.theme&&t.set("tema",String(e.theme));const i=Number(e.page||1);Number.isFinite(i)&&i>1&&t.set("p",String(Math.floor(i)));const s=t.toString();return s?`?${s}`:""}function le(e){return!e||!String(e).trim()?ne:String(e).trim()}async function Ae(e){const t=le(e);let i;try{i=await fetch(t,{credentials:"same-origin"})}catch(o){const l=new Error(`Impossibile scaricare il catalogo (${t}). Verifica URL, CORS o rete.`);throw l.cause=o,l.code="NETWORK",l}if(!i.ok){const o=new Error(`Catalogo non disponibile (HTTP ${i.status}): ${t}`);throw o.code="HTTP",o}let s;try{s=await i.json()}catch(o){const l=new Error(`Il file non è un JSON valido: ${t}`);throw l.cause=o,l.code="JSON",l}if(!s||typeof s!="object"||!Array.isArray(s["@graph"])){const o=new Error("JSON-LD senza @graph: file non utilizzabile come catalogo CPSV.");throw o.code="SHAPE",o}return{doc:s,url:t}}function y(e){return _(e).map(he).filter(Boolean)}function j(e,t){const i=[];for(const s of e){const o=t.get(s);if(!o)continue;const l=E(g(o["dct:title"])||g(o["skos:prefLabel"])),r=E(g(o["dct:description"])||g(o["rdfs:comment"]))||l;r&&i.push({id:s,title:l,text:r})}return i}function xe(e,t){var r;let i=null;const s=e["foaf:page"];if(typeof s=="string"&&s.startsWith("http")?i=s:(r=s==null?void 0:s["@id"])!=null&&r.startsWith("http")&&(i=s["@id"]),!i)for(const u of y(e["cpsv:hasWebSiteChannel"])){const d=t.get(u),p=d==null?void 0:d["foaf:page"];if(typeof p=="string"&&p.startsWith("http")){i=p;break}}!i&&typeof e["@id"]=="string"&&e["@id"].startsWith("http")&&(i=e["@id"].split("#")[0]);const o=[],l=new Set,a=u=>{if(!u||!u.startsWith("http"))return;const d=u.split("#")[0];i&&d.replace(/\/$/,"")===i.replace(/\/$/,"")||l.has(d)||(l.add(d),o.push(u))};for(const u of["cpsv:hasOtherElectronicChannel","cpsv:hasChannel"])for(const d of y(e[u])){const p=t.get(d);if(!p){d.startsWith("http")&&!d.includes("#")&&a(d);continue}const m=p["foaf:page"];typeof m=="string"?a(m):m!=null&&m["@id"]&&a(m["@id"])}return{sheetUrl:i,applicationUrls:o}}function Te(e,t){const i=e["@graph"]||[],s=new Map;for(const n of i)n&&n["@id"]&&s.set(String(n["@id"]),n);const o=new Map;for(const n of i)n&&(M(n,"PublicOrganisation")||M(n,"cv:PublicOrganisation"))&&o.set(n["@id"],{id:n["@id"],title:g(n["dct:title"])||n["@id"],homepage:typeof n["foaf:homepage"]=="string"?n["foaf:homepage"]:null});const l=[];for(const n of i){if(!n||!M(n,"PublicService"))continue;const z=y(n["cv:hasCompetentAuthority"]||n["cpsv:producedBy"])[0]||null,C=z?o.get(z):null,K=y(n["cpsv:isPartOfEvent"]),X=y(n["cpsv:hasTheme"]),ae=y(n["cpsv:hasInput"]),Y=j(ae,s),ce=y(n["cpsv:hasProcessingTime"]),H=j(ce,s),Q=g(n["aci:processingTime"]);Q&&H.push({id:`${n["@id"]}#aci-time`,text:Q});const ue=y(n["cpsv:hasOutput"]),ee=j(ue,s),te=y(n["cv:addressee"]),S=j(te,s);if(!S.length)for(const b of te){const $=s.get(b),oe=g($==null?void 0:$["dct:title"])||g($==null?void 0:$["skos:prefLabel"]);oe?S.push({id:b,text:oe}):b.includes("#addressee-")&&S.push({id:b,text:decodeURIComponent(b.split("#addressee-").pop())})}const ie=E(g(n["aci:costDescription"])||g(n["cpsv:hasCost"])),{sheetUrl:U,applicationUrls:q}=xe(n,s),de=[U,...q].filter(Boolean),pe=E(g(n["dct:title"])||g(n["cpsv:name"]))||"Servizio",se=E(g(n["dct:description"])),fe=E(g(n["dct:abstract"]))||se;l.push({id:n["@id"],title:pe,description:se,abstract:fe,orgId:z,orgTitle:(C==null?void 0:C.title)||null,lifeEventIds:K,themeIds:X,lifeEventLabels:K.map(b=>t.lifeEvents[b]||b.split("/").pop()),themeLabels:X.map(b=>t.themes[b]||`Tema ${b.split("/").pop()}`),addressees:S,inputs:Y,outputs:ee,processingTimes:H,cost:ie,sheetUrl:U,applicationUrls:q,onlineUrls:de,hasOnlineChannel:q.length>0,pageUrl:U||n["@id"],flags:{hasInput:Y.length>0,hasOutput:ee.length>0,hasTime:H.length>0,hasCost:!!ie,hasOnline:q.length>0,hasSheet:!!U}})}l.sort((n,f)=>n.title.localeCompare(f.title,"it"));const a=[...o.values()].sort((n,f)=>n.title.localeCompare(f.title,"it")),r=new Map,u=new Map;for(const n of l){for(const f of n.lifeEventIds)r.set(f,(r.get(f)||0)+1);for(const f of n.themeIds)u.set(f,(u.get(f)||0)+1)}const d=[...r.entries()].map(([n,f])=>({id:n,label:t.lifeEvents[n]||n.split("/").pop(),count:f})).sort((n,f)=>n.label.localeCompare(f.label,"it")),p=[...u.entries()].map(([n,f])=>({id:n,label:t.themes[n]||`Tema ${n.split("/").pop()}`,count:f})).sort((n,f)=>n.label.localeCompare(f.label,"it")),m=_(e["cpsv-portalone:sourceCatalogs"]).map(n=>({id:n==null?void 0:n["@id"],title:g(n==null?void 0:n["dct:title"])||(n==null?void 0:n["@id"])}));return{services:l,orgsById:o,nodesById:s,facets:{orgs:a,lifeEvents:d,themes:p},meta:{title:"Catalogo dei servizi della PA",modified:e["dct:modified"]||null,sources:m,count:l.length}}}function Se(e,t){const i=(t.q||"").trim().toLocaleLowerCase("it");return e.filter(s=>!(t.org&&s.orgId!==t.org||t.lifeEvent&&!s.lifeEventIds.includes(t.lifeEvent)||t.theme&&!s.themeIds.includes(t.theme)||t.onlineOnly&&!s.flags.hasOnline||i&&!`${s.title} ${s.abstract||""} ${s.orgTitle||""}`.toLocaleLowerCase("it").includes(i)))}const V=24,R="Catalogo dei servizi della PA",Ue="Trova e consulta i servizi digitali della Pubblica Amministrazione";function A({catalogUrl:e,meta:t,error:i,detail:s=null,filters:o=null}){const l=c(I({catalog:Z(e),path:"/",filters:o})),a=t?`${t.count} serviz${t.count===1?"io":"i"} disponibili`:"Caricamento…";return`
<a class="visually-hidden-focusable" href="#main">Vai al contenuto</a>
<header class="it-header-wrapper it-header-sticky">
  <div class="it-nav-wrapper">
    <div class="it-header-center-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="it-header-center-content-wrapper">
              <div class="it-brand-wrapper">
                <a href="${l}" aria-label="${c(R)} — torna all’elenco">
                  <div class="it-brand-text">
                    <div class="it-brand-title">${c(R)}</div>
                    <div class="it-brand-tagline d-none d-md-block">${c(Ue)}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  ${s?qe(s,{homeHref:l}):""}
</header>

<main id="main" class="container my-4 mb-5">
  ${i?`<div class="alert alert-danger" role="alert">
          <h2 class="alert-heading h5">Non è stato possibile caricare il catalogo</h2>
          <p class="mb-0">${c(i)}</p>
        </div>`:""}
  ${s?"":`<p class="text-secondary mb-4">${c(a)}</p>`}
  <div id="view-root"></div>
</main>

<footer class="it-footer">
  <div class="it-footer-main">
    <div class="container py-4">
      <h2 class="h5 mb-2">${c(R)}</h2>
      <p class="mb-0">
        Le informazioni mostrate derivano dalle schede pubbliche degli enti erogatori.
        Se un dettaglio (tempi, costi, documenti) non compare, non è disponibile nella fonte.
      </p>
    </div>
  </div>
</footer>
`}function qe(e,{homeHref:t}){var l;const i=e.sheetUrl||e.pageUrl,s=i?`<a
        class="btn btn-light btn-lg service-sheet-cta"
        href="${c(i)}"
        rel="noopener noreferrer"
        target="_blank"
      >
        Vai alla scheda dell’Ente
        ${je()}
        <span class="visually-hidden">(si apre in un altro sito)</span>
      </a>`:'<p class="small mb-0 service-header-muted">Scheda ufficiale non indicata nel catalogo.</p>',o=((l=e.lifeEventLabels)==null?void 0:l.length)>0?`<div class="service-header-pills mt-3" role="list" aria-label="Momenti della vita">
          ${e.lifeEventLabels.map(a=>`<span class="service-header-pill" role="listitem">${c(a)}</span>`).join("")}
        </div>`:"";return`
<div class="service-header">
  <div class="container py-4">
    <nav class="breadcrumb-container mb-3" aria-label="Sei qui">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="${t}">Catalogo</a><span class="separator" aria-hidden="true">/</span></li>
        <li class="breadcrumb-item active" aria-current="page">${c(O(e.title,64))}</li>
      </ol>
    </nav>
    <div class="row align-items-start g-3">
      <div class="col-lg-8">
        <p class="service-header-org mb-1">${c(e.orgTitle||"Ente erogatore")}</p>
        <h1 class="service-header-title mb-0">${c(e.title)}</h1>
        ${o}
      </div>
      <div class="col-lg-4 d-flex justify-content-lg-end align-items-start">
        ${s}
      </div>
    </div>
  </div>
</div>`}function je(){return`<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M21 3v6h-1V4.7l-7.6 7.7-.8-.8L19.3 4H15V3h6zm-4 16.5c0 .3-.2.5-.5.5h-12c-.3 0-.5-.2-.5-.5v-12c0-.3.2-.5.5-.5H12V6H4.5C3.7 6 3 6.7 3 7.5v12c0 .8.7 1.5 1.5 1.5h12c.8 0 1.5-.7 1.5-1.5V12h-1v7.5z"/>
  </svg>`}function Z(e){return!e||e==="./cpsv_full.jsonld"?null:e}function Pe(e){if(!e)return"Ente";const t=String(e).match(/\b(ACI|INPS|AdE|INAIL|ANPR|MIT|Agenzia delle Entrate|Motorizzazione)\b/i);if(!t)return O(e,36);const i=t[1];return/agenzia delle entrate/i.test(e)?"Agenzia delle Entrate":/motorizzazione/i.test(e)?"Motorizzazione":/anpr/i.test(e)?"ANPR":(i.toUpperCase()===i||i.length<=5,i)}function N({id:e,name:t,label:i,optionsHtml:s,value:o}){return`
<div class="mb-3">
  <label class="form-label" for="${c(e)}">${c(i)}</label>
  <select class="form-select" id="${c(e)}" name="${c(t)}">
    ${s}
  </select>
</div>`}function Oe({index:e,filterState:t}){const{facets:i}=e,s=['<option value="">Tutti gli enti</option>',...i.orgs.map(a=>`<option value="${c(a.id)}" ${t.org===a.id?"selected":""}>${c(a.title)}</option>`)].join(""),o=['<option value="">Tutte le fasi</option>',...i.lifeEvents.map(a=>`<option value="${c(a.id)}" ${t.lifeEvent===a.id?"selected":""}>${c(a.label)}</option>`)].join(""),l=['<option value="">Tutti i temi</option>',...i.themes.map(a=>`<option value="${c(a.id)}" ${t.theme===a.id?"selected":""}>${c(a.label)}</option>`)].join("");return`
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
            value="${c(t.q||"")}"
            placeholder="Es. bollo, pensione, residenza"
            autocomplete="off"
          />
        </div>
        ${N({id:"filter-org",name:"org",label:"Ente erogatore",optionsHtml:s,value:t.org})}
        ${N({id:"filter-le",name:"lifeEvent",label:"Momento della vita",optionsHtml:o,value:t.lifeEvent})}
        ${N({id:"filter-theme",name:"theme",label:"Argomento",optionsHtml:l,value:t.theme})}
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
`}function Be(e,{catalogUrl:t,page:i,filterState:s={}}){const o=Z(t),l=(i-1)*V,a=e.slice(l,l+V);return a.length?a.map(r=>{const u=I({catalog:o,path:`/servizio/${encodeURIComponent(r.id)}`,filters:{...s,page:i}}),d=Pe(r.orgTitle),p=r.lifeEventIds[0]||"",m=r.lifeEventLabels[0]?O(r.lifeEventLabels[0],40):null,n=s.org&&s.org===r.orgId,f=s.lifeEvent&&s.lifeEvent===p,z=r.orgId?`<button
            type="button"
            class="chip chip-simple ${n?"chip-filter-active":""}"
            data-filter-org="${c(r.orgId)}"
            aria-pressed="${n?"true":"false"}"
            title="Filtra per ${c(d)}"
          ><span class="chip-label">${c(d)}</span></button>`:"",C=p?`<button
            type="button"
            class="chip chip-simple ${f?"chip-filter-active":""}"
            data-filter-life-event="${c(p)}"
            aria-pressed="${f?"true":"false"}"
            title="Filtra per questo momento della vita"
          ><span class="chip-label">${c(m)}</span></button>`:"";return`
<div class="col-md-6">
  <div class="card-wrapper card-space h-100">
    <div class="card card-bg no-after h-100 border">
      <div class="card-body d-flex flex-column">
        <div class="chip-list mb-3" role="group" aria-label="Filtri rapidi">
          ${z}
          ${C}
        </div>
        <h3 class="card-title h5">
          <a href="${c(u)}">${c(r.title)}</a>
        </h3>
        <p class="card-text mb-4">
          ${c(O(r.abstract||"Descrizione non disponibile per questo servizio.",180))}
        </p>
        <div class="mt-auto">
          <a class="btn btn-outline-primary btn-sm" href="${c(u)}">
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
</div>`}function He(e,t,{catalogUrl:i,filterState:s={}}={}){const o=Math.max(1,Math.ceil(e/V));if(o<=1)return"";const l=Z(i),a=[];for(let r=1;r<=o;r++){const u=I({catalog:l,path:"/",filters:{...s,page:r}});a.push(`<li class="page-item ${r===t?"active":""}">
        <a class="page-link" href="${c(u)}" data-page="${r}" ${r===t?'aria-current="page"':""}>${r}</a>
      </li>`)}return`<ul class="pagination justify-content-center">${a.join("")}</ul>`}function Me(e){const t=[];return e.addressees.length&&t.push(L("A chi è rivolto",P(e.addressees))),e.inputs.length&&t.push(L("Cosa serve",P(e.inputs))),e.processingTimes.length&&t.push(L("Tempi",P(e.processingTimes))),e.cost&&t.push(L("Costi",k(e.cost))),e.outputs.length&&t.push(L("Cosa si ottiene",P(e.outputs))),`
${e.description?`<div class="font-serif service-description">${k(e.description)}</div>`:'<p class="text-secondary">Descrizione non disponibile per questo servizio.</p>'}
<div class="mt-4">
  ${t.join("")||'<p class="text-secondary">Non ci sono altri dettagli disponibili nella scheda pubblica.</p>'}
</div>
`}function L(e,t){return`
<section class="mb-4 pb-3 border-bottom">
  <h2 class="h4">${c(e)}</h2>
  ${t}
</section>`}function P(e){return e.map(t=>`<div class="mb-3 service-block-text">${k(t.text)}</div>`).join("")}const Re={lifeEvents:ve,themes:ge},x=document.getElementById("app");let h=null,v={q:"",org:"",lifeEvent:"",theme:"",onlineOnly:!1},w=1,F=0;function G(e){return!e||e===ne?null:e}async function Ne(e){const t=le(e);if(h&&h.docUrl===t)return h;const i=++F;x.innerHTML=A({catalogUrl:t,meta:null,error:null});const s=document.getElementById("view-root");s&&(s.innerHTML='<p class="text-muted" role="status">Caricamento catalogo…</p>');try{const{doc:o,url:l}=await Ae(t);return i!==F||(h={docUrl:l,index:Te(o,Re)}),h}catch(o){if(i!==F)return null;h=null,x.innerHTML=A({catalogUrl:t,meta:null,error:o.message||String(o)});const l=document.getElementById("view-root");return l&&(l.innerHTML=`
        <div class="alert alert-warning" role="alert">
          <h2 class="h5">Catalogo non disponibile</h2>
          <p>Riprova tra poco oppure torna all’elenco principale.</p>
          <p class="mb-0"><a class="btn btn-primary btn-sm" href="${I({catalog:G(t),path:"/",filters:J()})}">Torna al catalogo</a></p>
        </div>`),null}}function J(){return{q:v.q,org:v.org,lifeEvent:v.lifeEvent,theme:v.theme,page:w}}function Fe(e){v={q:(e==null?void 0:e.q)||"",org:(e==null?void 0:e.org)||"",lifeEvent:(e==null?void 0:e.lifeEvent)||"",theme:(e==null?void 0:e.theme)||"",onlineOnly:!1},w=(e==null?void 0:e.page)>1?e.page:1}function B({replace:e}){h&&$e({catalog:G(h.docUrl),path:"/",filters:J()},{replace:e})}function W(){const e=document.getElementById("filter-q"),t=document.getElementById("filter-org"),i=document.getElementById("filter-le"),s=document.getElementById("filter-theme"),o=document.getElementById("filter-online");e&&(e.value=v.q||""),t&&(t.value=v.org||""),i&&(i.value=v.lifeEvent||""),s&&(s.value=v.theme||""),o&&(o.checked=!1)}function ke(){var s,o;const e=document.getElementById("filters-form");if(!e)return;const t=({replace:l})=>{var a,r,u,d;v={q:((a=document.getElementById("filter-q"))==null?void 0:a.value)||"",org:((r=document.getElementById("filter-org"))==null?void 0:r.value)||"",lifeEvent:((u=document.getElementById("filter-le"))==null?void 0:u.value)||"",theme:((d=document.getElementById("filter-theme"))==null?void 0:d.value)||"",onlineOnly:!1},w=1,B({replace:l}),T()};e.addEventListener("change",l=>{var a;((a=l.target)==null?void 0:a.id)!=="filter-q"&&t({replace:!1})}),e.addEventListener("submit",l=>{l.preventDefault(),t({replace:!1})});let i;(s=document.getElementById("filter-q"))==null||s.addEventListener("input",()=>{clearTimeout(i),i=setTimeout(()=>t({replace:!0}),200)}),(o=document.getElementById("filters-reset"))==null||o.addEventListener("click",()=>{v={q:"",org:"",lifeEvent:"",theme:"",onlineOnly:!1},w=1,W(),B({replace:!1}),T()})}function De(e){e&&(e.querySelectorAll("[data-filter-org]").forEach(t=>{t.addEventListener("click",i=>{var o;i.preventDefault(),i.stopPropagation();const s=t.getAttribute("data-filter-org")||"";v.org=v.org===s?"":s,w=1,W(),B({replace:!1}),T(),(o=document.getElementById("results-count"))==null||o.scrollIntoView({behavior:"smooth",block:"start"})})}),e.querySelectorAll("[data-filter-life-event]").forEach(t=>{t.addEventListener("click",i=>{var o;i.preventDefault(),i.stopPropagation();const s=t.getAttribute("data-filter-life-event")||"";v.lifeEvent=v.lifeEvent===s?"":s,w=1,W(),B({replace:!1}),T(),(o=document.getElementById("results-count"))==null||o.scrollIntoView({behavior:"smooth",block:"start"})})}))}function T(){if(!h)return;const e=Se(h.index.services,v),t=document.getElementById("results-count"),i=document.getElementById("results-grid"),s=document.getElementById("pager");t&&(t.textContent=e.length===1?"1 servizio trovato":`${e.length} servizi trovati`),i&&(i.innerHTML=Be(e,{catalogUrl:h.docUrl,page:w,filterState:v}),De(i)),s&&(s.innerHTML=He(e.length,w,{catalogUrl:h.docUrl,filterState:v}))}async function re(){const e=D();Fe(e.filters);const t=await Ne(e.catalog);if(!t)return;const i=J();if(e.view==="detail"){const o=t.index.services.find(a=>a.id===e.serviceId);if(!o){x.innerHTML=A({catalogUrl:t.docUrl,meta:t.index.meta,error:null,filters:i});const a=document.getElementById("view-root");a&&(a.innerHTML=`
          <div class="alert alert-warning" role="alert">
            Servizio non trovato in questo catalogo.
            <a href="${I({catalog:G(t.docUrl),path:"/",filters:i})}">Torna all’elenco</a>
          </div>`);return}x.innerHTML=A({catalogUrl:t.docUrl,meta:t.index.meta,error:null,detail:o,filters:i});const l=document.getElementById("view-root");l&&(l.innerHTML=Me(o)),window.scrollTo(0,0);return}x.innerHTML=A({catalogUrl:t.docUrl,meta:t.index.meta,error:null,filters:i});const s=document.getElementById("view-root");s&&(s.innerHTML=Oe({index:t.index,filterState:v,catalogUrl:t.docUrl}),ke(),T())}window.addEventListener("hashchange",()=>{re()});re();
