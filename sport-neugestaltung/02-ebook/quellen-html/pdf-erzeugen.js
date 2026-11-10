const {chromium}=require('playwright');
(async()=>{
  const [html,pdf,png]=process.argv.slice(2);
  const b=await chromium.launch(); const pg=await b.newPage({deviceScaleFactor:2,viewport:{width:1700,height:1200}});
  await pg.goto('file://'+html,{waitUntil:'networkidle'}); await pg.evaluate(()=>document.fonts.ready);
  if(png){await pg.screenshot({path:png,fullPage:true});}
  await pg.emulateMedia({media:'print'});
  await pg.pdf({path:pdf,preferCSSPageSize:true,printBackground:true});
  await b.close();
})();
