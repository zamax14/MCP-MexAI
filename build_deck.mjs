import fs from 'node:fs';
import path from 'node:path';
import pptxgen from './.deck-build/node_modules/pptxgenjs/dist/pptxgen.es.js';

const root = process.cwd();
const guide = fs.readFileSync(path.join(root, 'guia_presentacion_mcp_mexai_para_codex.md'), 'utf8');
const out = path.join(root, 'output');
fs.mkdirSync(out, { recursive: true });
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'MexAI Community';
pptx.subject = 'MCP sin reinventar la rueda';
pptx.title = 'Model Context Protocol — MexAI';
pptx.lang = 'es-MX';
const W = 13.333, H = 7.5;
const C = { purple:'51358B', blue:'238DCB', ink:'252333', paper:'FFFFFF', cream:'FAF7F2', yellow:'F7C84B', pale:'EEE9F7', gray:'696573', line:'DCD6E5', red:'D8565B' };
const FONT = 'Arial';
const SH = pptx.ShapeType;

function text(slide, value, x, y, w, h, opts={}) {
  slide.addText(value, { x,y,w,h, isTextBox:true, margin:0, fontFace:FONT, fontSize:opts.size??28,
    bold:opts.bold??false, color:opts.color??C.ink, breakLine:false, valign:'mid',
    align:opts.align??'left', fit:'shrink', ...opts });
}
function bg(slide, dark=false) { slide.background = { color: dark ? C.purple : C.cream }; }
function title(slide, s, dark=false, size=34) { text(slide,s,0.65,0.42,12.05,0.88,{size,bold:true,color:dark?C.paper:C.ink}); }
function photo(slide, file, x=7.45,y=1.36,w=5.25,h=5.55) {
  const p=path.join(root,'assets',file), bytes=fs.readFileSync(p);
  const [iw,ih]=file.endsWith('.jpeg')?[726,1600]:[bytes.readUInt32BE(16),bytes.readUInt32BE(20)];
  const ratio=Math.min(w/iw,h/ih);
  const dw=iw*ratio, dh=ih*ratio;
  slide.addImage({path:p,x:x+(w-dw)/2,y:y+(h-dh)/2,w:dw,h:dh});
}
function line(slide,x1,y1,x2,y2,color=C.purple,width=2.2) { slide.addShape(SH.line,{x:x1,y:y1,w:x2-x1,h:y2-y1,line:{color,width,beginArrowType:'none',endArrowType:'triangle'}}); }
function box(slide,s,x,y,w,h,{fill=C.paper,color=C.ink,size=25,bold=false,lineColor=C.line}={}) {
  slide.addShape(SH.roundRect,{x,y,w,h,rectRadius:0.16,line:{color:lineColor,width:1},fill:{color:fill},radius:0.14});
  text(slide,s,x+0.16,y+0.1,w-0.32,h-0.2,{size,bold,color,align:'center'});
}
function notes(n, extra='') {
  const re=new RegExp(`### ${String(n).padStart(2,'0')}\\.[\\s\\S]*?(?=### ${String(n+1).padStart(2,'0')}\\.|## Material opcional)`);
  const chunk=guide.match(re)?.[0]??'';
  const main=chunk.match(/\*\*NOTAS(?: \/ PLAN DE EJECUCIÓN)?\*\*:\s*([\s\S]*?)(?=\*\*(?:REMATE|PLAN B|FRASE FINAL)\*\*:|$)/)?.[1]?.trim()??'';
  const joke=chunk.match(/\*\*REMATE(?: OPCIONAL)?\*\*:\s*([^\n]+)/)?.[1]??'';
  const backup=chunk.match(/\*\*PLAN B\*\*:\s*([^\n]+)/)?.[1]??'';
  return [main,joke&&`Remate opcional: ${joke}`,backup&&`Plan B: ${backup}`,extra].filter(Boolean).join('\n\n').replace(/\*\*/g,'').replace(/`/g,'');
}
function slide(n,heading,{dark=false,image=null,imageSide='right',body=null,bodySize=34,bodyY=2.0,bodyW=6.2,extra='',headingSize=34}={}) {
  const s=pptx.addSlide(); bg(s,dark); title(s,heading,dark,headingSize);
  if(body) text(s,body,imageSide==='left'?6.7:0.76,bodyY,bodyW,4.2,{size:bodySize,bold:true,color:dark?C.paper:C.ink,valign:'mid'});
  if(image) photo(s,image,imageSide==='left'?0.42:7.45);
  s.addNotes(notes(n,extra));
  return s;
}
function chapter(num,heading,sub,image,color=C.purple) {
  const s=pptx.addSlide(); s.background={color};
  text(s,num,0.65,0.75,2.2,2.1,{size:100,bold:true,color:C.yellow});
  text(s,heading,0.76,3.0,7.2,1.1,{size:43,bold:true,color:C.paper});
  text(s,sub,0.78,4.35,6.75,1.5,{size:27,color:C.paper});
  if(image==='12_alex_presenting_fastmcp.png') photo(s,image,8.1,1.4,4.8,4.6);
  else photo(s,image,8.15,0.8,4.75,6.1);
  s.addNotes(`Preambulo del acto ${num}: ${sub}`);
  return s;
}
function flow(s,items,{y=3.12,w=2.15,gap=0.38,size=22}={}) {
  const total=items.length*w+(items.length-1)*gap, x0=(W-total)/2;
  items.forEach((it,i)=>{ const x=x0+i*(w+gap); box(s,it,x,y,w,1.26,{fill:i===items.length-1?C.pale:C.paper,size,bold:true}); if(i<items.length-1) line(s,x+w+0.05,y+0.63,x+w+gap-0.05,y+0.63,C.blue,2.4); });
}

// I. Del LLM a las herramientas.
slide(1,'MCP: deja de reinventar la rueda',{dark:true,image:'1_alex_and_mexai.png',body:'Model Context Protocol\nDe los LLM a nuestros sistemas\n\nAlejandro Zárate Macías\nMexAI · CIATEQ Zapopan\n30 de septiembre de 2026',bodySize:26,bodyY:1.62,bodyW:6.3});
{const s=pptx.addSlide();bg(s);title(s,'Soy Alejandro Zárate Macías');
  text(s,'AI Engineer',0.8,1.7,6.8,0.7,{size:35,bold:true,color:C.purple});
  text(s,'Instituto de Información Estadística y Geográfica',0.8,2.44,6.7,1.1,{size:27,bold:true});
  text(s,'Investigo embeddings y recuperación de herramientas en español.\n\nHe trabajado con visión por computadora para señales viales.\n\nConecto sistemas reales con agentes.',0.8,3.8,6.7,3.0,{size:25,color:C.ink,valign:'top'});
  photo(s,'alex_real.jpeg',8.35,0.62,4.28,6.35);
  s.addNotes('Presentación personal. Alejandro Zárate Macías es AI Engineer del Instituto de Información Estadística y Geográfica. Investiga embeddings y recuperación de herramientas en español. Ha trabajado en visión por computadora aplicada a señales viales y en agentes conectados a sistemas reales. Foto proporcionada por Alejandro.');
}
slide(2,'¿Quién sabe qué es MCP?',{image:'2_presenting.png',body:'Lo uso\nMe suena\n¿El qué?\nCreo que lo uso y no sabía',bodySize:31,bodyY:1.75});
chapter('I','La IA sabe mucho','¿Qué le falta para trabajar con nuestros datos y sistemas?','3_alex_as_llm_learning.png');
slide(3,'Una enciclopedia encerrada en un cuarto',{image:'3_alex_as_llm_learning.png',body:'Sabe muchísimo ≠ tiene acceso a todo',bodySize:38});
slide(4,'¿Cuánto vendimos ayer?',{image:'4_alex_as_llm_answers_by_memory.png',imageSide:'left',body:'Usuario: ¿Cuánto vendimos ayer?\n\nLLM: “Basándome en patrones históricos…”',bodySize:31});
slide(5,'RAG: pasarle los papeles',{image:'6_alex_as_rag_looking_for_notes.png',body:'Pregunta → recuperación\n→ contexto → respuesta',bodySize:34});
slide(6,'Ya sabe qué hacer… ¿puede hacerlo?',{image:'5_alex_as_llm_alhucinating.png',imageSide:'left',body:'“Perfecto. Ahora crea el ticket y manda el reporte.”\n\n…',bodySize:31});
slide(7,'Le dimos herramientas al agente',{image:'7_alex_as_agent_with_tools.png',body:'LLM: decide\nSistema agente: coordina\nTools: ejecutan',bodySize:32});
{const s=slide(8,'Un agente en acción');flow(s,['Petición','Elige tool','Ejecución','Resultado','Respuesta'],{w:2.13,gap:0.38,size:21});text(s,'“¿Qué tickets siguen abiertos?”    →    list_tickets()    →    3 tickets',1.07,5.05,11.2,0.7,{size:25,color:C.gray,align:'center'});}

// II. Integraciones repetidas.
chapter('II','El precio de conectar','Una integración es fácil. Diez clientes por diez sistemas ya no.','8_alex_as_dev_making_connectors_by_hand.png',C.blue);
slide(9,'Ahora conéctalo a los sistemas reales',{image:'extra_alex_with_pc.png',imageSide:'left',body:'Agente + Drive + GitHub\n+ CRM + sistema interno + …',bodySize:32});
slide(10,'“Solo hay que conectarlo a la API”',{image:'8_alex_as_dev_making_connectors_by_hand.png',body:'OAuth · scopes · tokens\nSDK · paginación · permisos\nAPI v3 · documentación',bodySize:28,extra:'La imagen se reutiliza para remarcar el mismo problema de integración.',headingSize:32});
{const s=slide(11,'Ahora multiplícalo');
  ['Cliente A','Cliente B','Agente interno'].forEach((x,i)=>box(s,x,0.9,2.05+i*1.5,2.75,0.9,{size:23}));
  ['Drive','CRM','Tickets','GitHub'].forEach((x,i)=>box(s,x,9.8,1.65+i*1.3,2.65,0.83,{size:22}));
  [[2.5,1.65],[2.5,2.95],[4,4.25],[4,5.55],[5.5,2.3],[5.5,4.9],[7,3.6]].forEach(([a,b],i)=>line(s,3.65,a,9.78,b,i%2?C.blue:C.purple,1.25));
  text(s,'adaptadores personalizados',4.35,6.48,4.65,0.45,{size:18,color:C.gray,align:'center'});
}

// III. MCP como interfaz común.
chapter('III','Aparece MCP','El puente se convierte en un contrato compartido.','9_alex_discovering_mcp.png');
slide(12,'Un contrato común',{image:'9_alex_discovering_mcp.png',body:'Model Context Protocol\n\nUna forma estándar de exponer capacidades a aplicaciones de IA',bodySize:30});
{const s=slide(13,'Una tool directa todavía no es MCP');
  text(s,'Navegar\nBuscar\nClic\nCopiar',0.95,1.65,4.2,3.8,{size:35,color:C.gray});
  text(s,'→',5.35,2.7,1.0,1.2,{size:69,bold:true,color:C.yellow,align:'center'});
  text(s,'buscar_archivo(nombre)',6.6,2.55,6.1,1.35,{size:34,bold:true,color:C.purple});
  text(s,'MCP estandariza el descubrimiento y uso entre clientes compatibles',6.62,4.12,5.75,1.6,{size:23,color:C.gray});
}
{const s=slide(14,'Un enchufe común');
  text(s,'ANTES',0.85,1.75,2.0,0.6,{size:27,bold:true,color:C.gray});
  text(s,'clientes → adaptadores específicos → sistemas',0.85,2.42,11.65,1.1,{size:30,bold:true});
  s.addShape(SH.line,{x:0.85,y:3.88,w:11.65,h:0,line:{color:C.line,width:2}});
  text(s,'CON MCP',0.85,4.22,3.2,0.6,{size:27,bold:true,color:C.purple});
  text(s,'clientes compatibles → servidores MCP → sistemas',0.85,4.95,11.65,1.25,{size:30,bold:true,color:C.purple});
}
{const s=slide(15,'Host, cliente y servidor');flow(s,['Chat / IDE / agente\n(host)','Cliente MCP','Servidor MCP','API / BD / sistema'],{y:2.72,w:2.75,gap:0.35,size:23});text(s,'El servidor adapta capacidades del sistema real',2.0,5.25,9.33,0.65,{size:27,bold:true,color:C.purple,align:'center'});}
{const s=slide(16,'No todo son tools');[['Tools','acciones'],['Resources','datos'],['Prompts','plantillas']].forEach(([a,b],i)=>{const x=0.83+i*4.22;text(s,String(i+1).padStart(2,'0'),x,1.83,3.6,0.8,{size:31,bold:true,color:C.yellow});text(s,a,x,2.78,3.9,1.05,{size:37,bold:true,color:i===0?C.purple:C.ink});text(s,b,x,4.02,3.9,0.7,{size:28,color:C.gray});});}
{const s=slide(17,'Dile qué hace, no solo cómo se llama',{image:'10_alex_explaining_mcp_diagram.png',body:'create_ticket\n\nCrea un ticket de soporte\n\ntitle · priority · description',bodySize:28,bodyW:6.6});}
{const s=slide(18,'¿Dónde aparece?');[['Documentos','buscar y leer'],['Desarrollo','issues y código'],['Comunicación','mensajes'],['Datos / negocio','consultas y reportes']].forEach(([a,b],i)=>{const x=i%2?6.78:0.85,y=i<2?2.0:4.34;text(s,a,x,y,5.65,0.78,{size:33,bold:true,color:i===3?C.purple:C.ink});text(s,b,x,y+0.78,5.65,0.55,{size:23,color:C.gray});});}

// IV. Sistemas existentes.
chapter('IV','Volvamos a la oficina','Ese sistema que ya funciona también puede participar.','extra_alex_pointing_something_at_left_with_sorprise.png',C.blue);
slide(19,'Ese sistema interno de 2017',{image:'extra_alex_pointing_something_at_left_with_sorprise.png',body:'Tu sistema ya resuelve problemas.\n\nTu agente ni siquiera sabe que existe.',bodySize:31});
slide(20,'¿Otro chatbot corporativo™?',{image:'11_alex_as_person_tired_of_new_chatbot_for_just_one_system.png',body:'Una tarea → ¿otro portal + otro login + otro chat?',bodySize:34});
{const s=slide(21,'Ponle MCP encima');
  text(s,'Chat compatible',0.87,2.0,5.2,0.8,{size:32,bold:true});
  text(s,'↓',0.87,2.82,1,0.58,{size:35,color:C.blue});
  text(s,'Servidor MCP',0.87,3.42,5.4,0.8,{size:38,bold:true,color:C.purple});
  text(s,'↓',0.87,4.25,1,0.58,{size:35,color:C.blue});
  text(s,'API existente → lógica y datos',0.87,4.88,10.9,0.9,{size:32,bold:true});
  text(s,'list_tickets · create_ticket · get_ticket_status',0.87,6.08,11.2,0.6,{size:22,color:C.gray});
}
{const s=slide(22,'FastMCP sobre una API existente',{headingSize:32});
  s.addShape(SH.roundRect,{x:0.72,y:1.5,w:7.2,h:5.38,rectRadius:0.1,fill:{color:'262438'},line:{color:'262438',width:0}});
  text(s,'from fastmcp import FastMCP\n\nmcp = FastMCP("Tickets")\n\n@mcp.tool\ndef list_tickets() -> list[dict]:\n    """Tickets visibles al usuario."""\n    return api.list_tickets()',1.03,1.83,6.58,4.8,{size:21,fontFace:'Courier New',color:C.paper,breakLine:false,valign:'top'});
  photo(s,'12_alex_presenting_fastmcp.png',8.15,1.65,4.55,4.95);
}
{const s=slide(23,'Del terminal al chat habitual');
  text(s,'Terminal\nconfiguración\ncliente técnico',0.93,2.0,5.05,3.0,{size:32,bold:true,color:C.gray});
  s.addShape(SH.line,{x:6.5,y:1.75,w:0,h:4.5,line:{color:C.blue,width:3}});
  text(s,'Chat compatible\nintegración autorizada',7.15,2.07,5.0,2.6,{size:36,bold:true,color:C.purple});
}

// V. Demo, límites y cierre.
chapter('V','Del diagrama a la práctica','Una consulta, una acción y una verificación real.','12_alex_presenting_fastmcp.png');
{const s=slide(24,'De mi API a tu chat');flow(s,['Sistema de tickets\nFastAPI','FastMCP','HTTPS\nTailscale Funnel','ChatGPT\nsi está habilitado'],{y:2.75,w:2.76,gap:0.34,size:22});text(s,'Entorno ficticio · datos de prueba',2.6,5.35,8.13,0.7,{size:23,color:C.gray,align:'center'});}
{const s=slide(25,'Demo en vivo');[['01','Consulta'],['02','Acción'],['03','Verificación']].forEach(([a,b],i)=>{const x=0.9+i*4.18;text(s,a,x,2.03,3.7,1.25,{size:74,bold:true,color:C.yellow});text(s,b,x,3.55,3.8,1.0,{size:35,bold:true,color:C.purple});});text(s,'Mostrar el cambio en el sistema original',0.9,5.55,11.5,0.8,{size:27,color:C.gray});}
slide(26,'Que pueda no significa que deba',{image:'13_alex_with_shield_of_auth.png',body:'Identidad\nPermisos\nConfirmaciones\nAuditoría',bodySize:37});
slide(27,'Desinflando el hype',{image:'extra_alex_palmface.png',body:'No es un modelo\nNo es un agente\nNo inventó las tools\nNo reemplaza permisos',bodySize:30});
{const s=slide(28,'De saber a hacer, sin repetir integraciones',{dark:true,headingSize:31});
  ['LLM','RAG','Agente','MCP'].forEach((x,i)=>{text(s,x,0.85+i*3.15,2.2,2.9,0.95,{size:39,bold:true,color:i===3?C.yellow:C.paper});text(s,['responde','aporta contexto','coordina','conecta'][i],0.85+i*3.15,3.2,2.9,0.6,{size:22,color:C.paper});});
  text(s,'No construyamos el mismo puente una y otra vez',0.86,5.25,11.65,1.0,{size:31,bold:true,color:C.paper});
}
slide(29,'¿Y ahora quién sabe qué es MCP?',{dark:true,image:'2_presenting.png',body:'Lo uso\nMe suena\n¿El qué?\nCreo que lo uso y no sabía',bodySize:30,bodyY:1.8,extra:'[PENDIENTE] Agregar QR o URL solo cuando exista un enlace real.'});

const output=path.join(out,'MCP-MexAI-presentacion.pptx');
await pptx.writeFile({fileName:output});
console.log(output);
