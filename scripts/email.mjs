import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { renderEmail } from './email/render.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export async function createSendState(folder, mode, slug) {
 const base=path.join(folder,'history',mode,slug);
 await fs.mkdir(base,{recursive:true,mode:0o700});
 // Every explicit test is a new attempt; production keeps stable per-post history.
 return mode==='test' ? fs.mkdtemp(path.join(base,'attempt-')) : base;
}
export async function deliver({message, recipients, state, transport}) {
 let accepted=0, skipped=0;
 for(const recipient of recipients) {
  const key=createHash('sha256').update(recipient.toLowerCase()).digest('hex');
  try { const prior=JSON.parse(await fs.readFile(path.join(state,key+'.json'),'utf8')); if(prior.status==='accepted') { skipped++; continue; } throw new Error('Recipient pending; review private history before retrying.'); }
  catch(e) { if(e.code!=='ENOENT') throw e; }
  const file=path.join(state,key+'.json');
  // Reserve before the request. Ambiguous network failures remain pending, never automatically retried.
  await fs.writeFile(file,JSON.stringify({status:'pending',at:new Date().toISOString(),hash:createHash('sha256').update(message.html).digest('hex')}),{flag:'wx',mode:0o600});
  const result=await transport(recipient,message);
  await fs.writeFile(file,JSON.stringify({status:'accepted',at:new Date().toISOString(),id:result.id}),{mode:0o600});
  accepted++;
 }
 return {accepted,skipped};
}
async function main() {
 const [mode,slug,...extra]=process.argv.slice(2);
 if(!['preview','test','send'].includes(mode)||!slug||!/^[-a-z0-9]+$/.test(slug)||extra.length) throw new Error('Usage: pnpm email:preview|email:test|email:send <post-slug>');
 const folder=path.join(root,'.email'); await fs.mkdir(folder,{recursive:true,mode:0o700});
 // Always render current Markdown/MDX through Astro, including the media rewrite.
 const build=spawnSync('pnpm',['build'],{cwd:root,stdio:'inherit'});
 if(build.status!==0) throw new Error('Build failed; no email sent.');
 const page=await fs.readFile(path.join(root,'dist',slug,'index.html'),'utf8');
 const site=process.env.EMAIL_SITE_URL || 'https://herebedragons.club';
 const postUrl=new URL(`/${slug}/`,site).href;
 const message=renderEmail(page,postUrl);
 const output=path.join(folder,'previews',slug); await fs.mkdir(output,{recursive:true});
 await fs.writeFile(path.join(output,'index.html'),message.html); await fs.writeFile(path.join(output,'message.txt'),message.text);
 console.log(`Email preview: ${path.join(output,'index.html')}`);
 if(mode==='preview') return;
 const config=JSON.parse(await fs.readFile(path.join(folder,'config.json'),'utf8'));
 const recipients=mode==='test'?[config.testTo]:config.recipients;
 if(!Array.isArray(recipients)||!recipients.length||recipients.some(r=>typeof r!=='string'||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r))||new Set(recipients.map(r=>r.toLowerCase())).size!==recipients.length) throw new Error('Configure valid unique recipients in .email/config.json.');
 if(!config.from || /[\r\n]/.test(config.from) || !config.domain || !/^[a-z0-9.-]+$/i.test(config.domain)||!process.env.MAILGUN_API_KEY) throw new Error('Configure from/domain and MAILGUN_API_KEY first.');
 // Refuse to mail a recap whose current content is not yet published.
 const live=await fetch(postUrl,{signal:AbortSignal.timeout(15000)});
 if(!live.ok || renderEmail(await live.text(),postUrl).html!==message.html) throw new Error('Live post differs from this build. Publish and verify it before emailing.');
 const state=await createSendState(folder,mode,slug);
 const lock=await fs.open(path.join(folder,'send.lock'),'wx',0o600);
 try {
  const result=await deliver({message,recipients,state,transport:async (recipient,m)=>{
   const data=new FormData(); for(const [key,value] of Object.entries({from:config.from,to:recipient,subject:(mode==='test'?'[TEST] ':'')+m.subject,html:m.html,text:m.text,'o:tracking':'no'})) data.set(key,value);
   const host=config.region==='eu'?'api.eu.mailgun.net':'api.mailgun.net';
   const response=await fetch(`https://${host}/v3/${config.domain}/messages`,{method:'POST',headers:{Authorization:'Basic '+Buffer.from('api:'+process.env.MAILGUN_API_KEY).toString('base64')},body:data,signal:AbortSignal.timeout(30000)});
   if(!response.ok) throw new Error(`Mailgun returned ${response.status}; inspect provider logs before retrying.`);
   return response.json();
  }});
  console.log(`Mailgun accepted ${result.accepted} message(s); skipped ${result.skipped} already accepted recipient(s).`);
 } finally { await lock.close(); await fs.unlink(path.join(folder,'send.lock')); }
}
if(process.argv[1]===fileURLToPath(import.meta.url)) main().catch(e=>{console.error(e.message);process.exitCode=1;});
