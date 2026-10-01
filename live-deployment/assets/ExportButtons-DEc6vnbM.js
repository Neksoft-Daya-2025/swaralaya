const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-BBICVZ-s.js","assets/react-vendor-IJ6URUR9.js","assets/radix-BHwFKyaY.js","assets/index-CykkUmHS.css"])))=>i.map(i=>d[i]);
import{c as n,B as r,_ as o}from"./index-BBICVZ-s.js";import{j as t}from"./react-vendor-IJ6URUR9.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=n("FileSpreadsheet",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=n("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=n("PencilLine",[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",key:"1ykcvy"}],["path",{d:"m15 5 3 3",key:"1w25hb"}]]);function v({title:d,filename:c,columns:l,rows:s,totalsRow:p}){const h=s.length===0,i={title:d,filename:c,columns:l,rows:s,totalsRow:p};return t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsxs(r,{variant:"outline",size:"sm",disabled:h,onClick:()=>{o(async()=>{const{exportToExcel:e}=await import("./exportData-BQqKRXqF.js").then(a=>a.e);return{exportToExcel:e}},__vite__mapDeps([0,1,2,3])).then(({exportToExcel:e})=>{e(i)})},children:[t.jsx(y,{className:"h-4 w-4"}),"Excel"]}),t.jsxs(r,{variant:"outline",size:"sm",disabled:h,onClick:()=>{o(async()=>{const{exportToPdf:e}=await import("./exportData-BQqKRXqF.js").then(a=>a.e);return{exportToPdf:e}},__vite__mapDeps([0,1,2,3])).then(({exportToPdf:e})=>{e(i)})},children:[t.jsx(k,{className:"h-4 w-4"}),"PDF"]})]})}export{v as E,u as P};
