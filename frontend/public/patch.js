// const fs = require("fs");
import fs from "fs"

const INPUT = "widget.js";          // tumhari original file
const OUTPUT = "widget.scoped.js";  // nayi file (styling sirf widget ke andar)

const src = fs.readFileSync(INPUT, "utf8");

const marker = "function Ye(){";
const idx = src.indexOf(marker);
if (idx === -1) {
  console.error("ERROR: 'function Ye(){' nahi mila. Sahi file di hai?");
  process.exit(1);
}

const head = src.slice(0, idx);

const tail = `function Ye(shadow){
  if(typeof document>"u")return;

  let css=Je
    .replace(/@property\\s+--[\\w-]+\\s*\\{[^}]*\\}/g,"")
    .replace(/@layer properties\\{@supports[^{]*\\{/,"@layer properties{@media all{")
    .replace(/:root\\{--bg-primary/,":host{--bg-primary")
    .replace(/body\\{[^}]*\\}/,":host{all:initial;font-family:'Plus Jakarta Sans',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}");

  const style=document.createElement("style");
  style.id="ctrlbooks-ai-widget-styles";
  style.textContent=css;
  shadow.appendChild(style);
}

function Xe(){
  if(typeof document>"u")return;

  const hostId="ctrlbooks-ai-widget-host";
  if(document.getElementById(hostId))return;

  const host=document.createElement("div");
  host.id=hostId;
  const shadow=host.attachShadow({mode:"open"});
  document.body.appendChild(host);

  Ye(shadow);

  const mount=document.createElement("div");
  shadow.appendChild(mount);

  (0,Le.createRoot)(mount).render((0,k.jsx)(qe,{}));
}

typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Xe):Xe())})();
`;

fs.writeFileSync(OUTPUT, head + tail);
console.log("Done ->", OUTPUT, "(" + Math.round((head.length + tail.length) / 1024) + " KB)");