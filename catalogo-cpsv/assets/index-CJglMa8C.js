(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function i(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(n){if(n.ep)return;n.ep=!0;const s=i(n);fetch(n.href,s)}})();const x=new Map;var J={set(e,t,i){x.has(e)||x.set(e,new Map);const o=x.get(e);if(!o.has(t)&&o.size!==0){console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(o.keys())[0]}.`);return}o.set(t,i)},get(e,t){return x.has(e)&&x.get(e).get(t)||null},remove(e,t){if(!x.has(e))return;const i=x.get(e);i.delete(t),i.size===0&&x.delete(e)}};const Xe=1e3,ie="transitionend",Qe=e=>e==null?`${e}`:Object.prototype.toString.call(e).match(/\s([a-z]+)/i)[1].toLowerCase(),et=e=>{let t=e.getAttribute("data-bs-target");if(!t||t==="#"){let i=e.getAttribute("href");if(!i||!i.includes("#")&&!i.startsWith("."))return null;i.includes("#")&&!i.startsWith("#")&&(i=`#${i.split("#")[1]}`),t=i&&i!=="#"?i.trim():null}return t},tt=e=>{const t=et(e);return t&&document.querySelector(t)?t:null},it=e=>{if(!e)return 0;let{transitionDuration:t,transitionDelay:i}=window.getComputedStyle(e);const o=Number.parseFloat(t),n=Number.parseFloat(i);return!o&&!n?0:(t=t.split(",")[0],i=i.split(",")[0],(Number.parseFloat(t)+Number.parseFloat(i))*Xe)},ot=e=>{e.dispatchEvent(new Event(ie))},O=e=>!e||typeof e!="object"?!1:typeof e.nodeType<"u",Se=e=>O(e)?e:typeof e=="string"&&e.length>0?document.querySelector(e):null,nt=e=>{if(!O(e)||e.getClientRects().length===0)return!1;const t=getComputedStyle(e).getPropertyValue("visibility")==="visible",i=e.closest("details:not([open])");if(!i)return t;if(i!==e){const o=e.closest("summary");if(o&&o.parentNode!==i||o===null)return!1}return t},st=e=>!e||e.nodeType!==Node.ELEMENT_NODE||e.classList.contains("disabled")?!0:typeof e.disabled<"u"?e.disabled:e.hasAttribute("disabled")&&e.getAttribute("disabled")!=="false",xe=e=>{typeof e=="function"&&e()},rt=(e,t,i=!0)=>{if(!i){xe(e);return}const n=it(t)+5;let s=!1;const r=({target:a})=>{a===t&&(s=!0,t.removeEventListener(ie,r),xe(e))};t.addEventListener(ie,r),setTimeout(()=>{s||ot(t)},n)},at=/[^.]*(?=\..*)\.|.*/,lt=/\..*/,ct=/::\d+$/,Y={};let Ie=1;const Ne={mouseenter:"mouseover",mouseleave:"mouseout"},dt=new Set(["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"]);function Pe(e,t){return t&&`${t}::${Ie++}`||e.uidEvent||Ie++}function ke(e){const t=Pe(e);return e.uidEvent=t,Y[t]=Y[t]||{},Y[t]}function ut(e,t){return function i(o){return ce(o,{delegateTarget:e}),i.oneOff&&z.off(e,o.type,t),t.apply(e,[o])}}function pt(e,t,i){return function o(n){const s=e.querySelectorAll(t);for(let{target:r}=n;r&&r!==this;r=r.parentNode)for(const a of s)if(a===r)return ce(n,{delegateTarget:r}),o.oneOff&&z.off(e,n.type,t,i),i.apply(r,[n])}}function je(e,t,i=null){return Object.values(e).find(o=>o.callable===t&&o.delegationSelector===i)}function Me(e,t,i){const o=typeof t=="string",n=o?i:t||i;let s=ht(e);return dt.has(s)||(s=e),[o,n,s]}function _e(e,t,i,o,n){if(typeof t!="string"||!e)return;let[s,r,a]=Me(t,i,o);t in Ne&&(r=(_=>function(C){if(!C.relatedTarget||C.relatedTarget!==C.delegateTarget&&!C.delegateTarget.contains(C.relatedTarget))return _.call(this,C)})(r));const l=ke(e),d=l[a]||(l[a]={}),p=je(d,r,s?i:null);if(p){p.oneOff=p.oneOff&&n;return}const h=Pe(r,t.replace(at,"")),c=s?pt(e,i,r):ut(e,r);c.delegationSelector=s?i:null,c.callable=r,c.oneOff=n,c.uidEvent=h,d[h]=c,e.addEventListener(a,c,s)}function oe(e,t,i,o,n){const s=je(t[i],o,n);s&&(e.removeEventListener(i,s,!!n),delete t[i][s.uidEvent])}function ft(e,t,i,o){const n=t[i]||{};for(const s of Object.keys(n))if(s.includes(o)){const r=n[s];oe(e,t,i,r.callable,r.delegationSelector)}}function ht(e){return e=e.replace(lt,""),Ne[e]||e}const z={on(e,t,i,o){_e(e,t,i,o,!1)},one(e,t,i,o){_e(e,t,i,o,!0)},off(e,t,i,o){if(typeof t!="string"||!e)return;const[n,s,r]=Me(t,i,o),a=r!==t,l=ke(e),d=l[r]||{},p=t.startsWith(".");if(typeof s<"u"){if(!Object.keys(d).length)return;oe(e,l,r,s,n?i:null);return}if(p)for(const h of Object.keys(l))ft(e,l,h,t.slice(1));for(const h of Object.keys(d)){const c=h.replace(ct,"");if(!a||t.includes(c)){const f=d[h];oe(e,l,r,f.callable,f.delegationSelector)}}},trigger(e,t,i){if(typeof t!="string"||!e)return null;let o=!0,n=new Event(t,{bubbles:o,cancelable:!0});return n=ce(n,i),e.dispatchEvent(n),n}};function ce(e,t){for(const[i,o]of Object.entries(t||{}))try{e[i]=o}catch{Object.defineProperty(e,i,{configurable:!0,get(){return o}})}return e}function Te(e){if(e==="true")return!0;if(e==="false")return!1;if(e===Number(e).toString())return Number(e);if(e===""||e==="null")return null;if(typeof e!="string")return e;try{return JSON.parse(decodeURIComponent(e))}catch{return e}}function Z(e){return e.replace(/[A-Z]/g,t=>`-${t.toLowerCase()}`)}const ne={setDataAttribute(e,t,i){e.setAttribute(`data-bs-${Z(t)}`,i)},removeDataAttribute(e,t){e.removeAttribute(`data-bs-${Z(t)}`)},getDataAttributes(e){if(!e)return{};const t={},i=Object.keys(e.dataset).filter(o=>o.startsWith("bs")&&!o.startsWith("bsConfig"));for(const o of i){let n=o.replace(/^bs/,"");n=n.charAt(0).toLowerCase()+n.slice(1,n.length),t[n]=Te(e.dataset[o])}return t},getDataAttribute(e,t){return Te(e.getAttribute(`data-bs-${Z(t)}`))}};class gt{static get Default(){return{}}static get DefaultType(){return{}}static get NAME(){throw new Error('You have to implement the static method "NAME", for each component!')}_getConfig(t){return t=this._mergeConfigObj(t),t=this._configAfterMerge(t),this._typeCheckConfig(t),t}_configAfterMerge(t){return t}_mergeConfigObj(t,i){const o=O(i)?ne.getDataAttribute(i,"config"):{};return{...this.constructor.Default,...typeof o=="object"?o:{},...O(i)?ne.getDataAttributes(i):{},...typeof t=="object"?t:{}}}_typeCheckConfig(t,i=this.constructor.DefaultType){for(const o of Object.keys(i)){const n=i[o],s=t[o],r=O(s)?"element":Qe(s);if(!new RegExp(n).test(r))throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${o}" provided type "${r}" but expected type "${n}".`)}}}const mt="5.2.3";class vt extends gt{constructor(t,i){super(),t=Se(t),t&&(this._element=t,this._config=this._getConfig(i),J.set(this._element,this.constructor.DATA_KEY,this))}dispose(){J.remove(this._element,this.constructor.DATA_KEY),z.off(this._element,this.constructor.EVENT_KEY);for(const t of Object.getOwnPropertyNames(this))this[t]=null}_queueCallback(t,i,o=!0){rt(t,i,o)}_getConfig(t){return t=this._mergeConfigObj(t,this._element),t=this._configAfterMerge(t),this._typeCheckConfig(t),t}static getInstance(t){return J.get(Se(t),this.DATA_KEY)}static getOrCreateInstance(t,i={}){return this.getInstance(t)||new this(t,typeof i=="object"?i:null)}static get VERSION(){return mt}static get DATA_KEY(){return`bs.${this.NAME}`}static get EVENT_KEY(){return`.${this.DATA_KEY}`}static eventName(t){return`${t}${this.EVENT_KEY}`}}const B={find(e,t=document.documentElement){return[].concat(...Element.prototype.querySelectorAll.call(t,e))},findOne(e,t=document.documentElement){return Element.prototype.querySelector.call(t,e)},children(e,t){return[].concat(...e.children).filter(i=>i.matches(t))},parents(e,t){const i=[];let o=e.parentNode.closest(t);for(;o;)i.push(o),o=o.parentNode.closest(t);return i},prev(e,t){let i=e.previousElementSibling;for(;i;){if(i.matches(t))return[i];i=i.previousElementSibling}return[]},next(e,t){let i=e.nextElementSibling;for(;i;){if(i.matches(t))return[i];i=i.nextElementSibling}return[]},focusableChildren(e){const t=["a","button","input","textarea","select","details","[tabindex]",'[contenteditable="true"]'].map(i=>`${i}:not([tabindex^="-"])`).join(",");return this.find(t,e).filter(i=>!st(i)&&nt(i))}},bt="(max-width: 991px)",ze=()=>{if(typeof window<"u")return window.matchMedia(bt).matches},y=[];for(let e=0;e<256;++e)y.push((e+256).toString(16).slice(1));function yt(e,t=0){return(y[e[t+0]]+y[e[t+1]]+y[e[t+2]]+y[e[t+3]]+"-"+y[e[t+4]]+y[e[t+5]]+"-"+y[e[t+6]]+y[e[t+7]]+"-"+y[e[t+8]]+y[e[t+9]]+"-"+y[e[t+10]]+y[e[t+11]]+y[e[t+12]]+y[e[t+13]]+y[e[t+14]]+y[e[t+15]]).toLowerCase()}const wt=new Uint8Array(16);function Et(){return crypto.getRandomValues(wt)}function Ct(e,t,i){return crypto.randomUUID?crypto.randomUUID():$t(e)}function $t(e,t,i){var n;e=e||{};const o=e.random??((n=e.rng)==null?void 0:n.call(e))??Et();if(o.length<16)throw new Error("Random bytes length must be >= 16");return o[6]=o[6]&15|64,o[8]=o[8]&63|128,yt(o)}let X=!1,N=[];class St{constructor(t,i){this.id=t,this._callback=i}dispose(){xt(this.id)}_execute(t){this._callback(t)}}const xt=e=>{N=N.filter(t=>t.id!==e)},De=e=>{if(!(typeof document>"u")){if(N.length||typeof window<"u"&&typeof document<"u"&&document.addEventListener("scroll",t=>{X||(window.requestAnimationFrame(()=>{N.forEach(i=>i.cb._execute(t)),X=!1}),X=!0)}),typeof e=="function"){const t=new St(Ct(),e);return N.push({id:t.id,cb:t}),t}return console.error("[onDocumentScroll] the provided data has to be of type function"),null}},It="sticky",_t="bs.sticky",de=`.${_t}`,Ae=`resize${de}`,Tt=`on${de}`,zt=`off${de}`,At="bs-it-sticky-wrapper",Le="bs-is-sticky",Oe="bs-is-fixed",Lt="data-bs-target-mobile",qe='[data-bs-toggle="sticky"]',Ot={positionType:"sticky",stickyClassName:"",stackable:!1,paddingTop:0};class j extends vt{constructor(t,i){super(t),this._config=this._getConfig(i),this._isSticky=!1,this._wrapper=null,this._stickyTarget=B.findOne(tt(this._element),this._element)||this._element,this._stickyTargetMobile=B.findOne(this._element.getAttribute(Lt),this._element)||this._stickyTarget,this._stickyLimit=0,this._stickyLimitMobile=0,this._setLimit(),this._scrollCb=null,this._isMobile=ze(),this._prevTop=0,this._onScroll(),this._bindEvents()}dispose(){typeof window<"u"&&typeof document<"u"&&(z.off(window,Ae),this._scrollCb.dispose(),super.dispose())}static get NAME(){return It}_getConfig(t){return t={...Ot,...ne.getDataAttributes(this._element),...typeof t=="object"?t:{}},t}_bindEvents(){typeof window<"u"&&typeof document<"u"&&(z.on(window,Ae,()=>this._onResize()),this._scrollCb=De(()=>this._onScroll()))}_onResize(){this._isMobile=ze(),this._setLimit()}_onScroll(){this._checkSticky()}_setLimit(){this._stickyLimit=this._cumulativeOffset(this._stickyTarget).top,this._stickyLimitMobile=this._cumulativeOffset(this._stickyTargetMobile).top}_getLimit(){let t=this._isMobile?this._stickyLimitMobile:this._stickyLimit;return this._config.stackable&&this._getStickySimblings().forEach((i,o)=>{const n=i.getBoundingClientRect();t-=n.height+(o===0?parseFloat(i.style.top):0)}),t>0?t:0}_cumulativeOffset(t){let i=0,o=0;do i+=t.offsetTop||0,o+=t.offsetLeft||0,t=t.offsetParent;while(t);return{top:i,left:o}}_isTypeSticky(){return this._config.positionType==="sticky"}_checkSticky(){this._isSticky||this._setLimit();const t=this._getLimit();typeof window<"u"&&window.pageYOffset>t?this._setSticky():this._unsetSticky()}_setSticky(){if(!this._isSticky){this._isSticky=!0;let t=Le;this._isTypeSticky()||(t=Oe,this._wrapper=this._createWrapper()),this._element.classList.add(t),this._config.stickyClassName&&this._element.classList.add(this._config.stickyClassName),this._prevTop=this._element.style.top,this._element.style.top=this._getPositionTop()+"px",z.trigger(this._element,Tt)}}_unsetSticky(){if(this._isSticky){let t=Le;this._isTypeSticky()||(t=Oe,this._destroyWrapper()),this._element.classList.remove(t),this._config.stickyClassName&&this._element.classList.remove(this._config.stickyClassName),this._element.style.top=this._prevTop,this._isSticky=!1,z.trigger(this._element,zt)}}_createWrapper(){if(typeof document>"u")return;const t=document.createElement("div");return t.classList.add(At),t.style.width="100%",t.style.height=this._element.getBoundingClientRect().height+"px",t.style.overflow="hidden",this._element.parentNode.insertBefore(t,this._element),t.appendChild(this._element),t}_destroyWrapper(){this._wrapper&&(this._wrapper.parentNode.insertBefore(this._element,this._wrapper),this._wrapper.remove())}_getStickySimblings(){return B.find(qe).filter(i=>{const o=j.getInstance(i);return!!(o&&o._isSticky&&i!==this._element)})}_getPositionTop(){let t=0;return this._config.stackable?(this._getStickySimblings().forEach((i,o)=>{const n=i.getBoundingClientRect();t+=n.height+(o===0?parseFloat(i.style.top):0)}),t):t+this._config.paddingTop}}typeof window<"u"&&typeof document<"u"&&De(()=>{B.find(qe).map(t=>{j.getOrCreateInstance(t)})});const Nt={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/1":"Iscrizione scuola/università e/o richiesta borsa di studio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/2":"Invalidità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/3":"Ricerca di lavoro, avvio nuovo lavoro, disoccupazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/4":"Pensionamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/5":"Richiesta o rinnovo patente","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/6":"Registrazione/possesso veicolo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/7":"Accesso al trasporto pubblico","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/8":"Compravendita/affitto casa/edifici/terreni, costruzione o ristrutturazione casa/edificio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/9":"Cambio di residenza/domicilio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/10":"Espatrio per lavoro, studio, pensionamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/11":"Richiesta passaporto, visto e assistenza viaggi internazionali","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/12":"Nascita di un bambino, richiesta adozioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/13":"Matrimonio e/o cambio stato civile","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/14":"Morte ed eredità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/15":"Prenotazione e disdetta visite/esami","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/16":"Denuncia crimini","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/17":"Dichiarazione dei redditi, versamento e riscossione tributi/imposte e contributi","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/18":"Accesso luoghi della cultura","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/19":"Possesso, cura, smarrimento animale da compagnia"},ue=[{id:"ACI",name:"ACI - Automobile Club d'Italia",url:"./enti/ACI.jsonld"},{id:"AdE",name:"Agenzia delle Entrate",url:"./enti/AdE.jsonld"},{id:"ANPR",name:"ANPR - Anagrafe Nazionale della Popolazione Residente",url:"./enti/ANPR.jsonld"},{id:"GSE",name:"GSE - Gestore Servizi Energetici",url:"./enti/GSE.jsonld"},{id:"INAIL",name:"INAIL - Istituto Nazionale per l'Assicurazione contro gli Infortuni sul Lavoro",url:"./enti/INAIL.jsonld"},{id:"INPS",name:"INPS - Istituto Nazionale Previdenza Sociale",url:"./enti/INPS.jsonld"},{id:"IPZS",name:"Istituto Poligrafico e Zecca dello Stato",url:"./enti/IPZS.jsonld"},{id:"MLPS",name:"Ministero del Lavoro e delle Politiche Sociali",url:"./enti/MLPS.jsonld"},{id:"MIM",name:"Ministero dell'Istruzione e del Merito",url:"./enti/MIM.jsonld"},{id:"MIT",name:"Motorizzazione Civile - Portale dell'Automobilista",url:"./enti/MIT.jsonld"}],Pt={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/1":"Istruzione e formazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/2":"Salute","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/3":"Lavoro e occupazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/4":"Previdenza e assistenza","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/5":"Mobilità e trasporti","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/6":"Veicoli e motorizzazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/7":"Trasporto pubblico","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/8":"Casa e territorio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/9":"Anagrafe e residenza","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/10":"Estero e mobilità internazionale","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/11":"Documenti di viaggio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/12":"Famiglia e nascite","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/13":"Stato civile","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/14":"Successioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/15":"Sanità e prestazioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/16":"Sicurezza e denunce","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/17":"Fisco e tributi","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/18":"Cultura e turismo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/19":"Animali","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/20":"Altro"},kt={"https://example.org/onto/ex#InputType-identity-document":"Documento di identità (CIE, CI, passaporto)","https://example.org/onto/ex#InputType-spid":"SPID / CIE id / eIDAS","https://example.org/onto/ex#InputType-codice-fiscale":"Codice fiscale","https://example.org/onto/ex#InputType-iban":"IBAN / coordinate bancarie","https://example.org/onto/ex#InputType-form":"Modulo / form compilato","https://example.org/onto/ex#InputType-certificate":"Certificato / attestazione","https://example.org/onto/ex#InputType-receipt":"Ricevuta / quietanza di pagamento","https://example.org/onto/ex#InputType-photo":"Fotografia","https://example.org/onto/ex#InputType-declaration":"Dichiarazione / autocertificazione","https://example.org/onto/ex#InputType-other":"Altro documento / requisito"},jt={"https://example.org/onto/ex#OutputType-certificate":"Certificato / attestato","https://example.org/onto/ex#OutputType-document":"Documento scaricabile","https://example.org/onto/ex#OutputType-payment":"Pagamento / bollettino","https://example.org/onto/ex#OutputType-appointment":"Appuntamento / prenotazione","https://example.org/onto/ex#OutputType-registration":"Iscrizione / registrazione","https://example.org/onto/ex#OutputType-card":"Tessera / carta fisica o digitale","https://example.org/onto/ex#OutputType-status":"Esito / stato della pratica","https://example.org/onto/ex#OutputType-other":"Altro risultato"};function m(e){if(e==null)return null;if(typeof e=="string")return e.trim()||null;if(Array.isArray(e)){for(const t of e){const i=m(t);if(i)return i}return null}if(typeof e=="object"){if(typeof e["@value"]=="string")return e["@value"].trim()||null;if(typeof e.value=="string")return e.value.trim()||null}return null}function pe(e){return e==null?[]:Array.isArray(e)?e:[e]}function Mt(e){return e==null?null:typeof e=="string"?e:typeof e=="object"&&e["@id"]?String(e["@id"]):null}function P(e,t){const i=e==null?void 0:e["@type"];return pe(i).map(String).some(n=>n===t||n.endsWith(t)||n.includes(t))}function F(e,t=180){if(!e)return"";const i=e.replace(/\s+/g," ").trim();return i.length<=t?i:`${i.slice(0,t-1).trim()}…`}function u(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Dt=/\s*(?:leggi\s+(?:di\s+pi[uù]|meno)|mostra\s+(?:di\s+pi[uù]|meno)|read\s+more|show\s+more|nascondi)\s*/gi,qt=/((?:[A-ZÀÈÉÌÒÙ][A-ZÀÈÉÌÒÙ0-9'’\-\/]{1,}(?:\s+|,\s*))+[A-ZÀÈÉÌÒÙ][A-ZÀÈÉÌÒÙ0-9'’\-\/]{1,})/g;function $(e){if(!e)return null;let t=String(e);return t=t.replace(/<script[\s\S]*?<\/script>/gi," "),t=t.replace(/<style[\s\S]*?<\/style>/gi," "),t=t.replace(/<[^>]+>/g," "),t=t.replace(/&nbsp;/gi," "),t=t.replace(/&amp;/gi,"&"),t=t.replace(Dt," "),t=t.replace(/\r\n/g,`
`),t=t.split(/\n{2,}/).map(i=>i.replace(/[^\S\n]+/g," ").replace(/\n/g," ").trim()).filter(Boolean).join(`

`),t||null}function Ut(e){const t=$(e);if(!t)return[];if(t.includes(`

`)){const a=[];for(const l of t.split(`

`)){const d=l.trim();if(d)if(Vt(d))a.push({heading:d.replace(/\s+/g," ").trim(),text:""});else{const p=a[a.length-1];p&&p.heading&&!p.text?p.text=d:a.push({heading:null,text:d})}}return a.filter(l=>l.heading||l.text)}const i=[...t.matchAll(qt)];if(!i.length)return[{heading:null,text:t}];const o=i.map(a=>({index:a.index,title:a[1].replace(/\s+/g," ").trim()})).filter(a=>a.title.length>=10&&a.title.split(/\s+/).length>=2);if(!o.length)return[{heading:null,text:t}];const n=[];for(const a of o){const l=n[n.length-1];l&&a.index<l.index+l.title.length||n.push(a)}const s=[],r=n[0];if(r.index>0){const a=t.slice(0,r.index).trim();a&&s.push({heading:null,text:a})}for(let a=0;a<n.length;a++){const l=n[a].index+n[a].title.length,d=a+1<n.length?n[a+1].index:t.length,p=t.slice(l,d).trim();s.push({heading:n[a].title,text:p})}return s.filter(a=>a.heading||a.text)}const Rt=/<(p|ul|ol|li|strong|b|em|i|a|br)\b/i,Ht=new Set(["p","ul","ol","li","strong","b","em","i","a","br"]);function Bt(e){if(!e||!Rt.test(e)||typeof DOMParser>"u")return null;const i=new DOMParser().parseFromString(`<div id="rich-root">${e}</div>`,"text/html").getElementById("rich-root");return i&&L(i).innerHTML.trim()||null}function L(e){const t=e.ownerDocument,i=t.createElement("div");for(const o of[...e.childNodes]){if(o.nodeType===Node.TEXT_NODE){i.appendChild(t.createTextNode(o.textContent));continue}if(o.nodeType!==Node.ELEMENT_NODE)continue;const n=o.tagName.toLowerCase();if(!Ht.has(n)){const a=L(o);for(;a.firstChild;)i.appendChild(a.firstChild);continue}if(n==="a"){const a=o.getAttribute("href")||"";if(!/^https?:\/\//i.test(a)){const p=L(o);for(;p.firstChild;)i.appendChild(p.firstChild);continue}const l=t.createElement("a");l.setAttribute("href",a),l.setAttribute("rel","noopener noreferrer");const d=L(o);for(;d.firstChild;)l.appendChild(d.firstChild);l.textContent.trim()&&i.appendChild(l);continue}const s=t.createElement(n),r=L(o);for(;r.firstChild;)s.appendChild(r.firstChild);(n==="br"||s.textContent.trim())&&i.appendChild(s)}return i}function se(e){const t=Bt(e);if(t)return t;const i=Ut(e);return i.length?i.map(o=>{const n=[];return o.heading&&n.push(`<h3 class="h5 mt-3 mb-2">${u(Ft(o.heading))}</h3>`),o.text&&n.push(`<p class="mb-2">${u(o.text)}</p>`),n.join("")}).join(""):""}function Vt(e){const t=e.replace(/\s+/g," ").trim();return t.length<5||t.length>80||!/[A-ZÀÈÉÌÒÙ]/.test(t)||t!==t.toLocaleUpperCase("it")||t.split(/\s+/).length>8?!1:/^[A-ZÀÈÉÌÒÙ0-9][A-ZÀÈÉÌÒÙ0-9'’\-\/\s,;:]+$/.test(t)}function Ft(e){return e.toLocaleLowerCase("it").replace(/(^|[\s,/])(\S)/g,(i,o,n)=>o+n.toLocaleUpperCase("it"))}const Ue="./cpsv_full.jsonld";function re(e=window.location.hash){const t=(e||"").replace(/^#/,"");let i=null,o="/";if(t.startsWith("catalog=")){const d=t.indexOf("&"),p=d===-1?t.slice(8):t.slice(8,d);i=decodeURIComponent(p),o=d===-1?"/":t.slice(d+1)||"/"}else t&&(o=t.startsWith("/")?t:`/${t}`);const{path:n,query:s}=Gt(o),r=n.startsWith("/")?n:`/${n}`;let a="list",l=null;if(r==="/cpsv")a="cpsv";else if(r==="/jsonld")a="jsonld";else{const d=r.match(/^\/servizio\/(.+)$/);d&&(a="detail",l=decodeURIComponent(d[1]))}return{catalog:i,path:r,view:a,serviceId:l,filters:Jt(s)}}function E({catalog:e,path:t="/",filters:i}={}){const o=t.startsWith("/")?t:`/${t}`,n=Yt(i);return e?`#catalog=${encodeURIComponent(e)}&${o}${n}`:`#${o}${n}`}function Wt(e,{replace:t=!1}={}){const i=E(e);Kt(re(window.location.hash||"#"),re(i))||(t?history.replaceState(null,"",i):history.pushState(null,"",i))}function Kt(e,t){return e.catalog===t.catalog&&e.path===t.path&&e.view===t.view&&e.serviceId===t.serviceId&&e.filters.q===t.filters.q&&e.filters.org===t.filters.org&&e.filters.lifeEvent===t.filters.lifeEvent&&e.filters.theme===t.filters.theme&&e.filters.page===t.filters.page}function Gt(e){const t=e.indexOf("?");return t===-1?{path:e||"/",query:""}:{path:e.slice(0,t)||"/",query:e.slice(t+1)}}function Jt(e){const t=new URLSearchParams(e||""),i=Number(t.get("p")||"1"),o=Number.isFinite(i)&&i>1?Math.floor(i):1;return{q:t.get("q")||"",org:t.get("ente")||"",lifeEvent:t.get("evento")||"",theme:t.get("tema")||"",page:o}}function Yt(e){if(!e)return"";const t=new URLSearchParams;e.q&&t.set("q",String(e.q)),e.org&&t.set("ente",String(e.org)),e.lifeEvent&&t.set("evento",String(e.lifeEvent)),e.theme&&t.set("tema",String(e.theme));const i=Number(e.page||1);Number.isFinite(i)&&i>1&&t.set("p",String(Math.floor(i)));const o=t.toString();return o?`?${o}`:""}function Re(e){return!e||!String(e).trim()?Ue:String(e).trim()}async function Zt(e){const t=Re(e);let i;try{i=await fetch(t,{credentials:"same-origin"})}catch(n){const s=new Error(`Impossibile scaricare il catalogo (${t}). Verifica URL, CORS o rete.`);throw s.cause=n,s.code="NETWORK",s}if(!i.ok){const n=new Error(`Catalogo non disponibile (HTTP ${i.status}): ${t}`);throw n.code="HTTP",n}let o;try{o=await i.json()}catch(n){const s=new Error(`Il file non è un JSON valido: ${t}`);throw s.cause=n,s.code="JSON",s}if(!o||typeof o!="object"||!Array.isArray(o["@graph"])){const n=new Error("JSON-LD senza @graph: file non utilizzabile come catalogo CPSV.");throw n.code="SHAPE",n}return{doc:o,url:t}}function S(e){return pe(e).map(Mt).filter(Boolean)}function R(e,t){var o,n;const i=[];for(const s of e){const r=t.get(s);if(!r)continue;const a=$(m(r["dct:title"])||m(r["skos:prefLabel"])),l=m(r["dct:description"])||m(r["rdfs:comment"]),p=$(l)||a,h=typeof r["dct:type"]=="string"&&r["dct:type"]||((o=r["dct:type"])==null?void 0:o["@id"])||null,c=h?((n=ti())==null?void 0:n[h])||String(h).split(/[#/]/).pop():null,f=Xt(r["cv:value"]);(p||c||f)&&i.push({id:s,title:a,text:p||c||f,html:l,typeId:h,typeLabel:c,duration:f})}return i}function Xt(e){return e==null?null:typeof e=="string"?e:typeof e=="object"&&e["@value"]!=null?String(e["@value"]):null}function Qt(e){const t=String(e||"").trim().toUpperCase();if(!t)return null;if(t==="PT0S"||t==="P0D"||t==="PT0H")return"Immediato";const i=t.match(/^P(\d+)W$/);if(i){const r=Number(i[1]);return r===1?"1 settimana":`${r} settimane`}const o=t.match(/^P(\d+)M$/);if(o){const r=Number(o[1]);return r===1?"1 mese":`${r} mesi`}const n=t.match(/^P(\d+)D$/);if(n){const r=Number(n[1]);return r===1?"1 giorno":`${r} giorni`}const s=t.match(/^PT(\d+)H$/);if(s){const r=Number(s[1]);return r===1?"1 ora":`${r} ore`}return t}function He(e){if(e==null||e==="")return null;if(typeof e=="number")return e;if(typeof e=="string"){const t=Number(e.replace(",","."));return Number.isNaN(t)?null:t}return typeof e=="object"&&e["@value"]!=null?He(e["@value"]):null}let Be=null;function ei(e){Be=e}function ti(){return Be||{}}function ii(e,t){const i=$(m(e["aci:costDescription"])),o=e["cpsv:hasCost"];if(o==null&&!i)return null;const n=typeof o=="string"&&o.startsWith("http")?o:(o==null?void 0:o["@id"])||null,s=n?t.get(n):null;if(s){const r=$(m(s["dct:description"])||m(s["dct:title"])),a=He(s["cv:value"]),l=typeof s["cv:currency"]=="string"&&s["cv:currency"]||m(s["cv:currency"])||"EUR",d=a!=null?`${a} ${l}`.trim():null;return[d,r||i].filter(Boolean).join(" — ")||d||r||i||null}return i||$(m(o))||null}function oi(e,t){var a;let i=null;const o=e["foaf:page"];if(typeof o=="string"&&o.startsWith("http")?i=o:(a=o==null?void 0:o["@id"])!=null&&a.startsWith("http")&&(i=o["@id"]),!i)for(const l of S(e["cpsv:hasWebSiteChannel"])){const d=t.get(l),p=d==null?void 0:d["foaf:page"];if(typeof p=="string"&&p.startsWith("http")){i=p;break}}!i&&typeof e["@id"]=="string"&&e["@id"].startsWith("http")&&(i=e["@id"].split("#")[0]);const n=[],s=new Set,r=l=>{if(!l||!l.startsWith("http"))return;const d=l.split("#")[0];i&&d.replace(/\/$/,"")===i.replace(/\/$/,"")||s.has(d)||(s.add(d),n.push(l))};for(const l of["cpsv:hasOtherElectronicChannel","cpsv:hasChannel"])for(const d of S(e[l])){const p=t.get(d);if(!p){d.startsWith("http")&&!d.includes("#")&&r(d);continue}const h=p["foaf:page"];typeof h=="string"?r(h):h!=null&&h["@id"]&&r(h["@id"])}return{sheetUrl:i,applicationUrls:n}}function ni(e,t){const i=e["@graph"]||[],o=new Map;for(const c of i)c&&c["@id"]&&o.set(String(c["@id"]),c);const n=new Map;for(const c of i)c&&(P(c,"PublicOrganisation")||P(c,"cv:PublicOrganisation"))&&n.set(c["@id"],{id:c["@id"],title:m(c["dct:title"])||c["@id"],homepage:typeof c["foaf:homepage"]=="string"?c["foaf:homepage"]:null});const s=[];for(const c of i){if(!c||!P(c,"PublicService"))continue;const _=S(c["cv:hasCompetentAuthority"]||c["cpsv:producedBy"])[0]||null,C=_?n.get(_):null,he=S(c["cpsv:isPartOfEvent"]),ge=S(c["cpsv:hasTheme"]),We=S(c["cpsv:hasInput"]),me=R(We,o),Ke=S(c["cpsv:hasProcessingTime"]),G=R(Ke,o).map(g=>{const w=g.duration?Qt(g.duration):null;return w&&g.text&&!g.text.includes(w)?{...g,text:`${g.text} (${w})`,durationLabel:w}:!g.text&&w?{...g,text:w,durationLabel:w}:{...g,durationLabel:w}}),ve=m(c["aci:processingTime"]);ve&&G.push({id:`${c["@id"]}#aci-time`,text:ve});const Ge=S(c["cpsv:hasOutput"]),be=R(Ge,o),ye=S(c["cv:addressee"]),D=R(ye,o);if(!D.length)for(const g of ye){const w=o.get(g),$e=m(w==null?void 0:w["dct:title"])||m(w==null?void 0:w["skos:prefLabel"]);$e?D.push({id:g,text:$e}):g.includes("#addressee-")&&D.push({id:g,text:decodeURIComponent(g.split("#addressee-").pop())})}const we=ii(c,o),{sheetUrl:q,applicationUrls:U}=oi(c,o),Je=[q,...U].filter(Boolean),Ye=$(m(c["dct:title"])||m(c["cpsv:name"]))||"Servizio",Ee=m(c["dct:description"]),Ce=$(Ee),Ze=$(m(c["dct:abstract"]))||Ce;s.push({id:c["@id"],title:Ye,description:Ce,descriptionHtml:Ee,abstract:Ze,orgId:_,orgTitle:(C==null?void 0:C.title)||null,lifeEventIds:he,themeIds:ge,lifeEventLabels:he.map(g=>t.lifeEvents[g]||g.split("/").pop()),themeLabels:ge.map(g=>t.themes[g]||`Tema ${g.split("/").pop()}`),addressees:D,inputs:me,outputs:be,processingTimes:G,cost:we,sheetUrl:q,applicationUrls:U,onlineUrls:Je,hasOnlineChannel:U.length>0,pageUrl:q||c["@id"],flags:{hasInput:me.length>0,hasOutput:be.length>0,hasTime:G.length>0,hasCost:!!we,hasOnline:U.length>0,hasSheet:!!q}})}s.sort((c,f)=>c.title.localeCompare(f.title,"it"));const r=[...n.values()].sort((c,f)=>c.title.localeCompare(f.title,"it")),a=new Map,l=new Map;for(const c of s){for(const f of c.lifeEventIds)a.set(f,(a.get(f)||0)+1);for(const f of c.themeIds)l.set(f,(l.get(f)||0)+1)}const d=[...a.entries()].map(([c,f])=>({id:c,label:t.lifeEvents[c]||c.split("/").pop(),count:f})).sort((c,f)=>c.label.localeCompare(f.label,"it")),p=[...l.entries()].map(([c,f])=>({id:c,label:t.themes[c]||`Tema ${c.split("/").pop()}`,count:f})).sort((c,f)=>c.label.localeCompare(f.label,"it")),h=pe(e["cpsv-portalone:sourceCatalogs"]).map(c=>({id:c==null?void 0:c["@id"],title:m(c==null?void 0:c["dct:title"])||(c==null?void 0:c["@id"])}));return{services:s,orgsById:n,nodesById:o,facets:{orgs:r,lifeEvents:d,themes:p},meta:{title:"Catalogo dei servizi della PA",modified:e["dct:modified"]||null,sources:h,count:s.length}}}function Ve(e){const t=Array.isArray(e==null?void 0:e["@graph"])?e["@graph"]:[],i=new Map;for(const s of t)s!=null&&s["@id"]&&i.set(String(s["@id"]),s);const o=s=>{const r=[],a=l=>{if(!(!l||typeof l!="object")){if(Array.isArray(l)){l.forEach(a);return}typeof l["@id"]=="string"&&r.push(l["@id"]);for(const[d,p]of Object.entries(l))d==="@id"||d==="@context"||a(p)}};for(const[l,d]of Object.entries(s))l==="@id"||l==="@context"||a(d);return r},n=[];for(const s of t){if(!s||!P(s,"PublicService"))continue;const r=[],a=new Set,l=[s];for(;l.length;){const p=l.pop(),h=p!=null&&p["@id"]?String(p["@id"]):null;if(!(h&&a.has(h))){h&&a.add(h),r.push(p);for(const c of o(p)){if(a.has(c))continue;const f=i.get(c);!f||f!==s&&P(f,"PublicService")||l.push(f)}}}const d=$(m(s["dct:title"])||m(s["cpsv:name"]))||s["@id"]||"Servizio";n.push({id:s["@id"]||d,title:d,json:JSON.stringify({"@context":e["@context"],"@graph":r},null,2)})}return n.sort((s,r)=>s.title.localeCompare(r.title,"it")),n}function si(e,t){const i=(t.q||"").trim().toLocaleLowerCase("it");return e.filter(o=>!(t.org&&o.orgId!==t.org||t.lifeEvent&&!o.lifeEventIds.includes(t.lifeEvent)||t.theme&&!o.themeIds.includes(t.theme)||t.onlineOnly&&!o.flags.hasOnline||i&&!`${o.title} ${o.abstract||""} ${o.orgTitle||""}`.toLocaleLowerCase("it").includes(i)))}const ae=24,Q="Catalogo dei servizi della PA",ri="Trova e consulta i servizi digitali della Pubblica Amministrazione";function ai({catalogUrl:e,meta:t,error:i,detail:o=null,filters:n=null,view:s="list"}){const r=u(E({catalog:W(e),path:"/",filters:n})),a=u(E({catalog:W(e),path:"/cpsv",filters:n})),l=t?`${t.count} serviz${t.count===1?"io":"i"} disponibili`:"Caricamento…";return`
<a class="visually-hidden-focusable" href="#main">Vai al contenuto</a>
<header class="it-header-wrapper it-header-sticky" data-bs-toggle="sticky" data-bs-position-type="fixed" data-bs-target="#sticky-trigger" data-bs-sticky-class-name="is-sticky">
  <div class="it-nav-wrapper">
    <div class="it-header-center-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="it-header-center-content-wrapper">
              <div class="it-brand-wrapper">
                <a href="${r}" aria-label="${u(Q)} — torna all’elenco">
                  <div class="it-brand-text">
                    <div class="it-brand-title">${u(Q)}</div>
                    <div class="it-brand-tagline d-none d-md-block">${u(ri)}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  ${o?li(o,{homeHref:r,catalogUrl:e}):""}
  <div id="sticky-trigger" class="sticky-trigger" aria-hidden="true"></div>
</header>

<main id="main" class="container my-4 mb-5">
  ${i?`<div class="alert alert-danger" role="alert">
          <h2 class="alert-heading h5">Non è stato possibile caricare il catalogo</h2>
          <p class="mb-0">${u(i)}</p>
        </div>`:""}
  ${pi(e,s,o)}
  ${s==="list"&&!o?`<p class="text-secondary mb-2">${u(l)}</p>
         <p class="mb-4"><a href="${a}">Cos’è CPSV</a></p>`:""}
  <div id="view-root"></div>
</main>

<footer class="it-footer">
  <div class="it-footer-main">
    <div class="container py-4">
      <h2 class="h5 mb-2">${u(Q)}</h2>
      <p class="mb-2">
        <a href="${a}"${s==="cpsv"?' aria-current="page"':""}>Cos’è CPSV</a>
      </p>
      <p class="mb-0">
        Le informazioni mostrate derivano dalle schede pubbliche degli enti erogatori.
        Se un dettaglio (tempi, costi, documenti) non compare, non è disponibile nella fonte.
      </p>
    </div>
  </div>
</footer>
`}function li(e,{homeHref:t,catalogUrl:i=null}){var l;const o=e.sheetUrl||e.pageUrl,n=o?`<a
        class="btn btn-light btn-lg service-sheet-cta"
        href="${u(o)}"
        rel="noopener noreferrer"
        target="_blank"
      >
        Vai al servizio
        ${di()}
        <span class="visually-hidden">(si apre in un altro sito)</span>
      </a>`:'<p class="small mb-0 service-header-muted">Scheda ufficiale non indicata nel catalogo.</p>',s=ci(i,e.id),r=`
    <div class="d-flex flex-column gap-2 align-items-lg-end">
      ${n}
      <div class="d-flex flex-wrap gap-2 justify-content-lg-end">
        <a class="btn btn-outline-light btn-sm" href="${u(s)}">Modifica in editor</a>
        <button type="button" class="btn btn-outline-light btn-sm" data-download-scheda="${u(e.id)}">
          Scarica scheda JSON-LD
        </button>
      </div>
    </div>`,a=((l=e.lifeEventIds)==null?void 0:l.length)>0?`<div class="service-header-pills mt-3" role="list" aria-label="Momenti della vita">
          ${e.lifeEventIds.map((d,p)=>{var c;const h=((c=e.lifeEventLabels)==null?void 0:c[p])||d;return`<a class="service-header-pill" role="listitem" href="${u(d)}" target="_blank" rel="noopener noreferrer">${u(h)}<span class="visually-hidden"> (scheda vocabolario)</span></a>`}).join("")}
        </div>`:"";return`
<div class="service-header">
  <div class="container py-4">
    <nav class="breadcrumb-container mb-3" aria-label="Sei qui">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="${t}">Catalogo</a><span class="separator" aria-hidden="true">/</span></li>
        <li class="breadcrumb-item active" aria-current="page">${u(F(e.title,64))}</li>
      </ol>
    </nav>
    <div class="row align-items-start g-3">
      <div class="col-lg-8">
        <p class="service-header-org mb-1">${u(e.orgTitle||"Ente erogatore")}</p>
        <h1 class="service-header-title mb-0">${u(e.title)}</h1>
        ${a}
      </div>
      <div class="col-lg-4 d-flex justify-content-lg-end align-items-start">
        ${r}
      </div>
    </div>
  </div>
</div>`}function ci(e,t){const i=new URL("../scheda-cpsv.html",window.location.href);if(e){const o=new URL(e,window.location.href).href;i.searchParams.set("catalog",o)}return t&&i.searchParams.set("service",t),i.href}function di(){return`<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M21 3v6h-1V4.7l-7.6 7.7-.8-.8L19.3 4H15V3h6zm-4 16.5c0 .3-.2.5-.5.5h-12c-.3 0-.5-.2-.5-.5v-12c0-.3.2-.5.5-.5H12V6H4.5C3.7 6 3 6.7 3 7.5v12c0 .8.7 1.5 1.5 1.5h12c.8 0 1.5-.7 1.5-1.5V12h-1v7.5z"/>
  </svg>`}function W(e){return!e||e==="./cpsv_full.jsonld"?null:e}function ui(e){return ue.find(t=>t.url===e)||null}function pi(e,t,i){if(t!=="list"||i)return"";const o=ui(e);if(!o)return"";const n=u(E({path:"/"}));return`
<div class="alert alert-info" role="status">
  <p class="mb-0">
    Stai consultando il CPSV di <strong>${u(o.name)}</strong>.
    <a href="${n}">Torna al catalogo completo</a>.
  </p>
</div>`}function fi(e){if(!e)return"Ente";const t=String(e).match(/\b(ACI|INPS|AdE|INAIL|ANPR|MIT|Agenzia delle Entrate|Motorizzazione)\b/i);if(!t)return F(e,36);const i=t[1];return/agenzia delle entrate/i.test(e)?"Agenzia delle Entrate":/motorizzazione/i.test(e)?"Motorizzazione":/anpr/i.test(e)?"ANPR":(i.toUpperCase()===i||i.length<=5,i)}function ee({id:e,name:t,label:i,optionsHtml:o,value:n}){return`
<div class="mb-3">
  <label class="form-label" for="${u(e)}">${u(i)}</label>
  <select class="form-select" id="${u(e)}" name="${u(t)}">
    ${o}
  </select>
</div>`}function hi({index:e,filterState:t}){const{facets:i}=e,o=['<option value="">Tutti gli enti</option>',...i.orgs.map(r=>`<option value="${u(r.id)}" ${t.org===r.id?"selected":""}>${u(r.title)}</option>`)].join(""),n=['<option value="">Tutte le fasi</option>',...i.lifeEvents.map(r=>`<option value="${u(r.id)}" ${t.lifeEvent===r.id?"selected":""}>${u(r.label)}</option>`)].join(""),s=['<option value="">Tutti i temi</option>',...i.themes.map(r=>`<option value="${u(r.id)}" ${t.theme===r.id?"selected":""}>${u(r.label)}</option>`)].join("");return`
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
        ${ee({id:"filter-org",name:"org",label:"Ente erogatore",optionsHtml:o,value:t.org})}
        ${ee({id:"filter-le",name:"lifeEvent",label:"Momento della vita",optionsHtml:n,value:t.lifeEvent})}
        ${ee({id:"filter-theme",name:"theme",label:"Argomento",optionsHtml:s,value:t.theme})}
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
`}function gi(e,{catalogUrl:t,page:i,filterState:o={}}){const n=W(t),s=(i-1)*ae,r=e.slice(s,s+ae);return r.length?r.map(a=>{const l=E({catalog:n,path:`/servizio/${encodeURIComponent(a.id)}`,filters:{...o,page:i}}),d=fi(a.orgTitle),p=a.lifeEventIds[0]||"",h=a.lifeEventLabels[0]?F(a.lifeEventLabels[0],40):null,c=o.org&&o.org===a.orgId,f=o.lifeEvent&&o.lifeEvent===p,_=a.orgId?`<button
            type="button"
            class="chip chip-simple ${c?"chip-filter-active":""}"
            data-filter-org="${u(a.orgId)}"
            aria-pressed="${c?"true":"false"}"
            title="Filtra per ${u(d)}"
          ><span class="chip-label">${u(d)}</span></button>`:"",C=p?`<button
            type="button"
            class="chip chip-simple ${f?"chip-filter-active":""}"
            data-filter-life-event="${u(p)}"
            aria-pressed="${f?"true":"false"}"
            title="Filtra per questo momento della vita"
          ><span class="chip-label">${u(h)}</span></button>`:"";return`
<div class="col-md-6">
  <div class="card-wrapper card-space h-100">
    <div class="card card-bg no-after h-100 border">
      <div class="card-body d-flex flex-column">
        <div class="chip-list mb-3" role="group" aria-label="Filtri rapidi">
          ${_}
          ${C}
        </div>
        <h3 class="card-title h5">
          <a href="${u(l)}">${u(a.title)}</a>
        </h3>
        <p class="card-text mb-4">
          ${u(F(a.abstract||"Descrizione non disponibile per questo servizio.",180))}
        </p>
        <div class="mt-auto">
          <a class="btn btn-outline-primary btn-sm" href="${u(l)}">
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
</div>`}function mi(e,t,{catalogUrl:i,filterState:o={}}={}){const n=Math.max(1,Math.ceil(e/ae));if(n<=1)return"";const s=W(i),r=[];for(let a=1;a<=n;a++){const l=E({catalog:s,path:"/",filters:{...o,page:a}});r.push(`<li class="page-item ${a===t?"active":""}">
        <a class="page-link" href="${u(l)}" data-page="${a}" ${a===t?'aria-current="page"':""}>${a}</a>
      </li>`)}return`<ul class="pagination justify-content-center">${r.join("")}</ul>`}function vi(e){var i;const t=[];if(e.addressees.length&&t.push(A("A chi è rivolto",H(e.addressees))),e.inputs.length&&t.push(A("Cosa serve",H(e.inputs))),e.processingTimes.length&&t.push(A("Tempi",H(e.processingTimes))),e.cost&&t.push(A("Costi",se(e.cost))),e.outputs.length&&t.push(A("Cosa si ottiene",H(e.outputs))),(i=e.themeIds)!=null&&i.length){const o=`<ul class="list-unstyled mb-0">${e.themeIds.map((n,s)=>{var a;const r=((a=e.themeLabels)==null?void 0:a[s])||n;return`<li class="mb-2"><a href="${u(n)}" target="_blank" rel="noopener noreferrer">${u(r)}<span class="visually-hidden"> (scheda vocabolario)</span></a></li>`}).join("")}</ul>`;t.push(A("Temi",o))}return`
${e.description?`<div class="font-serif service-description">${se(e.descriptionHtml||e.description)}</div>`:'<p class="text-secondary">Descrizione non disponibile per questo servizio.</p>'}
<div class="mt-4">
  ${t.join("")||'<p class="text-secondary">Non ci sono altri dettagli disponibili nella scheda pubblica.</p>'}
</div>
`}function A(e,t){return`
<section class="mb-4 pb-3 border-bottom">
  <h2 class="h4">${u(e)}</h2>
  ${t}
</section>`}function H(e){return e.map(t=>{const i=t.typeId&&t.typeLabel?`<p class="small text-secondary mb-1"><strong>Tipo:</strong> <a href="${u(t.typeId)}" target="_blank" rel="noopener noreferrer">${u(t.typeLabel)}<span class="visually-hidden"> (scheda vocabolario)</span></a></p>`:t.typeLabel?`<p class="small text-secondary mb-1"><strong>Tipo:</strong> ${u(t.typeLabel)}</p>`:"",o=se(t.html||t.text);return`<div class="mb-3 service-block-text">${i}${o}</div>`}).join("")}const bi=`{
  "@context": {
    "cpsv": "https://w3id.org/italia/onto/CPSV/",
    "cov": "https://w3id.org/italia/onto/COV/",
    "l0": "https://w3id.org/italia/onto/l0/",
    "dct": "http://purl.org/dc/terms/",
    "foaf": "http://xmlns.com/foaf/0.1/",
    "ex": "https://comune.vallefiume.example/",
    "srv": "https://comune.vallefiume.example/servizi/certificato-di-residenza#",
    "life": "https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/",
    "theme": "https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/",
    "dct:title": { "@container": "@language" },
    "dct:description": { "@container": "@language" },
    "cov:hasPublicOrganization": { "@type": "@id" },
    "cpsv:hasInput": { "@type": "@id" },
    "cpsv:hasOutput": { "@type": "@id" },
    "cpsv:hasProcessingTime": { "@type": "@id" },
    "cpsv:hasWebSiteChannel": { "@type": "@id" },
    "cpsv:isPartOfEvent": { "@type": "@id" },
    "cpsv:hasTheme": { "@type": "@id" },
    "foaf:page": { "@type": "@id" }
  },
  "@graph": [
    {
      "@id": "ex:servizi/certificato-di-residenza",
      "@type": "cpsv:PublicService",
      "dct:title": { "it": "Certificato di residenza" },
      "dct:description": { "it": "Attesta l’indirizzo di residenza anagrafica di una persona iscritta nel comune." },
      "cov:hasPublicOrganization": "ex:ente",
      "cpsv:hasInput": "srv:documento",
      "cpsv:hasOutput": "srv:certificato",
      "cpsv:hasProcessingTime": "srv:tempo",
      "cpsv:hasWebSiteChannel": "srv:canale",
      "cpsv:isPartOfEvent": "life:9",
      "cpsv:hasTheme": "theme:9"
    },
    {
      "@id": "ex:ente",
      "@type": "cov:PublicOrganization",
      "dct:title": { "it": "Comune di Vallefiume" }
    },
    {
      "@id": "srv:cittadino",
      "@type": "l0:Agent",
      "dct:title": { "it": "Cittadino" }
    },
    {
      "@id": "srv:documento",
      "@type": "cpsv:Input",
      "dct:description": { "it": "Documento di identità" }
    },
    {
      "@id": "srv:certificato",
      "@type": "cpsv:Output",
      "dct:description": { "it": "Certificato di residenza" }
    },
    {
      "@id": "srv:tempo",
      "@type": "cpsv:ServiceProcessingTime",
      "dct:description": { "it": "Entro 2 giorni lavorativi" }
    },
    {
      "@id": "srv:canale",
      "@type": "cpsv:WebSiteChannel",
      "dct:title": { "it": "Sportello online del comune" },
      "foaf:page": "ex:anagrafe/certificato-residenza"
    }
  ]
}`;function yi({homeHref:e,catalogUrl:t}){const i=u(e);return`
<article class="cpsv-page">
  <nav class="breadcrumb-container mb-3" aria-label="Sei qui">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="${i}">Catalogo</a><span class="separator" aria-hidden="true">/</span></li>
      <li class="breadcrumb-item active" aria-current="page">Cos’è CPSV</li>
    </ol>
  </nav>

  <h1 class="mb-4">Cos’è CPSV</h1>

  <section class="cpsv-prose mb-5" aria-labelledby="cpsv-semantica">
    <h2 class="h3" id="cpsv-semantica">Cos’è la semantica</h2>
    <p>
      La semantica è il significato dei dati, non la forma con cui compaiono sulla pagina.
      La frase «il certificato costa 16 euro e arriva in due giorni» è un paragrafo:
      una persona la capisce, un programma no, se non gliela si rispiega ogni volta.
    </p>
    <p>
      Se quello stesso fatto è marcato come costo e come tempo di un servizio,
      il dato può essere letto da questo catalogo, da un altro sito o da un assistente,
      senza reinterpretare il testo.
    </p>
  </section>

  <section class="cpsv-prose mb-4" aria-labelledby="cpsv-vocabolario">
    <h2 class="h3" id="cpsv-vocabolario">Cos’è CPSV</h2>
    <p>
      CPSV-AP_IT, Core Public Service Vocabulary nel profilo italiano, è il vocabolario
      condiviso per descrivere un servizio pubblico. Ogni servizio ha gli stessi pezzi:
      chi lo eroga, a chi è rivolto, che cosa serve per chiederlo, che cosa si ottiene,
      in quanto tempo, da quale canale, in quale momento della vita e sotto quale tema.
    </p>
    <p>
      Questo catalogo legge proprio quelle relazioni. Il disegno qui sotto è il modello,
      non l’insieme delle schede pubblicate.
    </p>
  </section>

  <figure class="cpsv-graph mb-3">
    ${$i()}
    <figcaption class="cpsv-prose mt-3">
      Titolo, descrizione e pagina (<code>dct:title</code>, <code>dct:description</code>,
      <code>foaf:page</code>) sono informazioni scritte sui nodi, non classi a sé.
      I due canali online stanno nello stesso riquadro: la scheda sul sito dell’ente
      e, quando c’è, l’accesso all’applicazione.
    </figcaption>
  </figure>

  <section class="cpsv-prose mb-5" aria-labelledby="cpsv-legami">
    <h2 class="h4" id="cpsv-legami">Gli stessi legami, in testo</h2>
    <ul>
      <li>Un servizio è erogato da un ente: <code>cov:hasPublicOrganization</code> verso <code>cov:PublicOrganization</code>.</li>
      <li>Si rivolge a qualcuno: la classe italiana è <code>l0:Agent</code>.</li>
      <li>Per chiederlo serve qualcosa: <code>cpsv:hasInput</code> verso <code>cpsv:Input</code>.</li>
      <li>Produce un risultato: <code>cpsv:hasOutput</code> verso <code>cpsv:Output</code>.</li>
      <li>Si apre da una pagina: <code>cpsv:hasWebSiteChannel</code> verso <code>cpsv:WebSiteChannel</code>.</li>
      <li>O da un altro accesso online: <code>cpsv:hasOtherElectronicChannel</code> verso <code>cpsv:OtherElectronicChannel</code>.</li>
      <li>Rientra in un momento della vita: <code>cpsv:isPartOfEvent</code>.</li>
      <li>Rientra in un tema: <code>cpsv:hasTheme</code>.</li>
    </ul>
  </section>

  <section class="cpsv-prose" aria-labelledby="cpsv-caso">
    <h2 class="h3" id="cpsv-caso">Un caso d’uso</h2>
    <p>
      Giulia si trasferisce e le serve il certificato di residenza.
      Il comune, se descrive il servizio con CPSV, non scrive solo un testo:
      compila gli stessi nodi del grafo. Il servizio qui sotto è inventato,
      del Comune di Vallefiume, e non compare nell’elenco.
    </p>
    <div class="alert alert-info" role="note">
      <p class="mb-0">Esempio inventato. Non è una scheda di questo catalogo.</p>
    </div>
    <dl class="cpsv-instance">
      <div>
        <dt>Servizio pubblico</dt>
        <dd>Certificato di residenza</dd>
      </div>
      <div>
        <dt>Ente</dt>
        <dd>Comune di Vallefiume</dd>
      </div>
      <div>
        <dt>Destinatario</dt>
        <dd>Cittadino</dd>
      </div>
      <div>
        <dt>Che cosa serve</dt>
        <dd>Documento di identità</dd>
      </div>
      <div>
        <dt>Che cosa si ottiene</dt>
        <dd>Certificato di residenza</dd>
      </div>
      <div>
        <dt>Tempo</dt>
        <dd>Entro 2 giorni lavorativi</dd>
      </div>
      <div>
        <dt>Canale</dt>
        <dd>Sportello online del comune</dd>
      </div>
      <div>
        <dt>Momento della vita</dt>
        <dd>Cambio di residenza o domicilio</dd>
      </div>
      <div>
        <dt>Tema</dt>
        <dd>Anagrafe e residenza</dd>
      </div>
    </dl>
    <p>
      Il tempo è collegato al servizio con <code>cpsv:hasProcessingTime</code>:
      nel disegno non è una classe a sé, come non lo sono titolo e descrizione.
      Momento della vita e tema usano i vocabolari già usati da questo sito.
      Il servizio, l’ente e il canale sono invece inventati:
      gli indirizzi stanno su <code>comune.vallefiume.example</code>.
    </p>
    <h3 class="h4">Lo stesso caso in JSON-LD</h3>
    <p>
      I prefissi del contesto accorciano gli indirizzi.
      <code>cpsv</code>, <code>cov</code> e <code>l0</code> sono le ontologie pubblicate su
      <a href="https://schema.gov.it/lodview/onto/CPSV" rel="noopener noreferrer">schema.gov.it</a>:
      il servizio, l’organizzazione pubblica e l’agente.
      <code>ex</code> è il comune inventato, <code>srv</code> sono i pezzi di questo servizio,
      <code>life</code> e <code>theme</code> sono i vocabolari già usati dal catalogo.
      I legami puntano a un identificativo, quindi si scrivono <code>ex:ente</code>
      e non l’indirizzo per intero. I testi in italiano stanno come <code>{ "it": "…" }</code>.
      <code>m8g</code> non compare: è solo il codice con cui l’Unione europea pubblica
      lo stesso tipo di ente (<code>http://data.europa.eu/m8g/</code>). I file di questo
      catalogo usano ancora quel nome europeo, <code>cv:hasCompetentAuthority</code>.
      Il cittadino è un <code>l0:Agent</code> nello stesso grafo: su schema.gov.it non c’è
      una proprietà unica «destinatario», quindi il nodo c’è e non è appeso al servizio
      con il nome europeo <code>cv:addressee</code>.
    </p>
    <pre class="cpsv-code"><code>${u(bi)}</code></pre>
    <p>
      Nell’elenco, il filtro Ente segue l’ente competente, Momento della vita segue l’evento
      e Argomento segue il tema. Sono le stesse frecce del grafo, applicate alle schede vere.
    </p>
    <p><a href="${i}">Vai al catalogo</a></p>
  </section>
  ${wi()}
</article>`}function wi(){return`
<section class="mt-5" aria-labelledby="cpsv-enti">
  <div class="cpsv-prose">
    <h2 class="h3" id="cpsv-enti">I cataloghi degli enti</h2>
    <p>
      Il catalogo completo unisce i CPSV di questi enti.
      Aprine uno per leggere il JSON-LD di ogni servizio.
    </p>
  </div>
  <ul class="cpsv-sources">
    ${[{name:"Catalogo completo",href:E({path:"/jsonld"}),action:"Vedi il JSON-LD"},...ue.map(t=>({name:t.name,href:E({catalog:t.url,path:"/jsonld"}),action:"Vedi il JSON-LD"}))].map(t=>`
    <li>
      <a class="cpsv-source" href="${u(t.href)}">
        <span class="cpsv-source-name">${u(t.name)}</span>
        <span class="cpsv-source-action">${u(t.action)}</span>
      </a>
    </li>`).join("")}
  </ul>
</section>`}function Ei({title:e,cpsvHref:t,servicesHref:i,fileUrl:o}){return`
<article class="cpsv-json-page">
  <nav class="breadcrumb-container mb-3" aria-label="Sei qui">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="${u(t)}">Cos’è CPSV</a><span class="separator" aria-hidden="true">/</span></li>
      <li class="breadcrumb-item active" aria-current="page">${u(e)}</li>
    </ol>
  </nav>
  <h1 class="h2 mb-3">${u(e)}</h1>
  <p class="cpsv-json-actions mb-3">
    <a href="${u(i)}">Vedi i servizi</a>
    <a href="${u(o)}" download>Scarica il file intero</a>
  </p>
  <div id="cpsv-json-services">
    <p>Caricamento del JSON-LD…</p>
  </div>
</article>`}function Ci(e){return e.length?`
<p class="text-secondary mb-3">${e.length} serviz${e.length===1?"io":"i"}. Ogni blocco è il JSON-LD di un servizio, con i nodi a cui è collegato.</p>
${e.map(t=>`
<details class="cpsv-service-json">
  <summary>
    <span class="cpsv-service-title">${u(t.title)}</span>
    <a class="cpsv-playground" href="https://json-ld.org/playground/" target="_blank" rel="noopener noreferrer">Apri nel JSON-LD Playground</a>
  </summary>
  <pre class="cpsv-code"><code>${u(t.json)}</code></pre>
</details>`).join("")}`:'<p class="alert alert-info">In questo catalogo non ci sono servizi.</p>'}function $i(){const e=(i,o,n,s,r,a,l=!1)=>{const d=l?"#fff":"#17324d",p=l?"#d6e8fa":"#5c6f82";return`
      <rect x="${i}" y="${o}" width="${n}" height="${s}" rx="8" fill="${l?"#0066cc":"#fff"}" stroke="#0066cc" stroke-width="2"/>
      <text x="${i+n/2}" y="${o+30}" text-anchor="middle" font-size="16" font-weight="700" fill="${d}">${u(r)}</text>
      <text x="${i+n/2}" y="${o+52}" text-anchor="middle" font-size="13" fill="${p}">${u(a)}</text>`},t=(i,o,n)=>{const s=Math.max(...n.map(d=>d.length))*6.6+12,r=n.length*16+8,a=i-s/2,l=o-14;return`
      <rect x="${a}" y="${l}" width="${s}" height="${r}" fill="#fff"/>
      ${n.map((d,p)=>`<text x="${i}" y="${o+p*16}" text-anchor="middle" font-size="12" fill="#17324d">${u(d)}</text>`).join("")}`};return`
<svg class="cpsv-graph-svg" viewBox="0 0 1100 700" role="img" aria-labelledby="cpsv-graph-title">
  <title id="cpsv-graph-title">Grafo delle classi CPSV-AP_IT usate dal catalogo</title>
  <g stroke="#5c6f82" stroke-width="1.5" fill="none">
    <line x1="180" y1="96" x2="470" y2="250"/>
    <line x1="920" y1="96" x2="630" y2="250"/>
    <line x1="266" y1="290" x2="430" y2="290"/>
    <line x1="670" y1="290" x2="834" y2="290"/>
    <line x1="500" y1="330" x2="180" y2="530"/>
    <line x1="550" y1="330" x2="550" y2="500"/>
    <line x1="600" y1="330" x2="920" y2="530"/>
  </g>
  ${t(330,148,["cov:hasPublicOrganization"])}
  ${t(790,148,["destinatario"])}
  ${t(348,272,["cpsv:hasInput"])}
  ${t(752,272,["cpsv:hasOutput"])}
  ${t(250,455,["cpsv:isPartOfEvent"])}
  ${t(550,400,["cpsv:hasWebSiteChannel","cpsv:hasOtherElectronicChannel"])}
  ${t(820,455,["cpsv:hasTheme"])}
  ${e(430,250,240,80,"Servizio pubblico","cpsv:PublicService",!0)}
  ${e(40,24,280,72,"Ente","cov:PublicOrganization")}
  ${e(780,24,280,72,"Destinatario","l0:Agent")}
  ${e(16,254,250,72,"Che cosa serve","cpsv:Input")}
  ${e(834,254,250,72,"Che cosa si ottiene","cpsv:Output")}
  ${e(40,530,280,72,"Momento della vita","evento di vita")}
  <rect x="410" y="500" width="280" height="96" rx="8" fill="#fff" stroke="#0066cc" stroke-width="2"/>
  <text x="550" y="530" text-anchor="middle" font-size="16" font-weight="700" fill="#17324d">Canali</text>
  <text x="550" y="552" text-anchor="middle" font-size="13" fill="#5c6f82">cpsv:WebSiteChannel</text>
  <text x="550" y="572" text-anchor="middle" font-size="13" fill="#5c6f82">cpsv:OtherElectronicChannel</text>
  ${e(780,530,280,72,"Tema","classificazione")}
</svg>`}ei({...kt,...jt});const Si={lifeEvents:Nt,themes:Pt},V=document.getElementById("app");function T(e){var o;const t=V.querySelector("header[data-bs-toggle='sticky']");t&&((o=j.getInstance(t))==null||o.dispose()),V.innerHTML=ai(e);const i=V.querySelector("header[data-bs-toggle='sticky']");i&&j.getOrCreateInstance(i),xi()}function xi(){const e=V.querySelector("[data-download-scheda]");!e||!(v!=null&&v.doc)||e.addEventListener("click",()=>{const t=e.getAttribute("data-download-scheda"),o=Ve(v.doc).find(l=>l.id===t);if(!o){window.alert("Impossibile estrarre la scheda JSON-LD di questo servizio.");return}const n=new Blob([o.json],{type:"application/ld+json"}),s=URL.createObjectURL(n),r=document.createElement("a");r.href=s;const a=String(o.title||"scheda").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60);r.download=`scheda-${a||"cpsv"}.jsonld`,r.click(),URL.revokeObjectURL(s)})}let v=null,b={q:"",org:"",lifeEvent:"",theme:"",onlineOnly:!1},I=1,te=0;function k(e){return!e||e===Ue?null:e}async function Ii(e){const t=Re(e);if(v&&v.docUrl===t)return v;const i=++te;T({catalogUrl:t,meta:null,error:null});const o=document.getElementById("view-root");o&&(o.innerHTML='<p class="text-muted" role="status">Caricamento catalogo…</p>');try{const{doc:n,url:s}=await Zt(t);return i!==te||(v={docUrl:s,doc:n,index:ni(n,Si)}),v}catch(n){if(i!==te)return null;v=null,T({catalogUrl:t,meta:null,error:n.message||String(n)});const s=document.getElementById("view-root");return s&&(s.innerHTML=`
        <div class="alert alert-warning" role="alert">
          <h2 class="h5">Catalogo non disponibile</h2>
          <p>Riprova tra poco oppure torna all’elenco principale.</p>
          <p class="mb-0"><a class="btn btn-primary btn-sm" href="${E({catalog:k(t),path:"/",filters:fe()})}">Torna al catalogo</a></p>
        </div>`),null}}function fe(){return{q:b.q,org:b.org,lifeEvent:b.lifeEvent,theme:b.theme,page:I}}function _i(e){b={q:(e==null?void 0:e.q)||"",org:(e==null?void 0:e.org)||"",lifeEvent:(e==null?void 0:e.lifeEvent)||"",theme:(e==null?void 0:e.theme)||"",onlineOnly:!1},I=(e==null?void 0:e.page)>1?e.page:1}function K({replace:e}){v&&Wt({catalog:k(v.docUrl),path:"/",filters:fe()},{replace:e})}function le(){const e=document.getElementById("filter-q"),t=document.getElementById("filter-org"),i=document.getElementById("filter-le"),o=document.getElementById("filter-theme"),n=document.getElementById("filter-online");e&&(e.value=b.q||""),t&&(t.value=b.org||""),i&&(i.value=b.lifeEvent||""),o&&(o.value=b.theme||""),n&&(n.checked=!1)}function Ti(){var o,n;const e=document.getElementById("filters-form");if(!e)return;const t=({replace:s})=>{var r,a,l,d;b={q:((r=document.getElementById("filter-q"))==null?void 0:r.value)||"",org:((a=document.getElementById("filter-org"))==null?void 0:a.value)||"",lifeEvent:((l=document.getElementById("filter-le"))==null?void 0:l.value)||"",theme:((d=document.getElementById("filter-theme"))==null?void 0:d.value)||"",onlineOnly:!1},I=1,K({replace:s}),M()};e.addEventListener("change",s=>{var r;((r=s.target)==null?void 0:r.id)!=="filter-q"&&t({replace:!1})}),e.addEventListener("submit",s=>{s.preventDefault(),t({replace:!1})});let i;(o=document.getElementById("filter-q"))==null||o.addEventListener("input",()=>{clearTimeout(i),i=setTimeout(()=>t({replace:!0}),200)}),(n=document.getElementById("filters-reset"))==null||n.addEventListener("click",()=>{b={q:"",org:"",lifeEvent:"",theme:"",onlineOnly:!1},I=1,le(),K({replace:!1}),M()})}function zi(e){e&&(e.querySelectorAll("[data-filter-org]").forEach(t=>{t.addEventListener("click",i=>{var n;i.preventDefault(),i.stopPropagation();const o=t.getAttribute("data-filter-org")||"";b.org=b.org===o?"":o,I=1,le(),K({replace:!1}),M(),(n=document.getElementById("results-count"))==null||n.scrollIntoView({behavior:"smooth",block:"start"})})}),e.querySelectorAll("[data-filter-life-event]").forEach(t=>{t.addEventListener("click",i=>{var n;i.preventDefault(),i.stopPropagation();const o=t.getAttribute("data-filter-life-event")||"";b.lifeEvent=b.lifeEvent===o?"":o,I=1,le(),K({replace:!1}),M(),(n=document.getElementById("results-count"))==null||n.scrollIntoView({behavior:"smooth",block:"start"})})}))}function M(){if(!v)return;const e=si(v.index.services,b),t=document.getElementById("results-count"),i=document.getElementById("results-grid"),o=document.getElementById("pager");t&&(t.textContent=e.length===1?"1 servizio trovato":`${e.length} servizi trovati`),i&&(i.innerHTML=gi(e,{catalogUrl:v.docUrl,page:I,filterState:b}),zi(i)),o&&(o.innerHTML=mi(e.length,I,{catalogUrl:v.docUrl,filterState:b}))}function Ai(e){e.querySelectorAll(".cpsv-playground").forEach(t=>{t.addEventListener("click",i=>{var s,r;i.preventDefault(),i.stopPropagation();const o=(r=(s=t.closest("details"))==null?void 0:s.querySelector("code"))==null?void 0:r.textContent;if(!o)return;const n=new URLSearchParams;n.set("json-ld",o),n.set("startTab","tab-expanded"),window.open(`https://json-ld.org/playground/#${n.toString()}`,"_blank","noopener,noreferrer")})})}async function Fe(){const e=re(),t=(v==null?void 0:v.docUrl)||null;_i(e.filters);const i=await Ii(e.catalog);if(!i)return;const o=fe();if(e.view==="cpsv"){T({catalogUrl:i.docUrl,meta:i.index.meta,error:null,filters:o,view:"cpsv"});const s=document.getElementById("view-root");s&&(s.innerHTML=yi({homeHref:E({catalog:k(i.docUrl),path:"/",filters:o}),catalogUrl:i.docUrl})),window.scrollTo(0,0);return}if(e.view==="jsonld"){const s=ue.find(a=>a.url===i.docUrl);T({catalogUrl:i.docUrl,meta:i.index.meta,error:null,filters:o,view:"jsonld"});const r=document.getElementById("view-root");if(r){r.innerHTML=Ei({title:s?s.name:"Catalogo completo",cpsvHref:E({path:"/cpsv"}),servicesHref:E({catalog:k(i.docUrl),path:"/"}),fileUrl:i.docUrl});const a=document.getElementById("cpsv-json-services");try{const l=await fetch(i.docUrl,{credentials:"same-origin"});if(!l.ok)throw new Error(`HTTP ${l.status}`);const d=await l.json();a!=null&&a.isConnected&&(a.innerHTML=Ci(Ve(d)),Ai(a))}catch(l){if(a!=null&&a.isConnected){a.replaceChildren();const d=document.createElement("p");d.className="alert alert-warning",d.textContent=`Non è stato possibile leggere il JSON-LD (${l.message||l}).`,a.append(d)}}}window.scrollTo(0,0);return}if(e.view==="detail"){const s=i.index.services.find(a=>a.id===e.serviceId);if(!s){T({catalogUrl:i.docUrl,meta:i.index.meta,error:null,filters:o});const a=document.getElementById("view-root");a&&(a.innerHTML=`
          <div class="alert alert-warning" role="alert">
            Servizio non trovato in questo catalogo.
            <a href="${E({catalog:k(i.docUrl),path:"/",filters:o})}">Torna all’elenco</a>
          </div>`);return}T({catalogUrl:i.docUrl,meta:i.index.meta,error:null,detail:s,filters:o});const r=document.getElementById("view-root");r&&(r.innerHTML=vi(s)),window.scrollTo(0,0);return}T({catalogUrl:i.docUrl,meta:i.index.meta,error:null,filters:o,view:"list"});const n=document.getElementById("view-root");n&&(n.innerHTML=hi({index:i.index,filterState:b,catalogUrl:i.docUrl}),Ti(),M(),t&&t!==i.docUrl&&window.scrollTo(0,0))}window.addEventListener("hashchange",()=>{Fe()});Fe();
