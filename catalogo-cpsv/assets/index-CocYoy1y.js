(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function i(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=i(n);fetch(n.href,o)}})();const ge={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/1":"Iscrizione scuola/università e/o richiesta borsa di studio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/2":"Invalidità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/3":"Ricerca di lavoro, avvio nuovo lavoro, disoccupazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/4":"Pensionamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/5":"Richiesta o rinnovo patente","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/6":"Registrazione/possesso veicolo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/7":"Accesso al trasporto pubblico","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/8":"Compravendita/affitto casa/edifici/terreni, costruzione o ristrutturazione casa/edificio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/9":"Cambio di residenza/domicilio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/10":"Espatrio per lavoro, studio, pensionamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/11":"Richiesta passaporto, visto e assistenza viaggi internazionali","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/12":"Nascita di un bambino, richiesta adozioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/13":"Matrimonio e/o cambio stato civile","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/14":"Morte ed eredità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/15":"Prenotazione e disdetta visite/esami","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/16":"Denuncia crimini","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/17":"Dichiarazione dei redditi, versamento e riscossione tributi/imposte e contributi","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/18":"Accesso luoghi della cultura","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/19":"Possesso, cura, smarrimento animale da compagnia"},me={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/1":"Istruzione e formazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/2":"Salute","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/3":"Lavoro e occupazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/4":"Previdenza e assistenza","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/5":"Mobilità e trasporti","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/6":"Veicoli e motorizzazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/7":"Trasporto pubblico","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/8":"Casa e territorio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/9":"Anagrafe e residenza","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/10":"Estero e mobilità internazionale","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/11":"Documenti di viaggio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/12":"Famiglia e nascite","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/13":"Stato civile","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/14":"Successioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/15":"Sanità e prestazioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/16":"Sicurezza e denunce","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/17":"Fisco e tributi","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/18":"Cultura e turismo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/19":"Animali","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/20":"Altro"};function h(e){if(e==null)return null;if(typeof e=="string")return e.trim()||null;if(Array.isArray(e)){for(const t of e){const i=h(t);if(i)return i}return null}if(typeof e=="object"){if(typeof e["@value"]=="string")return e["@value"].trim()||null;if(typeof e.value=="string")return e.value.trim()||null}return null}function Z(e){return e==null?[]:Array.isArray(e)?e:[e]}function be(e){return e==null?null:typeof e=="string"?e:typeof e=="object"&&e["@id"]?String(e["@id"]):null}function N(e,t){const i=e==null?void 0:e["@type"];return Z(i).map(String).some(n=>n===t||n.endsWith(t)||n.includes(t))}function O(e,t=180){if(!e)return"";const i=e.replace(/\s+/g," ").trim();return i.length<=t?i:`${i.slice(0,t-1).trim()}…`}function u(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const ye=/\s*(?:leggi\s+(?:di\s+pi[uù]|meno)|mostra\s+(?:di\s+pi[uù]|meno)|read\s+more|show\s+more|nascondi)\s*/gi,we=/((?:[A-ZÀÈÉÌÒÙ][A-ZÀÈÉÌÒÙ0-9'’\-\/]{1,}(?:\s+|,\s*))+[A-ZÀÈÉÌÒÙ][A-ZÀÈÉÌÒÙ0-9'’\-\/]{1,})/g;function E(e){if(!e)return null;let t=String(e);return t=t.replace(/<script[\s\S]*?<\/script>/gi," "),t=t.replace(/<style[\s\S]*?<\/style>/gi," "),t=t.replace(/<[^>]+>/g," "),t=t.replace(/&nbsp;/gi," "),t=t.replace(/&amp;/gi,"&"),t=t.replace(ye," "),t=t.replace(/\r\n/g,`
`),t=t.split(/\n{2,}/).map(i=>i.replace(/[^\S\n]+/g," ").replace(/\n/g," ").trim()).filter(Boolean).join(`

`),t||null}function Ee(e){const t=E(e);if(!t)return[];if(t.includes(`

`)){const l=[];for(const c of t.split(`

`)){const d=c.trim();if(d)if(ze(d))l.push({heading:d.replace(/\s+/g," ").trim(),text:""});else{const p=l[l.length-1];p&&p.heading&&!p.text?p.text=d:l.push({heading:null,text:d})}}return l.filter(c=>c.heading||c.text)}const i=[...t.matchAll(we)];if(!i.length)return[{heading:null,text:t}];const s=i.map(l=>({index:l.index,title:l[1].replace(/\s+/g," ").trim()})).filter(l=>l.title.length>=10&&l.title.split(/\s+/).length>=2);if(!s.length)return[{heading:null,text:t}];const n=[];for(const l of s){const c=n[n.length-1];c&&l.index<c.index+c.title.length||n.push(l)}const o=[],a=n[0];if(a.index>0){const l=t.slice(0,a.index).trim();l&&o.push({heading:null,text:l})}for(let l=0;l<n.length;l++){const c=n[l].index+n[l].title.length,d=l+1<n.length?n[l+1].index:t.length,p=t.slice(c,d).trim();o.push({heading:n[l].title,text:p})}return o.filter(l=>l.heading||l.text)}const $e=/<(p|ul|ol|li|strong|b|em|i|a|br)\b/i,Ce=new Set(["p","ul","ol","li","strong","b","em","i","a","br"]);function Ie(e){if(!e||!$e.test(e)||typeof DOMParser>"u")return null;const i=new DOMParser().parseFromString(`<div id="rich-root">${e}</div>`,"text/html").getElementById("rich-root");return i&&A(i).innerHTML.trim()||null}function A(e){const t=e.ownerDocument,i=t.createElement("div");for(const s of[...e.childNodes]){if(s.nodeType===Node.TEXT_NODE){i.appendChild(t.createTextNode(s.textContent));continue}if(s.nodeType!==Node.ELEMENT_NODE)continue;const n=s.tagName.toLowerCase();if(!Ce.has(n)){const l=A(s);for(;l.firstChild;)i.appendChild(l.firstChild);continue}if(n==="a"){const l=s.getAttribute("href")||"";if(!/^https?:\/\//i.test(l)){const p=A(s);for(;p.firstChild;)i.appendChild(p.firstChild);continue}const c=t.createElement("a");c.setAttribute("href",l),c.setAttribute("rel","noopener noreferrer");const d=A(s);for(;d.firstChild;)c.appendChild(d.firstChild);c.textContent.trim()&&i.appendChild(c);continue}const o=t.createElement(n),a=A(s);for(;a.firstChild;)o.appendChild(a.firstChild);(n==="br"||o.textContent.trim())&&i.appendChild(o)}return i}function k(e){const t=Ie(e);if(t)return t;const i=Ee(e);return i.length?i.map(s=>{const n=[];return s.heading&&n.push(`<h3 class="h5 mt-3 mb-2">${u(Le(s.heading))}</h3>`),s.text&&n.push(`<p class="mb-2">${u(s.text)}</p>`),n.join("")}).join(""):""}function ze(e){const t=e.replace(/\s+/g," ").trim();return t.length<5||t.length>80||!/[A-ZÀÈÉÌÒÙ]/.test(t)||t!==t.toLocaleUpperCase("it")||t.split(/\s+/).length>8?!1:/^[A-ZÀÈÉÌÒÙ0-9][A-ZÀÈÉÌÒÙ0-9'’\-\/\s,;:]+$/.test(t)}function Le(e){return e.toLocaleLowerCase("it").replace(/(^|[\s,/])(\S)/g,(i,s,n)=>s+n.toLocaleUpperCase("it"))}const le="./cpsv_full.jsonld";function _(e=window.location.hash){const t=(e||"").replace(/^#/,"");let i=null,s="/";if(t.startsWith("catalog=")){const p=t.indexOf("&"),m=p===-1?t.slice(8):t.slice(8,p);i=decodeURIComponent(m),s=p===-1?"/":t.slice(p+1)||"/"}else t&&(s=t.startsWith("/")?t:`/${t}`);const{path:n,query:o}=xe(s),a=n.startsWith("/")?n:`/${n}`;let l="list",c=null;const d=a.match(/^\/servizio\/(.+)$/);return d&&(l="detail",c=decodeURIComponent(d[1])),{catalog:i,path:a,view:l,serviceId:c,filters:Se(o)}}function C({catalog:e,path:t="/",filters:i}={}){const s=t.startsWith("/")?t:`/${t}`,n=Pe(i);return e?`#catalog=${encodeURIComponent(e)}&${s}${n}`:`#${s}${n}`}function Ae(e,{replace:t=!1}={}){const i=C(e);Te(_(window.location.hash||"#"),_(i))||(t?history.replaceState(null,"",i):history.pushState(null,"",i))}function Te(e,t){return e.catalog===t.catalog&&e.path===t.path&&e.view===t.view&&e.serviceId===t.serviceId&&e.filters.q===t.filters.q&&e.filters.org===t.filters.org&&e.filters.lifeEvent===t.filters.lifeEvent&&e.filters.theme===t.filters.theme&&e.filters.page===t.filters.page}function xe(e){const t=e.indexOf("?");return t===-1?{path:e||"/",query:""}:{path:e.slice(0,t)||"/",query:e.slice(t+1)}}function Se(e){const t=new URLSearchParams(e||""),i=Number(t.get("p")||"1"),s=Number.isFinite(i)&&i>1?Math.floor(i):1;return{q:t.get("q")||"",org:t.get("ente")||"",lifeEvent:t.get("evento")||"",theme:t.get("tema")||"",page:s}}function Pe(e){if(!e)return"";const t=new URLSearchParams;e.q&&t.set("q",String(e.q)),e.org&&t.set("ente",String(e.org)),e.lifeEvent&&t.set("evento",String(e.lifeEvent)),e.theme&&t.set("tema",String(e.theme));const i=Number(e.page||1);Number.isFinite(i)&&i>1&&t.set("p",String(Math.floor(i)));const s=t.toString();return s?`?${s}`:""}function ae(e){return!e||!String(e).trim()?le:String(e).trim()}async function Ue(e){const t=ae(e);let i;try{i=await fetch(t,{credentials:"same-origin"})}catch(n){const o=new Error(`Impossibile scaricare il catalogo (${t}). Verifica URL, CORS o rete.`);throw o.cause=n,o.code="NETWORK",o}if(!i.ok){const n=new Error(`Catalogo non disponibile (HTTP ${i.status}): ${t}`);throw n.code="HTTP",n}let s;try{s=await i.json()}catch(n){const o=new Error(`Il file non è un JSON valido: ${t}`);throw o.cause=n,o.code="JSON",o}if(!s||typeof s!="object"||!Array.isArray(s["@graph"])){const n=new Error("JSON-LD senza @graph: file non utilizzabile come catalogo CPSV.");throw n.code="SHAPE",n}return{doc:s,url:t}}function y(e){return Z(e).map(be).filter(Boolean)}function j(e,t){const i=[];for(const s of e){const n=t.get(s);if(!n)continue;const o=E(h(n["dct:title"])||h(n["skos:prefLabel"])),a=h(n["dct:description"])||h(n["rdfs:comment"]),c=E(a)||o;c&&i.push({id:s,title:o,text:c,html:a})}return i}function qe(e,t){var l;let i=null;const s=e["foaf:page"];if(typeof s=="string"&&s.startsWith("http")?i=s:(l=s==null?void 0:s["@id"])!=null&&l.startsWith("http")&&(i=s["@id"]),!i)for(const c of y(e["cpsv:hasWebSiteChannel"])){const d=t.get(c),p=d==null?void 0:d["foaf:page"];if(typeof p=="string"&&p.startsWith("http")){i=p;break}}!i&&typeof e["@id"]=="string"&&e["@id"].startsWith("http")&&(i=e["@id"].split("#")[0]);const n=[],o=new Set,a=c=>{if(!c||!c.startsWith("http"))return;const d=c.split("#")[0];i&&d.replace(/\/$/,"")===i.replace(/\/$/,"")||o.has(d)||(o.add(d),n.push(c))};for(const c of["cpsv:hasOtherElectronicChannel","cpsv:hasChannel"])for(const d of y(e[c])){const p=t.get(d);if(!p){d.startsWith("http")&&!d.includes("#")&&a(d);continue}const m=p["foaf:page"];typeof m=="string"?a(m):m!=null&&m["@id"]&&a(m["@id"])}return{sheetUrl:i,applicationUrls:n}}function je(e,t){const i=e["@graph"]||[],s=new Map;for(const r of i)r&&r["@id"]&&s.set(String(r["@id"]),r);const n=new Map;for(const r of i)r&&(N(r,"PublicOrganisation")||N(r,"cv:PublicOrganisation"))&&n.set(r["@id"],{id:r["@id"],title:h(r["dct:title"])||r["@id"],homepage:typeof r["foaf:homepage"]=="string"?r["foaf:homepage"]:null});const o=[];for(const r of i){if(!r||!N(r,"PublicService"))continue;const I=y(r["cv:hasCompetentAuthority"]||r["cpsv:producedBy"])[0]||null,z=I?n.get(I):null,X=y(r["cpsv:isPartOfEvent"]),Y=y(r["cpsv:hasTheme"]),ue=y(r["cpsv:hasInput"]),Q=j(ue,s),de=y(r["cpsv:hasProcessingTime"]),B=j(de,s),ee=h(r["aci:processingTime"]);ee&&B.push({id:`${r["@id"]}#aci-time`,text:ee});const pe=y(r["cpsv:hasOutput"]),te=j(pe,s),ie=y(r["cv:addressee"]),P=j(ie,s);if(!P.length)for(const b of ie){const $=s.get(b),re=h($==null?void 0:$["dct:title"])||h($==null?void 0:$["skos:prefLabel"]);re?P.push({id:b,text:re}):b.includes("#addressee-")&&P.push({id:b,text:decodeURIComponent(b.split("#addressee-").pop())})}const se=E(h(r["aci:costDescription"])||h(r["cpsv:hasCost"])),{sheetUrl:U,applicationUrls:q}=qe(r,s),fe=[U,...q].filter(Boolean),ve=E(h(r["dct:title"])||h(r["cpsv:name"]))||"Servizio",ne=h(r["dct:description"]),oe=E(ne),he=E(h(r["dct:abstract"]))||oe;o.push({id:r["@id"],title:ve,description:oe,descriptionHtml:ne,abstract:he,orgId:I,orgTitle:(z==null?void 0:z.title)||null,lifeEventIds:X,themeIds:Y,lifeEventLabels:X.map(b=>t.lifeEvents[b]||b.split("/").pop()),themeLabels:Y.map(b=>t.themes[b]||`Tema ${b.split("/").pop()}`),addressees:P,inputs:Q,outputs:te,processingTimes:B,cost:se,sheetUrl:U,applicationUrls:q,onlineUrls:fe,hasOnlineChannel:q.length>0,pageUrl:U||r["@id"],flags:{hasInput:Q.length>0,hasOutput:te.length>0,hasTime:B.length>0,hasCost:!!se,hasOnline:q.length>0,hasSheet:!!U}})}o.sort((r,f)=>r.title.localeCompare(f.title,"it"));const a=[...n.values()].sort((r,f)=>r.title.localeCompare(f.title,"it")),l=new Map,c=new Map;for(const r of o){for(const f of r.lifeEventIds)l.set(f,(l.get(f)||0)+1);for(const f of r.themeIds)c.set(f,(c.get(f)||0)+1)}const d=[...l.entries()].map(([r,f])=>({id:r,label:t.lifeEvents[r]||r.split("/").pop(),count:f})).sort((r,f)=>r.label.localeCompare(f.label,"it")),p=[...c.entries()].map(([r,f])=>({id:r,label:t.themes[r]||`Tema ${r.split("/").pop()}`,count:f})).sort((r,f)=>r.label.localeCompare(f.label,"it")),m=Z(e["cpsv-portalone:sourceCatalogs"]).map(r=>({id:r==null?void 0:r["@id"],title:h(r==null?void 0:r["dct:title"])||(r==null?void 0:r["@id"])}));return{services:o,orgsById:n,nodesById:s,facets:{orgs:a,lifeEvents:d,themes:p},meta:{title:"Catalogo dei servizi della PA",modified:e["dct:modified"]||null,sources:m,count:o.length}}}function He(e,t){const i=(t.q||"").trim().toLocaleLowerCase("it");return e.filter(s=>!(t.org&&s.orgId!==t.org||t.lifeEvent&&!s.lifeEventIds.includes(t.lifeEvent)||t.theme&&!s.themeIds.includes(t.theme)||t.onlineOnly&&!s.flags.hasOnline||i&&!`${s.title} ${s.abstract||""} ${s.orgTitle||""}`.toLocaleLowerCase("it").includes(i)))}const W=24,R="Catalogo dei servizi della PA",Oe="Trova e consulta i servizi digitali della Pubblica Amministrazione";function T({catalogUrl:e,meta:t,error:i,detail:s=null,filters:n=null}){const o=u(C({catalog:G(e),path:"/",filters:n})),a=t?`${t.count} serviz${t.count===1?"io":"i"} disponibili`:"Caricamento…";return`
<a class="visually-hidden-focusable" href="#main">Vai al contenuto</a>
<header class="it-header-wrapper it-header-sticky">
  <div class="it-nav-wrapper">
    <div class="it-header-center-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="it-header-center-content-wrapper">
              <div class="it-brand-wrapper">
                <a href="${o}" aria-label="${u(R)} — torna all’elenco">
                  <div class="it-brand-text">
                    <div class="it-brand-title">${u(R)}</div>
                    <div class="it-brand-tagline d-none d-md-block">${u(Oe)}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  ${s?Me(s,{homeHref:o}):""}
</header>

<main id="main" class="container my-4 mb-5">
  ${i?`<div class="alert alert-danger" role="alert">
          <h2 class="alert-heading h5">Non è stato possibile caricare il catalogo</h2>
          <p class="mb-0">${u(i)}</p>
        </div>`:""}
  ${s?"":`<p class="text-secondary mb-4">${u(a)}</p>`}
  <div id="view-root"></div>
</main>

<footer class="it-footer">
  <div class="it-footer-main">
    <div class="container py-4">
      <h2 class="h5 mb-2">${u(R)}</h2>
      <p class="mb-0">
        Le informazioni mostrate derivano dalle schede pubbliche degli enti erogatori.
        Se un dettaglio (tempi, costi, documenti) non compare, non è disponibile nella fonte.
      </p>
    </div>
  </div>
</footer>
`}function Me(e,{homeHref:t}){var o;const i=e.sheetUrl||e.pageUrl,s=i?`<a
        class="btn btn-light btn-lg service-sheet-cta"
        href="${u(i)}"
        rel="noopener noreferrer"
        target="_blank"
      >
        Vai al servizio
        ${Be()}
        <span class="visually-hidden">(si apre in un altro sito)</span>
      </a>`:'<p class="small mb-0 service-header-muted">Scheda ufficiale non indicata nel catalogo.</p>',n=((o=e.lifeEventLabels)==null?void 0:o.length)>0?`<div class="service-header-pills mt-3" role="list" aria-label="Momenti della vita">
          ${e.lifeEventLabels.map(a=>`<span class="service-header-pill" role="listitem">${u(a)}</span>`).join("")}
        </div>`:"";return`
<div class="service-header">
  <div class="container py-4">
    <nav class="breadcrumb-container mb-3" aria-label="Sei qui">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="${t}">Catalogo</a><span class="separator" aria-hidden="true">/</span></li>
        <li class="breadcrumb-item active" aria-current="page">${u(O(e.title,64))}</li>
      </ol>
    </nav>
    <div class="row align-items-start g-3">
      <div class="col-lg-8">
        <p class="service-header-org mb-1">${u(e.orgTitle||"Ente erogatore")}</p>
        <h1 class="service-header-title mb-0">${u(e.title)}</h1>
        ${n}
      </div>
      <div class="col-lg-4 d-flex justify-content-lg-end align-items-start">
        ${s}
      </div>
    </div>
  </div>
</div>`}function Be(){return`<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M21 3v6h-1V4.7l-7.6 7.7-.8-.8L19.3 4H15V3h6zm-4 16.5c0 .3-.2.5-.5.5h-12c-.3 0-.5-.2-.5-.5v-12c0-.3.2-.5.5-.5H12V6H4.5C3.7 6 3 6.7 3 7.5v12c0 .8.7 1.5 1.5 1.5h12c.8 0 1.5-.7 1.5-1.5V12h-1v7.5z"/>
  </svg>`}function G(e){return!e||e==="./cpsv_full.jsonld"?null:e}function Ne(e){if(!e)return"Ente";const t=String(e).match(/\b(ACI|INPS|AdE|INAIL|ANPR|MIT|Agenzia delle Entrate|Motorizzazione)\b/i);if(!t)return O(e,36);const i=t[1];return/agenzia delle entrate/i.test(e)?"Agenzia delle Entrate":/motorizzazione/i.test(e)?"Motorizzazione":/anpr/i.test(e)?"ANPR":(i.toUpperCase()===i||i.length<=5,i)}function F({id:e,name:t,label:i,optionsHtml:s,value:n}){return`
<div class="mb-3">
  <label class="form-label" for="${u(e)}">${u(i)}</label>
  <select class="form-select" id="${u(e)}" name="${u(t)}">
    ${s}
  </select>
</div>`}function Re({index:e,filterState:t}){const{facets:i}=e,s=['<option value="">Tutti gli enti</option>',...i.orgs.map(a=>`<option value="${u(a.id)}" ${t.org===a.id?"selected":""}>${u(a.title)}</option>`)].join(""),n=['<option value="">Tutte le fasi</option>',...i.lifeEvents.map(a=>`<option value="${u(a.id)}" ${t.lifeEvent===a.id?"selected":""}>${u(a.label)}</option>`)].join(""),o=['<option value="">Tutti i temi</option>',...i.themes.map(a=>`<option value="${u(a.id)}" ${t.theme===a.id?"selected":""}>${u(a.label)}</option>`)].join("");return`
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
            value="${u(t.q||"")}"
            placeholder="Es. bollo, pensione, residenza"
            autocomplete="off"
          />
        </div>
        ${F({id:"filter-org",name:"org",label:"Ente erogatore",optionsHtml:s,value:t.org})}
        ${F({id:"filter-le",name:"lifeEvent",label:"Momento della vita",optionsHtml:n,value:t.lifeEvent})}
        ${F({id:"filter-theme",name:"theme",label:"Argomento",optionsHtml:o,value:t.theme})}
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
`}function Fe(e,{catalogUrl:t,page:i,filterState:s={}}){const n=G(t),o=(i-1)*W,a=e.slice(o,o+W);return a.length?a.map(l=>{const c=C({catalog:n,path:`/servizio/${encodeURIComponent(l.id)}`,filters:{...s,page:i}}),d=Ne(l.orgTitle),p=l.lifeEventIds[0]||"",m=l.lifeEventLabels[0]?O(l.lifeEventLabels[0],40):null,r=s.org&&s.org===l.orgId,f=s.lifeEvent&&s.lifeEvent===p,I=l.orgId?`<button
            type="button"
            class="chip chip-simple ${r?"chip-filter-active":""}"
            data-filter-org="${u(l.orgId)}"
            aria-pressed="${r?"true":"false"}"
            title="Filtra per ${u(d)}"
          ><span class="chip-label">${u(d)}</span></button>`:"",z=p?`<button
            type="button"
            class="chip chip-simple ${f?"chip-filter-active":""}"
            data-filter-life-event="${u(p)}"
            aria-pressed="${f?"true":"false"}"
            title="Filtra per questo momento della vita"
          ><span class="chip-label">${u(m)}</span></button>`:"";return`
<div class="col-md-6">
  <div class="card-wrapper card-space h-100">
    <div class="card card-bg no-after h-100 border">
      <div class="card-body d-flex flex-column">
        <div class="chip-list mb-3" role="group" aria-label="Filtri rapidi">
          ${I}
          ${z}
        </div>
        <h3 class="card-title h5">
          <a href="${u(c)}">${u(l.title)}</a>
        </h3>
        <p class="card-text mb-4">
          ${u(O(l.abstract||"Descrizione non disponibile per questo servizio.",180))}
        </p>
        <div class="mt-auto">
          <a class="btn btn-outline-primary btn-sm" href="${u(c)}">
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
</div>`}function De(e,t,{catalogUrl:i,filterState:s={}}={}){const n=Math.max(1,Math.ceil(e/W));if(n<=1)return"";const o=G(i),a=[];for(let l=1;l<=n;l++){const c=C({catalog:o,path:"/",filters:{...s,page:l}});a.push(`<li class="page-item ${l===t?"active":""}">
        <a class="page-link" href="${u(c)}" data-page="${l}" ${l===t?'aria-current="page"':""}>${l}</a>
      </li>`)}return`<ul class="pagination justify-content-center">${a.join("")}</ul>`}function ke(e){const t=[];return e.addressees.length&&t.push(L("A chi è rivolto",H(e.addressees))),e.inputs.length&&t.push(L("Cosa serve",H(e.inputs))),e.processingTimes.length&&t.push(L("Tempi",H(e.processingTimes))),e.cost&&t.push(L("Costi",k(e.cost))),e.outputs.length&&t.push(L("Cosa si ottiene",H(e.outputs))),`
${e.description?`<div class="font-serif service-description">${k(e.descriptionHtml||e.description)}</div>`:'<p class="text-secondary">Descrizione non disponibile per questo servizio.</p>'}
<div class="mt-4">
  ${t.join("")||'<p class="text-secondary">Non ci sono altri dettagli disponibili nella scheda pubblica.</p>'}
</div>
`}function L(e,t){return`
<section class="mb-4 pb-3 border-bottom">
  <h2 class="h4">${u(e)}</h2>
  ${t}
</section>`}function H(e){return e.map(t=>`<div class="mb-3 service-block-text">${k(t.html||t.text)}</div>`).join("")}const _e={lifeEvents:ge,themes:me},x=document.getElementById("app");let g=null,v={q:"",org:"",lifeEvent:"",theme:"",onlineOnly:!1},w=1,D=0;function J(e){return!e||e===le?null:e}async function We(e){const t=ae(e);if(g&&g.docUrl===t)return g;const i=++D;x.innerHTML=T({catalogUrl:t,meta:null,error:null});const s=document.getElementById("view-root");s&&(s.innerHTML='<p class="text-muted" role="status">Caricamento catalogo…</p>');try{const{doc:n,url:o}=await Ue(t);return i!==D||(g={docUrl:o,index:je(n,_e)}),g}catch(n){if(i!==D)return null;g=null,x.innerHTML=T({catalogUrl:t,meta:null,error:n.message||String(n)});const o=document.getElementById("view-root");return o&&(o.innerHTML=`
        <div class="alert alert-warning" role="alert">
          <h2 class="h5">Catalogo non disponibile</h2>
          <p>Riprova tra poco oppure torna all’elenco principale.</p>
          <p class="mb-0"><a class="btn btn-primary btn-sm" href="${C({catalog:J(t),path:"/",filters:K()})}">Torna al catalogo</a></p>
        </div>`),null}}function K(){return{q:v.q,org:v.org,lifeEvent:v.lifeEvent,theme:v.theme,page:w}}function Ve(e){v={q:(e==null?void 0:e.q)||"",org:(e==null?void 0:e.org)||"",lifeEvent:(e==null?void 0:e.lifeEvent)||"",theme:(e==null?void 0:e.theme)||"",onlineOnly:!1},w=(e==null?void 0:e.page)>1?e.page:1}function M({replace:e}){g&&Ae({catalog:J(g.docUrl),path:"/",filters:K()},{replace:e})}function V(){const e=document.getElementById("filter-q"),t=document.getElementById("filter-org"),i=document.getElementById("filter-le"),s=document.getElementById("filter-theme"),n=document.getElementById("filter-online");e&&(e.value=v.q||""),t&&(t.value=v.org||""),i&&(i.value=v.lifeEvent||""),s&&(s.value=v.theme||""),n&&(n.checked=!1)}function Ze(){var s,n;const e=document.getElementById("filters-form");if(!e)return;const t=({replace:o})=>{var a,l,c,d;v={q:((a=document.getElementById("filter-q"))==null?void 0:a.value)||"",org:((l=document.getElementById("filter-org"))==null?void 0:l.value)||"",lifeEvent:((c=document.getElementById("filter-le"))==null?void 0:c.value)||"",theme:((d=document.getElementById("filter-theme"))==null?void 0:d.value)||"",onlineOnly:!1},w=1,M({replace:o}),S()};e.addEventListener("change",o=>{var a;((a=o.target)==null?void 0:a.id)!=="filter-q"&&t({replace:!1})}),e.addEventListener("submit",o=>{o.preventDefault(),t({replace:!1})});let i;(s=document.getElementById("filter-q"))==null||s.addEventListener("input",()=>{clearTimeout(i),i=setTimeout(()=>t({replace:!0}),200)}),(n=document.getElementById("filters-reset"))==null||n.addEventListener("click",()=>{v={q:"",org:"",lifeEvent:"",theme:"",onlineOnly:!1},w=1,V(),M({replace:!1}),S()})}function Ge(e){e&&(e.querySelectorAll("[data-filter-org]").forEach(t=>{t.addEventListener("click",i=>{var n;i.preventDefault(),i.stopPropagation();const s=t.getAttribute("data-filter-org")||"";v.org=v.org===s?"":s,w=1,V(),M({replace:!1}),S(),(n=document.getElementById("results-count"))==null||n.scrollIntoView({behavior:"smooth",block:"start"})})}),e.querySelectorAll("[data-filter-life-event]").forEach(t=>{t.addEventListener("click",i=>{var n;i.preventDefault(),i.stopPropagation();const s=t.getAttribute("data-filter-life-event")||"";v.lifeEvent=v.lifeEvent===s?"":s,w=1,V(),M({replace:!1}),S(),(n=document.getElementById("results-count"))==null||n.scrollIntoView({behavior:"smooth",block:"start"})})}))}function S(){if(!g)return;const e=He(g.index.services,v),t=document.getElementById("results-count"),i=document.getElementById("results-grid"),s=document.getElementById("pager");t&&(t.textContent=e.length===1?"1 servizio trovato":`${e.length} servizi trovati`),i&&(i.innerHTML=Fe(e,{catalogUrl:g.docUrl,page:w,filterState:v}),Ge(i)),s&&(s.innerHTML=De(e.length,w,{catalogUrl:g.docUrl,filterState:v}))}async function ce(){const e=_();Ve(e.filters);const t=await We(e.catalog);if(!t)return;const i=K();if(e.view==="detail"){const n=t.index.services.find(a=>a.id===e.serviceId);if(!n){x.innerHTML=T({catalogUrl:t.docUrl,meta:t.index.meta,error:null,filters:i});const a=document.getElementById("view-root");a&&(a.innerHTML=`
          <div class="alert alert-warning" role="alert">
            Servizio non trovato in questo catalogo.
            <a href="${C({catalog:J(t.docUrl),path:"/",filters:i})}">Torna all’elenco</a>
          </div>`);return}x.innerHTML=T({catalogUrl:t.docUrl,meta:t.index.meta,error:null,detail:n,filters:i});const o=document.getElementById("view-root");o&&(o.innerHTML=ke(n)),window.scrollTo(0,0);return}x.innerHTML=T({catalogUrl:t.docUrl,meta:t.index.meta,error:null,filters:i});const s=document.getElementById("view-root");s&&(s.innerHTML=Re({index:t.index,filterState:v,catalogUrl:t.docUrl}),Ze(),S())}window.addEventListener("hashchange",()=>{ce()});ce();
