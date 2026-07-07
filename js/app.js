const songs=[{title:'Finder Girl',unit:'Trickstar',type:'ユニット'},{title:'Promise Swords',unit:'Knights',type:'ユニット'},{title:'BRAND NEW STARS!!',unit:'All Stars',type:'全体'}];
const tb=document.getElementById('tbody');const s=document.getElementById('search');const u=document.getElementById('unit');
[...new Set(songs.map(x=>x.unit))].forEach(v=>{let o=document.createElement('option');o.value=v;o.textContent=v;u.appendChild(o);});
function render(){const q=s.value.toLowerCase();tb.innerHTML='';songs.filter(x=>(!u.value||x.unit===u.value)&&(`${x.title} ${x.unit}`.toLowerCase().includes(q))).forEach(x=>{tb.innerHTML+=`<tr><td>${x.title}</td><td>${x.unit}</td><td>${x.type}</td></tr>`})}
s.oninput=render;u.onchange=render;render();