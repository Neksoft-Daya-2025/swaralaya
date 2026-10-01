import{i as p,r as h,j as e}from"./react-vendor-IJ6URUR9.js";import{c as o,B as s}from"./index-BBICVZ-s.js";import{P as x}from"./PageHeader-DL9KQygb.js";import{j as k,k as f,n as g,r as v}from"./AdminApp-ClsilDyp.js";import"./radix-BHwFKyaY.js";import"./motion-cP4x28ud.js";import"./query-DPO0EOm4.js";import"./loader-circle-yFi0TcnF.js";import"./hand-heart-BP6hjdax.js";import"./users-DVZkHaYs.js";import"./credit-card-0UPuNsPi.js";import"./calendar-days-Cs4oAVND.js";import"./calendar-DTlFLcqW.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=o("CheckCheck",[["path",{d:"M18 6 7 17l-5-5",key:"116fxf"}],["path",{d:"m22 10-7.5 7.5L13 16",key:"ke71qq"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=o("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]),T=()=>{const n=p(),{notifications:a,unreadCount:c,markAsRead:d,markAllRead:l}=k(),i=h.useMemo(()=>[...a].sort((t,m)=>String(m.createdAt||"").localeCompare(String(t.createdAt||""))),[a]),r=t=>{d(t.id),n(g(v(t)))};return e.jsxs("div",{children:[e.jsx(x,{title:"Notifications",description:"Enrollment, booking, contact, and admin activity alerts",children:e.jsxs(s,{variant:"outline",disabled:c===0,onClick:l,children:[e.jsx(j,{className:"h-4 w-4"}),"Mark all read"]})}),e.jsx("div",{className:"overflow-hidden rounded-lg border bg-background",children:i.length===0?e.jsx("p",{className:"px-4 py-12 text-center text-sm text-muted-foreground",children:"No notifications yet."}):e.jsx("div",{className:"divide-y",children:i.map(t=>e.jsxs("div",{className:"flex items-center gap-3 pr-4",children:[e.jsx("div",{className:"min-w-0 flex-1",children:e.jsx(f,{notification:t,onActivate:r})}),e.jsxs(s,{variant:"ghost",size:"sm",onClick:()=>r(t),children:[e.jsx(N,{className:"h-4 w-4"}),"Open"]})]},t.id))})})]})};export{T as NotificationsPage};
