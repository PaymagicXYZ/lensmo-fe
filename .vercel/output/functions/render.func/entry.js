import * as adapter from '@astrojs/vercel/serverless/entrypoint';
import React, { createElement } from 'react';
import ReactDOM from 'react-dom/server';
import { escape } from 'html-escaper';
/* empty css                                                               *//* empty css                        */import { optimize } from 'svgo';
/* empty css                                */import { ethers } from 'ethers';
import { ApolloClient, gql } from '@apollo/client/core/index.js';
import { InMemoryCache } from '@apollo/client/cache/index.js';
import { createClient } from '@supabase/supabase-js';
import 'mime';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import { compile } from 'path-to-regexp';

/**
 * Astro passes `children` as a string of HTML, so we need
 * a wrapper `div` to render that content as VNodes.
 *
 * As a bonus, we can signal to React that this subtree is
 * entirely static and will never change via `shouldComponentUpdate`.
 */
const StaticHtml = ({ value, name }) => {
	if (!value) return null;
	return createElement('astro-slot', {
		name,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: value },
	});
};

/**
 * This tells React to opt-out of re-rendering this subtree,
 * In addition to being a performance optimization,
 * this also allows other frameworks to attach to `children`.
 *
 * See https://preactjs.com/guide/v8/external-dom-mutations
 */
StaticHtml.shouldComponentUpdate = () => false;

const slotName$1 = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
const reactTypeof = Symbol.for('react.element');

function errorIsComingFromPreactComponent(err) {
	return (
		err.message &&
		(err.message.startsWith("Cannot read property '__H'") ||
			err.message.includes("(reading '__H')"))
	);
}

async function check$1(Component, props, children) {
	// Note: there are packages that do some unholy things to create "components".
	// Checking the $$typeof property catches most of these patterns.
	if (typeof Component === 'object') {
		const $$typeof = Component['$$typeof'];
		return $$typeof && $$typeof.toString().slice('Symbol('.length).startsWith('react');
	}
	if (typeof Component !== 'function') return false;

	if (Component.prototype != null && typeof Component.prototype.render === 'function') {
		return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
	}

	let error = null;
	let isReactComponent = false;
	function Tester(...args) {
		try {
			const vnode = Component(...args);
			if (vnode && vnode['$$typeof'] === reactTypeof) {
				isReactComponent = true;
			}
		} catch (err) {
			if (!errorIsComingFromPreactComponent(err)) {
				error = err;
			}
		}

		return React.createElement('div');
	}

	await renderToStaticMarkup$1(Tester, props, children, {});

	if (error) {
		throw error;
	}
	return isReactComponent;
}

async function getNodeWritable() {
	let nodeStreamBuiltinModuleName = 'stream';
	let { Writable } = await import(/* @vite-ignore */ nodeStreamBuiltinModuleName);
	return Writable;
}

async function renderToStaticMarkup$1(Component, props, { default: children, ...slotted }, metadata) {
	delete props['class'];
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		const name = slotName$1(key);
		slots[name] = React.createElement(StaticHtml, { value, name });
	}
	// Note: create newProps to avoid mutating `props` before they are serialized
	const newProps = {
		...props,
		...slots,
		children: children != null ? React.createElement(StaticHtml, { value: children }) : undefined,
	};
	const vnode = React.createElement(Component, newProps);
	let html;
	if (metadata && metadata.hydrate) {
		html = ReactDOM.renderToString(vnode);
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToPipeableStreamAsync(vnode);
		}
	} else {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToStaticNodeStreamAsync(vnode);
		}
	}
	return { html };
}

async function renderToPipeableStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let error = undefined;
		let stream = ReactDOM.renderToPipeableStream(vnode, {
			onError(err) {
				error = err;
				reject(error);
			},
			onAllReady() {
				stream.pipe(
					new Writable({
						write(chunk, _encoding, callback) {
							html += chunk.toString('utf-8');
							callback();
						},
						destroy() {
							resolve(html);
						},
					})
				);
			},
		});
	});
}

async function renderToStaticNodeStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve) => {
		let stream = ReactDOM.renderToStaticNodeStream(vnode);
		stream.pipe(
			new Writable({
				write(chunk, _encoding, callback) {
					html += chunk.toString('utf-8');
					callback();
				},
				destroy() {
					resolve(html);
				},
			})
		);
	});
}

/**
 * Use a while loop instead of "for await" due to cloudflare and Vercel Edge issues
 * See https://github.com/facebook/react/issues/24169
 */
async function readResult(stream) {
	const reader = stream.getReader();
	let result = '';
	const decoder = new TextDecoder('utf-8');
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			if (value) {
				result += decoder.decode(value);
			} else {
				// This closes the decoder
				decoder.decode(new Uint8Array());
			}

			return result;
		}
		result += decoder.decode(value, { stream: true });
	}
}

async function renderToReadableStreamAsync(vnode) {
	return await readResult(await ReactDOM.renderToReadableStream(vnode));
}

const _renderer1 = {
	check: check$1,
	renderToStaticMarkup: renderToStaticMarkup$1,
};

const ASTRO_VERSION = "1.1.8";
function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape;
class HTMLString extends String {
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};

class Metadata {
  constructor(filePathname, opts) {
    this.modules = opts.modules;
    this.hoisted = opts.hoisted;
    this.hydratedComponents = opts.hydratedComponents;
    this.clientOnlyComponents = opts.clientOnlyComponents;
    this.hydrationDirectives = opts.hydrationDirectives;
    this.mockURL = new URL(filePathname, "http://example.com");
    this.metadataCache = /* @__PURE__ */ new Map();
  }
  resolvePath(specifier) {
    if (specifier.startsWith(".")) {
      const resolved = new URL(specifier, this.mockURL).pathname;
      if (resolved.startsWith("/@fs") && resolved.endsWith(".jsx")) {
        return resolved.slice(0, resolved.length - 4);
      }
      return resolved;
    }
    return specifier;
  }
  getPath(Component) {
    const metadata = this.getComponentMetadata(Component);
    return (metadata == null ? void 0 : metadata.componentUrl) || null;
  }
  getExport(Component) {
    const metadata = this.getComponentMetadata(Component);
    return (metadata == null ? void 0 : metadata.componentExport) || null;
  }
  getComponentMetadata(Component) {
    if (this.metadataCache.has(Component)) {
      return this.metadataCache.get(Component);
    }
    const metadata = this.findComponentMetadata(Component);
    this.metadataCache.set(Component, metadata);
    return metadata;
  }
  findComponentMetadata(Component) {
    const isCustomElement = typeof Component === "string";
    for (const { module, specifier } of this.modules) {
      const id = this.resolvePath(specifier);
      for (const [key, value] of Object.entries(module)) {
        if (isCustomElement) {
          if (key === "tagName" && Component === value) {
            return {
              componentExport: key,
              componentUrl: id
            };
          }
        } else if (Component === value) {
          return {
            componentExport: key,
            componentUrl: id
          };
        }
      }
    }
    return null;
  }
}
function createMetadata(filePathname, options) {
  return new Metadata(filePathname, options);
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new Error(
              'Error: Media query must be provided for "client:media", similar to client:media="(max-width: 600px)"'
            );
          }
          break;
        }
      }
    } else if (key === "class:list") {
      extracted.props[key.slice(0, -5)] = serializeListValue(value);
    } else {
      extracted.props[key] = value;
    }
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = value;
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  island.props["before-hydration-url"] = await result.resolve("astro:scripts/before-hydration.js");
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t)},o=(t,i)=>{if(t===""||!Array.isArray(i))return i;const[e,n]=i;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const i=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const s of n){const r=s.closest(this.tagName);!r||!r.isSameNode(this)||(e[s.getAttribute("data-astro-template")||"default"]=s.innerHTML,s.remove())}for(const s of i){const r=s.closest(this.tagName);!r||!r.isSameNode(this)||(e[s.getAttribute("name")||"default"]=s.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((i,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate),await import(this.getAttribute("before-hydration-url")),this.start()}start(){const i=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:s}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),r=this.getAttribute("component-export")||"default";if(!r.includes("."))this.Component=a[r];else{this.Component=a;for(const d of r.split("."))this.Component=this.Component[d]}return this.hydrator=s,this.hydrate},i,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      return chunk.toString();
    }
  }
}

function validateComponentProps(props, displayName) {
  var _a;
  if (((_a = (Object.assign({"PUBLIC_COVALENT_API_KEY":"ckey_b2a03fc7e5834457b82017bcd36","PUBLIC_CENTER_API_KEY":"ckey_b2a03fc7e5834457b82017bcd36","PUBLIC_SUPABASE_KEY":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aHBueGp2cGdhdHZnYXViYnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI0NzUyMzAsImV4cCI6MTk3ODA1MTIzMH0.bB6Xrqp3gAQ4jEWQFFr-URrd3YHkOXIwMKZfBI4Wl7U","BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{_:process.env._,}))) == null ? void 0 : _a.DEV) && props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
class AstroComponent {
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.expressions = expressions;
  }
  get [Symbol.toStringTag]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isAstroComponent(obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj) === "[object AstroComponent]";
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : !!obj.isAstroComponentFactory;
}
async function* renderAstroComponent(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
async function renderToString(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    const response = Component;
    throw response;
  }
  let html = "";
  for await (const chunk of renderAstroComponent(Component)) {
    html += stringifyChunk(result, chunk);
  }
  return html;
}
async function renderToIterable(result, componentFactory, displayName, props, children) {
  validateComponentProps(props, displayName);
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    console.warn(
      `Returning a Response is only supported inside of page components. Consider refactoring this logic into something like a function that can be used in the page.`
    );
    const response = Component;
    throw response;
  }
  return renderAstroComponent(Component);
}
async function renderTemplate(htmlParts, ...expressions) {
  return new AstroComponent(htmlParts, expressions);
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof HTMLString) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (child instanceof AstroComponent || Object.prototype.toString.call(child) === "[object AstroComponent]") {
    yield* renderAstroComponent(child);
  } else if (typeof child === "object" && Symbol.asyncIterator in child) {
    yield* child;
  } else {
    yield child;
  }
}
async function renderSlot(result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        content += stringifyChunk(result, chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(content);
  }
  return fallback;
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?<!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `let ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value));
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toStyleString(value)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement$1(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact"];
    default:
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/vue", "@astrojs/svelte"];
  }
}
function getComponentType(Component) {
  if (Component === Fragment) {
    return "fragment";
  }
  if (Component && typeof Component === "object" && Component["astro:html"]) {
    return "html";
  }
  if (isAstroComponentFactory(Component)) {
    return "astro-factory";
  }
  return "unknown";
}
async function renderComponent(result, displayName, Component, _props, slots = {}) {
  var _a;
  Component = await Component;
  switch (getComponentType(Component)) {
    case "fragment": {
      const children2 = await renderSlot(result, slots == null ? void 0 : slots.default);
      if (children2 == null) {
        return children2;
      }
      return markHTMLString(children2);
    }
    case "html": {
      const children2 = {};
      if (slots) {
        await Promise.all(
          Object.entries(slots).map(
            ([key, value]) => renderSlot(result, value).then((output) => {
              children2[key] = output;
            })
          )
        );
      }
      const html2 = Component.render({ slots: children2 });
      return markHTMLString(html2);
    }
    case "astro-factory": {
      async function* renderAstroComponentInline() {
        let iterable = await renderToIterable(result, Component, displayName, _props, slots);
        yield* iterable;
      }
      return renderAstroComponentInline();
    }
  }
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(_props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  if (Array.isArray(renderers) && renderers.length === 0 && typeof Component !== "string" && !componentIsHTMLElement(Component)) {
    const message = `Unable to render ${metadata.displayName}!

There are no \`integrations\` set in your \`astro.config.mjs\` file.
Did you mean to add ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`;
    throw new Error(message);
  }
  const children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          children[key] = output;
        })
      )
    );
  }
  let renderer;
  if (metadata.hydrate !== "only") {
    if (Component && Component[Renderer]) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && renderers.length === 1) {
      renderer = renderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new Error(`Unable to render ${metadata.displayName}!

Using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.
Did you mean to pass <${metadata.displayName} client:only="${probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")}" />
`);
    } else if (typeof Component !== "string") {
      const matchingRenderers = renderers.filter((r) => probableRendererNames.includes(r.name));
      const plural = renderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new Error(`Unable to render ${metadata.displayName}!

There ${plural ? "are" : "is"} ${renderers.length} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render ${metadata.displayName}.

Did you mean to enable ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`);
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new Error(
      `${metadata.displayName} component has a \`client:${metadata.hydrate}\` directive, but no client entrypoint was provided by ${renderer.name}!`
    );
  }
  if (!html && typeof Component === "string") {
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroComponent(
      await renderTemplate`<${Component}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Component) ? `/>` : `>${childSlots}</${Component}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
      return html;
    }
    return markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement$1("astro-island", island, false));
  }
  return renderAll();
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
const alreadyHeadRenderedResults = /* @__PURE__ */ new WeakSet();
function renderHead(result) {
  alreadyHeadRenderedResults.add(result);
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement$1("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement$1("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement$1("link", link, false));
  return markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
}
async function* maybeRenderHead(result) {
  if (alreadyHeadRenderedResults.has(result)) {
    return;
  }
  yield renderHead(result);
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

new TextEncoder();

function createComponent(cb) {
  cb.isAstroComponentFactory = true;
  return cb;
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const ClientOnlyPlaceholder = "astro-client-only";
const skipAstroJSXCheck = /* @__PURE__ */ new WeakSet();
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  if (isVNode(vnode)) {
    switch (true) {
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skipAstroJSXCheck.add(vnode.type);
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function" && !skipAstroJSXCheck.has(vnode.type)) {
        useConsoleFilter();
        try {
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2 && output2[AstroJSX]) {
            return await renderJSX(result, output2);
          } else if (!output2) {
            return await renderJSX(result, output2);
          }
        } catch (e) {
          skipAstroJSXCheck.add(vnode.type);
        } finally {
          finishUsingConsoleFilter();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponent(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponent(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let body = "";
        for await (const chunk of output) {
          let html = stringifyChunk(result, chunk);
          body += html;
        }
        return markHTMLString(body);
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

const $$metadata$9 = createMetadata("/@fs/Users/corbinpage/zdev/lensmo-fe/src/layouts/Layout.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$c = createAstro("/@fs/Users/corbinpage/zdev/lensmo-fe/src/layouts/Layout.astro", "", "file:///Users/corbinpage/zdev/lensmo-fe/");
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`<html lang="en" class="astro-OZ2DCXSH">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta name="lensmo" content="Lensmo">
    <title>${title}</title>
  ${renderHead($$result)}</head>
  <body class="astro-OZ2DCXSH">
    <main class="astro-OZ2DCXSH">
      ${renderSlot($$result, $$slots["default"])}
    </main>
    

    
  </body>
</html>`;
});

const $$file$9 = "/Users/corbinpage/zdev/lensmo-fe/src/layouts/Layout.astro";
const $$url$9 = undefined;

const $$module1$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$9,
	default: $$Layout,
	file: $$file$9,
	url: $$url$9
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$8 = createMetadata("/@fs/Users/corbinpage/zdev/lensmo-fe/src/components/Search.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$b = createAstro("/@fs/Users/corbinpage/zdev/lensmo-fe/src/components/Search.astro", "", "file:///Users/corbinpage/zdev/lensmo-fe/");
const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Search;
  return renderTemplate`${maybeRenderHead($$result)}<div class="form-control w-full">
  <div class="input-group">
    <button class="btn btn-square disabled:opacity=0" disabled>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </button>
    <input type="text" id="userId" placeholder="Search…" class="w-full focus:outline-none input input-bordered">
  </div>
</div>`;
});

const $$file$8 = "/Users/corbinpage/zdev/lensmo-fe/src/components/Search.astro";
const $$url$8 = undefined;

const $$module2$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$8,
	default: $$Search,
	file: $$file$8,
	url: $$url$8
}, Symbol.toStringTag, { value: 'Module' }));

const __vite_glob_1_0 = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!-- Generator: Adobe Illustrator 26.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 72.7 80.9\" style=\"enable-background:new 0 0 72.7 80.9;\" xml:space=\"preserve\">\n<style type=\"text/css\">\n\t.st0{fill:url(#SVGID_1_);}\n\t.st1{fill:#A0A8D4;}\n\t.st2{fill:url(#SVGID_00000126304071991490873630000002617752381872039852_);}\n\t.st3{fill:url(#SVGID_00000068669604918486981050000001222478685288558482_);}\n</style>\n<g>\n\t<g id=\"Layer_1_00000049216471798175502890000006318023516466656703_\">\n\t\t\n\t\t\t<linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"42.0416\" y1=\"762.5881\" x2=\"12.66\" y2=\"794.4399\" gradientTransform=\"matrix(1 0 0 1 -6 -761.64)\">\n\t\t\t<stop offset=\"0.58\" style=\"stop-color:#A0A8D4\"/>\n\t\t\t<stop offset=\"0.73\" style=\"stop-color:#8791C7\"/>\n\t\t\t<stop offset=\"0.91\" style=\"stop-color:#6470B4\"/>\n\t\t</linearGradient>\n\t\t<path class=\"st0\" d=\"M9.3,32.8c0.8,1.7,2.8,5.1,2.8,5.1L35,0L12.7,15.6c-1.3,0.9-2.4,2.1-3.2,3.5C7.4,23.4,7.4,28.4,9.3,32.8z\"/>\n\t\t<path class=\"st1\" d=\"M0.3,45.2c0.5,7.3,4.2,14.1,10,18.5L35,80.9c0,0-15.5-22.3-28.5-44.5c-1.3-2.3-2.2-4.9-2.6-7.6    c-0.2-1.2-0.2-2.4,0-3.6c-0.3,0.6-1,1.9-1,1.9c-1.3,2.7-2.2,5.6-2.7,8.6C-0.1,38.9-0.1,42.1,0.3,45.2z\"/>\n\t\t\n\t\t\t<linearGradient id=\"SVGID_00000041290057621389763610000007807030157455862694_\" gradientUnits=\"userSpaceOnUse\" x1=\"42.6586\" y1=\"841.6585\" x2=\"72.0292\" y2=\"809.8294\" gradientTransform=\"matrix(1 0 0 1 -6 -761.64)\">\n\t\t\t<stop offset=\"0.58\" style=\"stop-color:#A0A8D4\"/>\n\t\t\t<stop offset=\"0.73\" style=\"stop-color:#8791C7\"/>\n\t\t\t<stop offset=\"0.91\" style=\"stop-color:#6470B4\"/>\n\t\t</linearGradient>\n\t\t<path style=\"fill:url(#SVGID_00000041290057621389763610000007807030157455862694_);\" d=\"M63.3,48.2c-0.8-1.7-2.8-5.1-2.8-5.1    L37.6,80.9L60,65.4c1.3-0.9,2.4-2.1,3.2-3.5C65.2,57.6,65.3,52.6,63.3,48.2z\"/>\n\t\t<path class=\"st1\" d=\"M72.4,35.7c-0.5-7.3-4.2-14.1-10-18.5L37.7,0c0,0,15.5,22.3,28.5,44.5c1.3,2.3,2.2,4.9,2.6,7.6    c0.2,1.2,0.2,2.4,0,3.6c0.3-0.6,1-1.9,1-1.9c1.3-2.7,2.2-5.6,2.7-8.5C72.7,42,72.7,38.9,72.4,35.7z\"/>\n\t\t\n\t\t\t<linearGradient id=\"SVGID_00000083789650806173036420000010692886349605777067_\" gradientUnits=\"userSpaceOnUse\" x1=\"42.3226\" y1=\"761.2401\" x2=\"42.3226\" y2=\"842.84\" gradientTransform=\"matrix(1 0 0 1 -6 -761.64)\">\n\t\t\t<stop offset=\"0\" style=\"stop-color:#513EFF\"/>\n\t\t\t<stop offset=\"0.18\" style=\"stop-color:#5157FF\"/>\n\t\t\t<stop offset=\"0.57\" style=\"stop-color:#5298FF\"/>\n\t\t\t<stop offset=\"1\" style=\"stop-color:#52E5FF\"/>\n\t\t</linearGradient>\n\t\t<path style=\"fill:url(#SVGID_00000083789650806173036420000010692886349605777067_);\" d=\"M9.5,19.1c0.8-1.4,1.8-2.6,3.2-3.5L35,0    L12.1,37.8c0,0-2-3.4-2.8-5.1C7.4,28.4,7.4,23.4,9.5,19.1z M0.3,45.2c0.5,7.3,4.2,14.1,10,18.5L35,80.9c0,0-15.5-22.3-28.5-44.5    c-1.3-2.3-2.2-4.9-2.6-7.6c-0.2-1.2-0.2-2.4,0-3.6c-0.3,0.6-1,1.9-1,1.9c-1.3,2.7-2.2,5.6-2.7,8.6C-0.1,38.9-0.1,42.1,0.3,45.2z     M63.3,48.2c-0.8-1.7-2.8-5.1-2.8-5.1L37.6,80.9L60,65.4c1.3-0.9,2.4-2.1,3.2-3.5C65.2,57.6,65.3,52.6,63.3,48.2L63.3,48.2z     M72.3,35.8c-0.5-7.3-4.2-14.1-10-18.5L37.7,0c0,0,15.5,22.3,28.5,44.5c1.3,2.3,2.2,4.9,2.6,7.6c0.2,1.2,0.2,2.4,0,3.6    c0.3-0.6,1-1.9,1-1.9c1.3-2.7,2.2-5.6,2.7-8.5C72.7,42,72.7,38.9,72.3,35.8L72.3,35.8z\"/>\n\t</g>\n</g>\n</svg>";

const __vite_glob_1_1 = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: Adobe Illustrator 26.0.2, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 381.55 373.56\" style=\"enable-background:new 0 0 381.55 373.56;\" xml:space=\"preserve\">\n<style type=\"text/css\">\n\t.st0{fill:none;stroke:#231F20;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n\t.st1{fill:#00501E;}\n</style>\n<path class=\"st1\" d=\"M189.23,229.46c-2.94,0-72.72-0.61-126.08-53.98c-1.13-1.13-2.23-2.26-3.31-3.41\n\tc-11.17-11.8-16.48-25.82-15.35-40.55c0.99-12.99,6.97-25.59,16.85-35.47c9.88-9.88,22.47-15.86,35.47-16.85\n\tc13.61-1.04,26.62,3.42,37.83,12.92c1.21-14.64,7.26-26.99,17.61-35.88c9.89-8.49,23.03-13.16,36.99-13.16s27.11,4.67,36.99,13.16\n\tc10.36,8.89,16.4,21.24,17.62,35.88c11.21-9.5,24.22-13.96,37.83-12.92c12.99,0.99,25.59,6.97,35.46,16.85\n\tc9.88,9.88,15.86,22.47,16.85,35.47c1.12,14.73-4.19,28.75-15.35,40.55c-1.08,1.14-2.19,2.28-3.31,3.41\n\tC261.95,228.85,192.18,229.46,189.23,229.46z M100.65,90.15c-12.1,0-23.46,5.62-31.54,13.7c-14.53,14.53-21.12,39.71-1.28,60.68\n\tc1.01,1.07,2.04,2.13,3.1,3.19c50.18,50.18,117.63,50.76,118.31,50.76c0.67,0,68.25-0.71,118.31-50.76c1.06-1.06,2.09-2.12,3.1-3.19\n\tc19.84-20.96,13.24-46.15-1.29-60.67c-14.53-14.53-39.71-21.12-60.67-1.29c-1.07,1.01-2.13,2.04-3.19,3.1\n\tc-0.82,0.82-1.6,1.65-2.38,2.48l-10.48,11.05l0.41-15.18c0.03-1.15,0.07-2.31,0.07-3.48c0-1.49-0.02-2.97-0.06-4.45\n\tc-0.8-28.85-23.27-42-43.81-42s-43.02,13.14-43.81,42c-0.04,1.47-0.06,2.95-0.06,4.45c0,1.14,0.03,2.27,0.06,3.39l0.4,15.27\n\tl-10.44-11.02c-0.79-0.84-1.59-1.68-2.41-2.51c-1.06-1.06-2.12-2.09-3.19-3.1C120.47,93.74,110.32,90.15,100.65,90.15z\"/>\n<path class=\"st1\" d=\"M332.15,310.44c-19.67,9.04-42.14,11.4-63.4,6.62c-20.62-4.64-38.7-15.38-52.59-31.15\n\tc1.36,0.94,2.76,1.85,4.2,2.72c11.88,7.16,25.08,10.76,38.28,10.76c11.73,0,23.47-2.84,34.29-8.56c0.77-0.4,1.53-0.82,2.29-1.25\n\tl-5.44-9.56c-0.66,0.38-1.32,0.74-1.99,1.09c-19.55,10.33-42.63,9.63-61.75-1.89c-19.57-11.79-31.26-32.42-31.26-55.18v-4.24h-0.1\n\th-10.9h-0.1v4.24c0,22.76-11.69,43.39-31.26,55.18c-19.12,11.52-42.2,12.23-61.75,1.89c-0.67-0.35-1.33-0.71-1.99-1.09l-5.44,9.56\n\tc0.76,0.43,1.52,0.85,2.29,1.25c10.82,5.72,22.55,8.56,34.29,8.56c13.2,0,26.39-3.6,38.28-10.76c1.44-0.86,2.84-1.77,4.2-2.72\n\tc-13.89,15.77-31.97,26.51-52.59,31.15c-21.26,4.79-43.73,2.43-63.4-6.62l-5.53,9.58c14.7,6.92,30.84,10.46,47.05,10.46\n\tc8.14,0,16.29-0.89,24.29-2.69c24.66-5.55,46.07-18.95,61.89-38.73c3.7-4.62,6.92-9.58,9.66-14.77v56.19h11v-56.38\n\tc2.77,5.26,6.02,10.29,9.76,14.96c15.83,19.78,37.23,33.17,61.89,38.73c8,1.8,16.15,2.69,24.29,2.69c16.21,0,32.35-3.54,47.05-10.46\n\tL332.15,310.44z\"/>\n<path class=\"st1\" d=\"M182.08,171.2h-8c0-11.91-11.59-21.61-25.84-21.61c-14.25,0-25.84,9.69-25.84,21.61h-8\n\tc0-16.32,15.18-29.61,33.84-29.61C166.9,141.59,182.08,154.87,182.08,171.2z\"/>\n<circle class=\"st1\" cx=\"157.44\" cy=\"159.86\" r=\"11.51\"/>\n<path class=\"st1\" d=\"M264.14,171.2h-8c0-11.91-11.59-21.61-25.84-21.61c-14.25,0-25.84,9.69-25.84,21.61h-8\n\tc0-16.32,15.18-29.61,33.84-29.61C248.96,141.59,264.14,154.87,264.14,171.2z\"/>\n<circle class=\"st1\" cx=\"239.51\" cy=\"159.86\" r=\"11.51\"/>\n<path class=\"st1\" d=\"M189.1,200.61c-9.43,0-18.17-4.85-22.25-12.34l7.03-3.83c2.71,4.96,8.68,8.17,15.23,8.17\n\tc6.55,0,12.53-3.21,15.23-8.17l7.03,3.83C207.27,195.76,198.53,200.61,189.1,200.61z\"/>\n</svg>\n";

const SPRITESHEET_NAMESPACE = `astroicon`;

const $$module1$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	SPRITESHEET_NAMESPACE
}, Symbol.toStringTag, { value: 'Module' }));

const $$module4$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

const baseURL = "https://api.astroicon.dev/v1/";
const requests = /* @__PURE__ */ new Map();
const fetchCache = /* @__PURE__ */ new Map();
async function get$1(pack, name) {
  const url = new URL(`./${pack}/${name}`, baseURL).toString();
  if (requests.has(url)) {
    return await requests.get(url);
  }
  if (fetchCache.has(url)) {
    return fetchCache.get(url);
  }
  let request = async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const contentType = res.headers.get("Content-Type");
    if (!contentType.includes("svg")) {
      throw new Error(`[astro-icon] Unable to load "${name}" because it did not resolve to an SVG!

Recieved the following "Content-Type":
${contentType}`);
    }
    const svg = await res.text();
    fetchCache.set(url, svg);
    requests.delete(url);
    return svg;
  };
  let promise = request();
  requests.set(url, promise);
  return await promise;
}

const splitAttrsTokenizer = /([a-z0-9_\:\-]*)\s*?=\s*?(['"]?)(.*?)\2\s+/gim;
const domParserTokenizer = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!\[CDATA\[)([\s\S]*?)(\]\]>))/gm;
const splitAttrs = (str) => {
  let res = {};
  let token;
  if (str) {
    splitAttrsTokenizer.lastIndex = 0;
    str = " " + (str || "") + " ";
    while (token = splitAttrsTokenizer.exec(str)) {
      res[token[1]] = token[3];
    }
  }
  return res;
};
function optimizeSvg(contents, name, options) {
  return optimize(contents, {
    plugins: [
      "removeDoctype",
      "removeXMLProcInst",
      "removeComments",
      "removeMetadata",
      "removeXMLNS",
      "removeEditorsNSData",
      "cleanupAttrs",
      "minifyStyles",
      "convertStyleToAttrs",
      {
        name: "cleanupIDs",
        params: { prefix: `${SPRITESHEET_NAMESPACE}:${name}` }
      },
      "removeRasterImages",
      "removeUselessDefs",
      "cleanupNumericValues",
      "cleanupListOfValues",
      "convertColors",
      "removeUnknownsAndDefaults",
      "removeNonInheritableGroupAttrs",
      "removeUselessStrokeAndFill",
      "removeViewBox",
      "cleanupEnableBackground",
      "removeHiddenElems",
      "removeEmptyText",
      "convertShapeToPath",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "collapseGroups",
      "convertPathData",
      "convertTransform",
      "removeEmptyAttrs",
      "removeEmptyContainers",
      "mergePaths",
      "removeUnusedNS",
      "sortAttrs",
      "removeTitle",
      "removeDesc",
      "removeDimensions",
      "removeStyleElement",
      "removeScriptElement"
    ]
  }).data;
}
const preprocessCache = /* @__PURE__ */ new Map();
function preprocess(contents, name, { optimize }) {
  if (preprocessCache.has(contents)) {
    return preprocessCache.get(contents);
  }
  if (optimize) {
    contents = optimizeSvg(contents, name);
  }
  domParserTokenizer.lastIndex = 0;
  let result = contents;
  let token;
  if (contents) {
    while (token = domParserTokenizer.exec(contents)) {
      const tag = token[2];
      if (tag === "svg") {
        const attrs = splitAttrs(token[3]);
        result = contents.slice(domParserTokenizer.lastIndex).replace(/<\/svg>/gim, "").trim();
        const value = { innerHTML: result, defaultProps: attrs };
        preprocessCache.set(contents, value);
        return value;
      }
    }
  }
}
function normalizeProps(inputProps) {
  const size = inputProps.size;
  delete inputProps.size;
  const w = inputProps.width ?? size;
  const h = inputProps.height ?? size;
  const width = w ? toAttributeSize(w) : void 0;
  const height = h ? toAttributeSize(h) : void 0;
  return { ...inputProps, width, height };
}
const toAttributeSize = (size) => String(size).replace(/(?<=[0-9])x$/, "em");
const fallback = {
  innerHTML: '<rect width="24" height="24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />',
  props: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "aria-hidden": "true"
  }
};
async function load(name, inputProps, optimize) {
  const key = name;
  if (!name) {
    throw new Error("<Icon> requires a name!");
  }
  let svg = "";
  let filepath = "";
  if (name.includes(":")) {
    const [pack, ..._name] = name.split(":");
    name = _name.join(":");
    filepath = `/src/icons/${pack}`;
    let get;
    try {
      const files = /* #__PURE__ */ Object.assign({});
      const keys = Object.fromEntries(
        Object.keys(files).map((key2) => [key2.replace(/\.[cm]?[jt]s$/, ""), key2])
      );
      if (!(filepath in keys)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const mod = files[keys[filepath]];
      if (typeof mod.default !== "function") {
        throw new Error(
          `[astro-icon] "${filepath}" did not export a default function!`
        );
      }
      get = mod.default;
    } catch (e) {
    }
    if (typeof get === "undefined") {
      get = get$1.bind(null, pack);
    }
    const contents = await get(name);
    if (!contents) {
      throw new Error(
        `<Icon pack="${pack}" name="${name}" /> did not return an icon!`
      );
    }
    if (!/<svg/gim.test(contents)) {
      throw new Error(
        `Unable to process "<Icon pack="${pack}" name="${name}" />" because an SVG string was not returned!

Recieved the following content:
${contents}`
      );
    }
    svg = contents;
  } else {
    filepath = `/src/icons/${name}.svg`;
    try {
      const files = /* #__PURE__ */ Object.assign({"/src/icons/ens.svg": __vite_glob_1_0,"/src/icons/lens.svg": __vite_glob_1_1});
      if (!(filepath in files)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const contents = files[filepath];
      if (!/<svg/gim.test(contents)) {
        throw new Error(
          `Unable to process "${filepath}" because it is not an SVG!

Recieved the following content:
${contents}`
        );
      }
      svg = contents;
    } catch (e) {
      throw new Error(
        `[astro-icon] Unable to load "${filepath}". Does the file exist?`
      );
    }
  }
  const { innerHTML, defaultProps } = preprocess(svg, key, { optimize });
  if (!innerHTML.trim()) {
    throw new Error(`Unable to parse "${filepath}"!`);
  }
  return {
    innerHTML,
    props: { ...defaultProps, ...normalizeProps(inputProps) }
  };
}

const $$module2$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	preprocess,
	normalizeProps,
	fallback,
	default: load
}, Symbol.toStringTag, { value: 'Module' }));

createMetadata("/@fs/Users/corbinpage/zdev/lensmo-fe/node_modules/astro-icon/lib/Icon.astro", { modules: [{ module: $$module2$1, specifier: "./utils.ts", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$a = createAstro("/@fs/Users/corbinpage/zdev/lensmo-fe/node_modules/astro-icon/lib/Icon.astro", "", "file:///Users/corbinpage/zdev/lensmo-fe/");
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Icon;
  let { name, pack, title, optimize = true, class: className, ...inputProps } = Astro2.props;
  let props = {};
  if (pack) {
    name = `${pack}:${name}`;
  }
  let innerHTML = "";
  try {
    const svg = await load(name, { ...inputProps, class: className }, optimize);
    innerHTML = svg.innerHTML;
    props = svg.props;
  } catch (e) {
    if ((Object.assign({"PUBLIC_COVALENT_API_KEY":"ckey_b2a03fc7e5834457b82017bcd36","PUBLIC_CENTER_API_KEY":"ckey_b2a03fc7e5834457b82017bcd36","PUBLIC_SUPABASE_KEY":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aHBueGp2cGdhdHZnYXViYnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI0NzUyMzAsImV4cCI6MTk3ODA1MTIzMH0.bB6Xrqp3gAQ4jEWQFFr-URrd3YHkOXIwMKZfBI4Wl7U","BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{_:process.env._,})).MODE === "production") {
      throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
    }
    innerHTML = fallback.innerHTML;
    props = { ...fallback.props, ...normalizeProps(inputProps) };
    title = `Failed to load "${name}"!`;
    console.error(e);
  }
  return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)}${addAttribute(name, "astro-icon")}>${markHTMLString((title ? `<title>${title}</title>` : "") + innerHTML)}</svg>`;
});

const AstroIcon = Symbol("AstroIcon");
function trackSprite(result, name) {
  if (typeof result[AstroIcon] !== "undefined") {
    result[AstroIcon]["sprites"].add(name);
  } else {
    result[AstroIcon] = {
      sprites: /* @__PURE__ */ new Set([name])
    };
  }
}
const warned = /* @__PURE__ */ new Set();
async function getUsedSprites(result) {
  if (typeof result[AstroIcon] !== "undefined") {
    return Array.from(result[AstroIcon]["sprites"]);
  }
  const pathname = result._metadata.pathname;
  if (!warned.has(pathname)) {
    console.log(`[astro-icon] No sprites found while rendering "${pathname}"`);
    warned.add(pathname);
  }
  return [];
}

const $$module3$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	trackSprite,
	getUsedSprites
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$7 = createMetadata("/@fs/Users/corbinpage/zdev/lensmo-fe/node_modules/astro-icon/lib/Spritesheet.astro", { modules: [{ module: $$module1$2, specifier: "./constants", assert: {} }, { module: $$module2$1, specifier: "./utils.ts", assert: {} }, { module: $$module3$1, specifier: "./context.ts", assert: {} }, { module: $$module4$1, specifier: "./Props.ts", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$9 = createAstro("/@fs/Users/corbinpage/zdev/lensmo-fe/node_modules/astro-icon/lib/Spritesheet.astro", "", "file:///Users/corbinpage/zdev/lensmo-fe/");
const $$Spritesheet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Spritesheet;
  const { optimize = true, style, ...props } = Astro2.props;
  const names = await getUsedSprites($$result);
  const icons = await Promise.all(names.map((name) => {
    return load(name, {}, optimize).then((res) => ({ ...res, name })).catch((e) => {
      if ((Object.assign({"PUBLIC_COVALENT_API_KEY":"ckey_b2a03fc7e5834457b82017bcd36","PUBLIC_CENTER_API_KEY":"ckey_b2a03fc7e5834457b82017bcd36","PUBLIC_SUPABASE_KEY":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aHBueGp2cGdhdHZnYXViYnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI0NzUyMzAsImV4cCI6MTk3ODA1MTIzMH0.bB6Xrqp3gAQ4jEWQFFr-URrd3YHkOXIwMKZfBI4Wl7U","BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{_:process.env._,})).MODE === "production") {
        throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
      }
      return { ...fallback, name };
    });
  }));
  return renderTemplate`${maybeRenderHead($$result)}<svg${addAttribute(`display: none; ${style ?? ""}`.trim(), "style")}${spreadAttributes({ "aria-hidden": true, ...props })} astro-icon-spritesheet>
    ${icons.map((icon) => renderTemplate`<symbol${spreadAttributes(icon.props)}${addAttribute(`${SPRITESHEET_NAMESPACE}:${icon.name}`, "id")}>${markHTMLString(icon.innerHTML)}</symbol>`)}
</svg>`;
});

const $$file$7 = "/Users/corbinpage/zdev/lensmo-fe/node_modules/astro-icon/lib/Spritesheet.astro";
const $$url$7 = undefined;

const $$module1$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$7,
	default: $$Spritesheet,
	file: $$file$7,
	url: $$url$7
}, Symbol.toStringTag, { value: 'Module' }));

createMetadata("/@fs/Users/corbinpage/zdev/lensmo-fe/node_modules/astro-icon/lib/SpriteProvider.astro", { modules: [{ module: $$module1$1, specifier: "./Spritesheet.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$8 = createAstro("/@fs/Users/corbinpage/zdev/lensmo-fe/node_modules/astro-icon/lib/SpriteProvider.astro", "", "file:///Users/corbinpage/zdev/lensmo-fe/");
const $$SpriteProvider = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$SpriteProvider;
  const content = await Astro2.slots.render("default");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": () => renderTemplate`${markHTMLString(content)}` })}
${renderComponent($$result, "Spritesheet", $$Spritesheet, {})}
`;
});

createMetadata("/@fs/Users/corbinpage/zdev/lensmo-fe/node_modules/astro-icon/lib/Sprite.astro", { modules: [{ module: $$module1$2, specifier: "./constants", assert: {} }, { module: $$module2$1, specifier: "./utils.ts", assert: {} }, { module: $$module3$1, specifier: "./context.ts", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$7 = createAstro("/@fs/Users/corbinpage/zdev/lensmo-fe/node_modules/astro-icon/lib/Sprite.astro", "", "file:///Users/corbinpage/zdev/lensmo-fe/");
const $$Sprite = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Sprite;
  let { name, pack, title, class: className, x, y, ...inputProps } = Astro2.props;
  const props = normalizeProps(inputProps);
  if (pack) {
    name = `${pack}:${name}`;
  }
  const href = `#${SPRITESHEET_NAMESPACE}:${name}`;
  trackSprite($$result, name);
  return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)}${addAttribute(className, "class")}${addAttribute(name, "astro-icon")}>
    ${title ? renderTemplate`<title>${title}</title>` : ""}
    <use${spreadAttributes({ "xlink:href": href, width: props.width, height: props.height, x, y })}></use>
</svg>`;
});

const deprecate = (component, message) => {
  return (...args) => {
    console.warn(message);
    return component(...args);
  };
};
const Spritesheet = deprecate(
  $$Spritesheet,
  `Direct access to <Spritesheet /> has been deprecated! Please wrap your contents in <Sprite.Provider> instead!`
);
const SpriteSheet = deprecate(
  $$Spritesheet,
  `Direct access to <SpriteSheet /> has been deprecated! Please wrap your contents in <Sprite.Provider> instead!`
);
const Sprite = Object.assign($$Sprite, { Provider: $$SpriteProvider });

const $$module4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Icon,
	Icon: $$Icon,
	Spritesheet,
	SpriteSheet,
	SpriteProvider: $$SpriteProvider,
	Sprite
}, Symbol.toStringTag, { value: 'Module' }));

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$metadata$6 = createMetadata("/@fs/Users/corbinpage/zdev/lensmo-fe/src/pages/index.astro", { modules: [{ module: $$module1$3, specifier: "../layouts/Layout.astro", assert: {} }, { module: $$module2$2, specifier: "../components/Search.astro", assert: {} }, { module: $$module4, specifier: "astro-icon", assert: {} }], hydratedComponents: [], clientOnlyComponents: ["../components/Web3/Connect"], hydrationDirectives: /* @__PURE__ */ new Set(["only"]), hoisted: [] });
const $$Astro$6 = createAstro("/@fs/Users/corbinpage/zdev/lensmo-fe/src/pages/index.astro", "", "file:///Users/corbinpage/zdev/lensmo-fe/");
const $$Index$2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Index$2;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate(_a || (_a = __template(["", '\n\n\n<script>\n  const input = document.getElementById("userId");\n  const send = document.getElementById("send");\n  input.addEventListener("keypress", function (event) {\n    if (event.key === "Enter") {\n      event.preventDefault();\n      send.click();\n    }\n  });\n<\/script>'])), renderComponent($$result, "Layout", $$Layout, { "title": "Welcome to Lensmo.", "class": "astro-SGHUBCPM" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<div class="card bg-base-100 shadow-xl mx-auto w-full astro-SGHUBCPM">
    <div class="card-body flex flex-col content-center astro-SGHUBCPM">
      <div class="flex flex-row justify-end astro-SGHUBCPM">
        ${renderComponent($$result, "Connect", null, { "client:only": "react", "client:component-hydration": "only", "class": "astro-SGHUBCPM", "client:component-path": $$metadata$6.resolvePath("../components/Web3/Connect"), "client:component-export": "Connect" })}
      </div>
      <div class="mb-4 mt-12 flex flex-col content-center astro-SGHUBCPM">
        <h1 class="leading-none mx-auto mt-2 astro-SGHUBCPM">
          <span class="text-gradient astro-SGHUBCPM">Lensmo</span>
        </h1>
        <h3 class="mx-auto text-slate-500 astro-SGHUBCPM">
          Send NFTs or tokens to <span class="italic astro-SGHUBCPM">anyone</span>, no wallet
          required
        </h3>
      </div>
      ${renderComponent($$result, "Search", $$Search, { "class": "astro-SGHUBCPM" })}
      <div class="flex mt-4 space-x-4 mx-auto astro-SGHUBCPM">
        <button class="btn btn-primary astro-SGHUBCPM" id="send" onclick="window.location.href = \`/user/\${getElementById('userId').value}\`">
          ${renderComponent($$result, "Icon", $$Icon, { "class": "w-6 astro-SGHUBCPM", "name": "carbon:send-alt-filled" })}Send</button>
        <button class="btn btn-primary astro-SGHUBCPM" onclick="window.location.href = \`/airdrop\`">${renderComponent($$result, "Icon", $$Icon, { "class": "w-6 astro-SGHUBCPM", "name": "icon-park-outline:hot-air-balloon" })}Airdrop
        </button>
      </div>
    </div>
  </div>` }));
});

const $$file$6 = "/Users/corbinpage/zdev/lensmo-fe/src/pages/index.astro";
const $$url$6 = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$6,
	default: $$Index$2,
	file: $$file$6,
	url: $$url$6
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$5 = createMetadata("/@fs/Users/corbinpage/zdev/lensmo-fe/src/pages/airdrop/index.astro", { modules: [{ module: $$module1$3, specifier: "../../layouts/Layout.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: ["../../components/AirDrop/AirDropTabs", "../../components/Web3/Connect"], hydrationDirectives: /* @__PURE__ */ new Set(["only"]), hoisted: [] });
const $$Astro$5 = createAstro("/@fs/Users/corbinpage/zdev/lensmo-fe/src/pages/airdrop/index.astro", "", "file:///Users/corbinpage/zdev/lensmo-fe/");
const $$Index$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Index$1;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Lensmo-User" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<div class="card bg-base-100 shadow-xl p-6 mx-auto w-full flex flex-col content-center">
    <div class="flex flex-col">
      ${renderComponent($$result, "Connect", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": $$metadata$5.resolvePath("../../components/Web3/Connect"), "client:component-export": "Connect" })}
      <h1 class="leading-none mx-auto mt-2">Airdrop</h1>
      ${renderComponent($$result, "AirDropTabs", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": $$metadata$5.resolvePath("../../components/AirDrop/AirDropTabs"), "client:component-export": "AirDropTabs" })}
    </div>
  </div>` })}`;
});

const $$file$5 = "/Users/corbinpage/zdev/lensmo-fe/src/pages/airdrop/index.astro";
const $$url$5 = "/airdrop";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$5,
	default: $$Index$1,
	file: $$file$5,
	url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$4 = createMetadata("/@fs/Users/corbinpage/zdev/lensmo-fe/src/pages/user/index.astro", { modules: [{ module: $$module1$3, specifier: "../../layouts/Layout.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: ["../../components/Accounts/User"], hydrationDirectives: /* @__PURE__ */ new Set(["only"]), hoisted: [] });
const $$Astro$4 = createAstro("/@fs/Users/corbinpage/zdev/lensmo-fe/src/pages/user/index.astro", "", "file:///Users/corbinpage/zdev/lensmo-fe/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Lensmo-User" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<div class="card bg-base-100 shadow-xl p-6 mx-auto w-full flex flex-col content-center">
    <div class="flex flex-row">
      ${renderComponent($$result, "UserInfo", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": $$metadata$4.resolvePath("../../components/Accounts/User"), "client:component-export": "UserInfo" })}
    </div>
  </div>` })}`;
});

const $$file$4 = "/Users/corbinpage/zdev/lensmo-fe/src/pages/user/index.astro";
const $$url$4 = "/user";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$4,
	default: $$Index,
	file: $$file$4,
	url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$3 = createMetadata("/@fs/Users/corbinpage/zdev/lensmo-fe/src/components/Modal.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$3 = createAstro("/@fs/Users/corbinpage/zdev/lensmo-fe/src/components/Modal.astro", "", "file:///Users/corbinpage/zdev/lensmo-fe/");
const $$Modal = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Modal;
  const { id, title } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div>
  <input type="checkbox"${addAttribute(id, "id")} class="modal-toggle">
  <div class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      ${renderSlot($$result, $$slots["before-title"])}
      <label${addAttribute(id, "for")} class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
      <h3 class="font-bold text-lg mt-4">${title}</h3>
      ${renderSlot($$result, $$slots["default"])}
    </div>
  </div>
</div>`;
});

const $$file$3 = "/Users/corbinpage/zdev/lensmo-fe/src/components/Modal.astro";
const $$url$3 = undefined;

const $$module1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$3,
	default: $$Modal,
	file: $$file$3,
	url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$2 = createMetadata("/@fs/Users/corbinpage/zdev/lensmo-fe/src/components/Send/SendModal.astro", { modules: [{ module: $$module1, specifier: "../Modal.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: ["../Web3/Connect", "./SendTabs"], hydrationDirectives: /* @__PURE__ */ new Set(["only"]), hoisted: [] });
const $$Astro$2 = createAstro("/@fs/Users/corbinpage/zdev/lensmo-fe/src/components/Send/SendModal.astro", "", "file:///Users/corbinpage/zdev/lensmo-fe/");
const $$SendModal = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$SendModal;
  return renderTemplate`${renderComponent($$result, "Modal", $$Modal, { "title": "Send", "id": "send" }, { "before-title": () => renderTemplate`${renderComponent($$result, "Connect", null, { "client:only": "react", "slot": "before-title", "client:component-hydration": "only", "client:component-path": $$metadata$2.resolvePath("../Web3/Connect"), "client:component-export": "Connect" })}`, "default": () => renderTemplate`${renderComponent($$result, "SendTabs", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": $$metadata$2.resolvePath("./SendTabs"), "client:component-export": "SendTabs" })}` })}`;
});

const $$file$2 = "/Users/corbinpage/zdev/lensmo-fe/src/components/Send/SendModal.astro";
const $$url$2 = undefined;

const $$module2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$2,
	default: $$SendModal,
	file: $$file$2,
	url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$1 = createMetadata("/@fs/Users/corbinpage/zdev/lensmo-fe/src/components/Claim/ClaimModal.astro", { modules: [{ module: $$module1, specifier: "../Modal.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: ["../Accounts/User"], hydrationDirectives: /* @__PURE__ */ new Set(["only"]), hoisted: [] });
const $$Astro$1 = createAstro("/@fs/Users/corbinpage/zdev/lensmo-fe/src/components/Claim/ClaimModal.astro", "", "file:///Users/corbinpage/zdev/lensmo-fe/");
const $$ClaimModal = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ClaimModal;
  const { provider, userInfo } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Modal", $$Modal, { "title": "Sign in to claim", "id": "claim" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<div class="btn-group btn-group-vertical">
    ${renderComponent($$result, "VerifiedUser", null, { "provider": provider, "userInfo": userInfo, "client:only": "react", "client:component-hydration": "only", "client:component-path": $$metadata$1.resolvePath("../Accounts/User"), "client:component-export": "VerifiedUser" })}
  </div>` })}`;
});

const $$file$1 = "/Users/corbinpage/zdev/lensmo-fe/src/components/Claim/ClaimModal.astro";
const $$url$1 = undefined;

const $$module3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$1,
	default: $$ClaimModal,
	file: $$file$1,
	url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const twitter = {
  name: "twitter",
  logo: "icon-park:twitter",
  apiKey: "AAAAAAAAAAAAAAAAAAAAAOdOgwEAAAAArNuKA6odSGsb9HW3bYOJY%2B9%2FBqU%3DfKg8awTiVjvTYooVryNlx1pIhiVbauGKfYvhTsA7iHSlShcWMl",
  apiUrl: "https://api.twitter.com/2",
  url: "https://twitter.com/",
  get resolveUser() {
    return async (userName) => {
      return fetch(
        `${this.apiUrl}/users/by/username/${userName}?user.fields=description,profile_image_url`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${this.apiKey}` }
        }
      ).then((response) => response.json()).then((data) => {
        if (data.data) {
          return {
            name: data.data.name,
            description: data.data.description,
            image: data.data.profile_image_url
          };
        } else {
          return null;
        }
      });
    };
  }
};
const github = {
  name: "github",
  logo: "icon-park:github",
  apiKey: "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",
  apiUrl: "https://api.github.com",
  url: "https://github.com/",
  get resolveUser() {
    return async (userName) => {
      return fetch(`${this.apiUrl}/users/${userName}`, {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${this.apiKey}`
        }
      }).then((response) => response.json()).then((data) => {
        if (data.name) {
          return {
            name: data.name,
            description: data.bio,
            image: data.avatar_url
          };
        } else {
          return null;
        }
      });
    };
  }
};
const discord = {
  name: "discord",
  logo: "logos:discord-icon",
  apiKey: "MTAxNzgyOTU0OTg2MzYyMDc0OA.GEZQng.jjAHdVk9HDSGA2M-8RV_xkuKhoc3boThkcybWo",
  apiUrl: "https://discord.com/api/v10",
  url: "https://discord.com/",
  get resolveUser() {
    return async (userName) => {
      return fetch(`${this.apiUrl}/users/${userName}`, {
        method: "GET",
        headers: {
          Authorization: `Bot ${this.apiKey}`,
          "Content-Type": "application/json; charset=UTF-8",
          "User-Agent": "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)"
        }
      }).then((response) => response.json()).then((data) => {
        if (data.username) {
          return {
            name: data.username + "#" + data.discriminator,
            description: data.banner,
            image: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=1024` : `https://cdn.discordapp.com/embed/avatars/${data.discriminator[3] % 5}.png`
          };
        } else {
          return null;
        }
      });
    };
  }
};
const ens = {
  name: "ens",
  logo: "ens",
  apiKey: "5ziNlvEWO17BpYt6CLYThEFdfBrecyQG",
  url: "https://app.ens.domains/name/",
  get resolveUser() {
    return async (userName) => {
      userName = new RegExp(".eth$").test(userName) ? userName : userName + ".eth";
      const provider = new ethers.providers.AlchemyProvider(
        "homestead",
        this.apiKey
      );
      return {
        name: userName,
        description: await provider.resolveName(userName),
        image: await provider.getAvatar(userName) || "https://cdn-images-1.medium.com/max/1200/1*phqy7EzRlH6J2iU9_8vL0g.png"
      };
    };
  }
};
const lens = {
  name: "lens",
  logo: "lens",
  apiKey: Object.assign({"PUBLIC_COVALENT_API_KEY":"ckey_b2a03fc7e5834457b82017bcd36","PUBLIC_CENTER_API_KEY":"ckey_b2a03fc7e5834457b82017bcd36","PUBLIC_SUPABASE_KEY":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aHBueGp2cGdhdHZnYXViYnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI0NzUyMzAsImV4cCI6MTk3ODA1MTIzMH0.bB6Xrqp3gAQ4jEWQFFr-URrd3YHkOXIwMKZfBI4Wl7U","BASE_URL":"/","MODE":"production","DEV":false,"PROD":true}, { _: process.env._, DISCORD_TOKEN: "MTAxNzgyOTU0OTg2MzYyMDc0OA.GEZQng.jjAHdVk9HDSGA2M-8RV_xkuKhoc3boThkcybWo", GITHUB_TOKEN: "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", TWITTER_TOKEN: "AAAAAAAAAAAAAAAAAAAAAOdOgwEAAAAArNuKA6odSGsb9HW3bYOJY%2B9%2FBqU%3DfKg8awTiVjvTYooVryNlx1pIhiVbauGKfYvhTsA7iHSlShcWMl", ALCHEMY_ID: "5ziNlvEWO17BpYt6CLYThEFdfBrecyQG" }).LENS_TOKEN,
  apiUrl: "https://app.ens.domains/name/",
  url: "https://www.lensfrens.xyz/",
  get resolveUser() {
    const apolloClient = new ApolloClient({
      uri: "https://api.lens.dev",
      cache: new InMemoryCache()
    });
    return async (userName) => {
      userName = new RegExp(".lens$").test(userName) ? userName : userName + ".lens";
      const query = `
        query Profiles {
        profiles(request: { handles: ["${userName}"], limit: 1 }) {
          items {
            id
            name
            ownedBy
            picture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                mimeType
              }
            }
            __typename
          }
          }
        }
      }
      `;
      const response = await apolloClient.query({
        query: gql(query)
      });
      if (response.data.profiles.items.length > 0) {
        return {
          name: userName,
          description: response.data.profiles.items[0].ownedBy,
          image: response.data.profiles.items[0].picture ? response.data.profiles.items[0].picture.original.url : "https://github.com/lens-protocol/brand-kit/raw/main/Logo/PNG/LENS%20LOGO_All_Icon%20Ultra%20Small.png"
        };
      } else {
        return null;
      }
    };
  }
};
const supportedNetworks = [twitter, github, discord, ens, lens];
const availableProviders = supportedNetworks.map((network) => {
  network.name;
});

const $$module5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	ens,
	lens,
	supportedNetworks,
	availableProviders
}, Symbol.toStringTag, { value: 'Module' }));

const supabaseUrl = "https://rvhpnxjvpgatvgaubbyt.supabase.co";
const options = {
  schema: "public",
  headers: { "x-my-custom-header": "lensmo" },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true
};
const supabase = createClient(
  supabaseUrl,
  Object.assign({"PUBLIC_COVALENT_API_KEY":"ckey_b2a03fc7e5834457b82017bcd36","PUBLIC_CENTER_API_KEY":"ckey_b2a03fc7e5834457b82017bcd36","PUBLIC_SUPABASE_KEY":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aHBueGp2cGdhdHZnYXViYnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI0NzUyMzAsImV4cCI6MTk3ODA1MTIzMH0.bB6Xrqp3gAQ4jEWQFFr-URrd3YHkOXIwMKZfBI4Wl7U","BASE_URL":"/","MODE":"production","DEV":false,"PROD":true}, { _: process.env._ }).PUBLIC_SUPABASE_KEY,
  options
);

const getWalletAddressFromId = async (walletId) => {
  const { data: receive_wallets, error } = await supabase.from("receive_wallets").select("wallet_address").eq("id", [walletId]);
  if (error) {
    return error?.message;
  }
  return receive_wallets[0].wallet_address;
};
const addNewWallet = async (username) => {
  const { data, error } = await supabase.from("escrow_users").insert([{ user_id: username }]);
  if (error) {
    return error?.message;
  }
  return data;
};
const checkWallet = async (username) => {
  if (new RegExp("^lens").test(username)) {
    return lens.resolveUser(username.split(":")[1]).then((data) => {
      return data ? data.description : null;
    });
  } else if (new RegExp("^ens").test(username)) {
    return ens.resolveUser(username.split(":")[1]).then((data) => {
      return data ? data.description : null;
    });
  } else {
    const { data: escrow_users, error } = await supabase.from("escrow_users").select("receive_wallet_id").in("user_id", [username]);
    if (error) {
      return error?.message;
    }
    if (escrow_users && escrow_users.length > 0) {
      return getWalletAddressFromId(escrow_users[0].receive_wallet_id);
    }
  }
};
const getWallet = async (username) => {
  const wallet = await checkWallet(username);
  if (wallet) {
    return wallet;
  } else {
    const newWallet = await addNewWallet(username);
    return getWalletAddressFromId(newWallet[0].receive_wallet_id);
  }
};

const $$module6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	getWalletAddressFromId,
	addNewWallet,
	checkWallet,
	getWallet
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata = createMetadata("/@fs/Users/corbinpage/zdev/lensmo-fe/src/pages/user/[userId].astro", { modules: [{ module: $$module1$3, specifier: "../../layouts/Layout.astro", assert: {} }, { module: $$module2, specifier: "../../components/Send/SendModal.astro", assert: {} }, { module: $$module3, specifier: "../../components/Claim/ClaimModal.astro", assert: {} }, { module: $$module4, specifier: "astro-icon", assert: {} }, { module: $$module5, specifier: "../../../utils/networks", assert: {} }, { module: $$module6, specifier: "../../../utils/getWallet", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro = createAstro("/@fs/Users/corbinpage/zdev/lensmo-fe/src/pages/user/[userId].astro", "", "file:///Users/corbinpage/zdev/lensmo-fe/");
const $$userId = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$userId;
  const [network, user] = Astro2.url.pathname.split("/")[2].split(":");
  const networkInfo = supportedNetworks.filter((e) => e.name === network)[0];
  const userInfo = networkInfo && await networkInfo.resolveUser(user);
  const wallet = await checkWallet(Astro2.url.pathname.split("/")[2]);
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Lensmo-User", "class": "astro-QZ6PNN3L" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<div class="card bg-base-100 shadow-xl p-6 mx-auto w-full flex flex-col content-center astro-QZ6PNN3L">
    <div class="flex flex-row astro-QZ6PNN3L">
      <a href="/" class="basis-1/2 astro-QZ6PNN3L">
        ${renderComponent($$result, "Icon", $$Icon, { "name": "eva:arrow-back-fill", "class": "w-8 astro-QZ6PNN3L" })}
      </a>
      <p class="font-sans antialiased text-gray-600 basis-1/2 text-right astro-QZ6PNN3L" id="username">
        ${String(Astro2.url.pathname.split("/")[2])}
      </p>
    </div>
    ${networkInfo ? userInfo ? renderTemplate`<div class="card-body flex flex-col justify-center astro-QZ6PNN3L">
            <div class="avatar mx-auto astro-QZ6PNN3L">
              <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 astro-QZ6PNN3L">
                <a${addAttribute(networkInfo.url + user, "href")} target="_blank" class="astro-QZ6PNN3L">
                  <img${addAttribute(userInfo.image, "src")} class="astro-QZ6PNN3L">
                </a>
              </div>
              ${renderComponent($$result, "Icon", $$Icon, { "class": "w-10 inlay astro-QZ6PNN3L", "name": networkInfo.logo })}
            </div>
            <div class="flex flex-col justify-center astro-QZ6PNN3L">
              <h2 class="card-title mx-auto astro-QZ6PNN3L">
                <a${addAttribute(networkInfo.url + user, "href")} target="_blank" class="astro-QZ6PNN3L">
                  @${userInfo.name}
                </a>
                on
                <span class="capitalize astro-QZ6PNN3L">${network}</span>
              </h2>
              <p class="mx-auto astro-QZ6PNN3L" id="destination">
                ${userInfo.description}
              </p>
            </div>
            <div class="card-actions mx-auto astro-QZ6PNN3L">
              <label class="btn btn-primary astro-QZ6PNN3L" for="send">
                ${renderComponent($$result, "Icon", $$Icon, { "name": "carbon:share-knowledge", "class": "w-6 astro-QZ6PNN3L" })}
                Give tokens
              </label>
              <label class="btn btn-primary astro-QZ6PNN3L" for="claim">
                ${renderComponent($$result, "Icon", $$Icon, { "name": "carbon:piggy-bank", "class": "w-6 astro-QZ6PNN3L" })}
                Claim
              </label>
            </div>
            <div class="flex flex-col justify-center astro-QZ6PNN3L">
              ${wallet ? renderTemplate`<h4 class="mx-auto text-slate-500 astro-QZ6PNN3L">
                  <a${addAttribute(`https://zapper.fi/account/${wallet}`, "href")} target="_blank" class="astro-QZ6PNN3L">
                    View Wallet
                  </a>
                </h4>` : renderTemplate`<div class="tooltip astro-QZ6PNN3L" data-tip="This user has not been given any digital assets yet. When they are sent some NFTs or tokens, a wallet will be created automatically and will be viewable here.">
                  <i class="mx-auto text-slate-500 astro-QZ6PNN3L">No wallet created yet</i>
                </div>`}
            </div>
            ${renderComponent($$result, "SendModal", $$SendModal, { "class": "astro-QZ6PNN3L" })}
            ${renderComponent($$result, "ClaimModal", $$ClaimModal, { "provider": network, "userInfo": userInfo, "class": "astro-QZ6PNN3L" })}
          </div>` : renderTemplate`<h2 class="card-title astro-QZ6PNN3L">
            Unable to find your account. Please check your username.
          </h2>` : renderTemplate`<h2 class="card-title astro-QZ6PNN3L">
          Network ${network} is not supported, please check our documentation for
          the supported networks
        </h2>`}
  </div>` })}
`;
});

const $$file = "/Users/corbinpage/zdev/lensmo-fe/src/pages/user/[userId].astro";
const $$url = "/user/[userId]";

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata,
	default: $$userId,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

async function get(req) {
  const { params } = req.params;
  return new Response(JSON.stringify({ status: "success", params }), {
    status: 200
  });
}

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	get
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['src/pages/index.astro', _page0],['src/pages/airdrop/index.astro', _page1],['src/pages/user/index.astro', _page2],['src/pages/user/[userId].astro', _page3],['src/pages/api/test.ts', _page4],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/react","clientEntrypoint":"@astrojs/react/client.js","serverEntrypoint":"@astrojs/react/server.js","jsxImportSource":"react"}, { ssr: _renderer1 }),];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose")) ; else if (process.argv.includes("--silent")) ; else ;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less"
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return segment[0].spread ? `/:${segment[0].content.slice(3)}(.*)?` : "/" + segment.map((part) => {
      if (part)
        return part.dynamic ? `:${part.content}` : part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  return {
    ...serializedManifest,
    assets,
    routes
  };
}

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":["assets/index.a09c77fe.css","assets/airdrop-index-index-user-_userId_-user-index.60997bc4.css","assets/index.d7f0b2f1.css"],"scripts":[],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.a09c77fe.css","assets/airdrop-index-index-user-_userId_-user-index.60997bc4.css"],"scripts":[],"routeData":{"route":"/airdrop","type":"page","pattern":"^\\/airdrop\\/?$","segments":[[{"content":"airdrop","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/airdrop/index.astro","pathname":"/airdrop","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/airdrop-index-index-user-_userId_-user-index.60997bc4.css"],"scripts":[],"routeData":{"route":"/user","type":"page","pattern":"^\\/user\\/?$","segments":[[{"content":"user","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/user/index.astro","pathname":"/user","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.a09c77fe.css","assets/airdrop-index-index-user-_userId_-user-index.60997bc4.css","assets/user-_userId_.98130818.css"],"scripts":[],"routeData":{"route":"/user/[userid]","type":"page","pattern":"^\\/user\\/([^/]+?)\\/?$","segments":[[{"content":"user","dynamic":false,"spread":false}],[{"content":"userId","dynamic":true,"spread":false}]],"params":["userId"],"component":"src/pages/user/[userId].astro","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/test","type":"endpoint","pattern":"^\\/api\\/test$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"test","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/test.ts","pathname":"/api/test","_meta":{"trailingSlash":"ignore"}}}],"base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"extendDefaultPlugins":false,"isAstroFlavoredMd":false},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.js","/@fs/Users/corbinpage/zdev/lensmo-fe/src/components/Web3/Connect":"Connect.d9a9e898.js","/@fs/Users/corbinpage/zdev/lensmo-fe/src/components/AirDrop/AirDropTabs":"AirDropTabs.cab09350.js","/@fs/Users/corbinpage/zdev/lensmo-fe/src/components/Accounts/User":"User.be06bd74.js","/@fs/Users/corbinpage/zdev/lensmo-fe/src/components/Send/SendTabs":"SendTabs.e53faa2a.js","@astrojs/react/client.js":"client.5dfd77aa.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/arbitrum-RJBKFWDE.js":"chunks/arbitrum-RJBKFWDE.87f372d6.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/avalanche-GTODSNSK.js":"chunks/avalanche-GTODSNSK.54a8b878.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/ethereum-TCZSTHSI.js":"chunks/ethereum-TCZSTHSI.42261349.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/hardhat-VJNBZ2P3.js":"chunks/hardhat-VJNBZ2P3.5b336cbc.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/optimism-3QUIF6AD.js":"chunks/optimism-3QUIF6AD.3e351eef.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/polygon-JVGMAJ3S.js":"chunks/polygon-JVGMAJ3S.3ddaef1d.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/assets-7THATBKH.js":"chunks/assets-7THATBKH.d595dbb8.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/login-EJZTP74Q.js":"chunks/login-EJZTP74Q.05704f3b.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/sign-3FIRYJVD.js":"chunks/sign-3FIRYJVD.75fa62d8.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/create-GVGWOEGN.js":"chunks/create-GVGWOEGN.e36b3e3f.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/refresh-J4PXTKTR.js":"chunks/refresh-J4PXTKTR.547f52e7.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/scan-RESLZYEA.js":"chunks/scan-RESLZYEA.b256a431.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/Chrome-J3SNM3VC.js":"chunks/Chrome-J3SNM3VC.01ad0569.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/Brave-AYENFWW6.js":"chunks/Brave-AYENFWW6.4794ca77.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/Edge-L7ZZC477.js":"chunks/Edge-L7ZZC477.9b80df39.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/Firefox-JUUNEJSG.js":"chunks/Firefox-JUUNEJSG.133dd216.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/Browser-MZYY2QO6.js":"chunks/Browser-MZYY2QO6.054d8d51.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/brave-GT2DMA7C.js":"chunks/brave-GT2DMA7C.af4f695c.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/coinbase-G3UAZG2M.js":"chunks/coinbase-G3UAZG2M.e6baa79b.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/injected-NV2ZDWID.js":"chunks/injected-NV2ZDWID.bb042f61.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/metaMask-CP52H6U7.js":"chunks/metaMask-CP52H6U7.28eb3d68.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/rainbow-MRMCEQFY.js":"chunks/rainbow-MRMCEQFY.1445e885.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@rainbow-me/rainbowkit/dist/walletConnect-WGMZ526J.js":"chunks/walletConnect-WGMZ526J.8a0731ac.js","/Users/corbinpage/zdev/lensmo-fe/node_modules/@walletconnect/ethereum-provider/dist/esm/index.js":"chunks/index.c9a4cf2f.js","astro:scripts/before-hydration.js":"data:text/javascript;charset=utf-8,//[no before-hydration script]"},"assets":["/assets/airdrop-index-index-user-_userId_-user-index.60997bc4.css","/assets/index.d7f0b2f1.css","/assets/user-_userId_.98130818.css","/AirDropTabs.cab09350.js","/Connect.d9a9e898.js","/SendTabs.e53faa2a.js","/User.be06bd74.js","/client.5dfd77aa.js","/favicon.svg","/assets/index.a09c77fe.css","/chunks/Brave-AYENFWW6.4794ca77.js","/chunks/Browser-MZYY2QO6.054d8d51.js","/chunks/Chrome-J3SNM3VC.01ad0569.js","/chunks/Edge-L7ZZC477.9b80df39.js","/chunks/Firefox-JUUNEJSG.133dd216.js","/chunks/Web3Wrapper.d594cc84.js","/chunks/arbitrum-RJBKFWDE.87f372d6.js","/chunks/assets-7THATBKH.d595dbb8.js","/chunks/avalanche-GTODSNSK.54a8b878.js","/chunks/brave-GT2DMA7C.af4f695c.js","/chunks/browser-ponyfill.d78e7cb6.js","/chunks/coinbase-G3UAZG2M.e6baa79b.js","/chunks/create-GVGWOEGN.e36b3e3f.js","/chunks/ethereum-TCZSTHSI.42261349.js","/chunks/events.526cb675.js","/chunks/getWallet.791fb7ea.js","/chunks/hardhat-VJNBZ2P3.5b336cbc.js","/chunks/index.12d2f6c3.js","/chunks/index.34b2e11a.js","/chunks/index.40cc99d4.js","/chunks/index.c9a4cf2f.js","/chunks/injected-NV2ZDWID.bb042f61.js","/chunks/jsx-runtime.2da8e926.js","/chunks/login-EJZTP74Q.05704f3b.js","/chunks/metaMask-CP52H6U7.28eb3d68.js","/chunks/optimism-3QUIF6AD.3e351eef.js","/chunks/polygon-JVGMAJ3S.3ddaef1d.js","/chunks/rainbow-MRMCEQFY.1445e885.js","/chunks/refresh-J4PXTKTR.547f52e7.js","/chunks/scan-RESLZYEA.b256a431.js","/chunks/sign-3FIRYJVD.75fa62d8.js","/chunks/supabaseClient.c76733dd.js","/chunks/walletConnect-WGMZ526J.8a0731ac.js"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = undefined;

const _exports = adapter.createExports(_manifest, _args);
const _default = _exports['default'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { _default as default };
