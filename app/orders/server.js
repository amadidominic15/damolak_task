const http=require('node:http');
const orders=[{id:'ORD-1001',customer:'Alex Morgan',item:'Everyday Backpack',status:'Processing'},{id:'ORD-1002',customer:'Sam Lee',item:'Wireless Headphones',status:'Shipped'}];
http.createServer((req,res)=>{
  res.setHeader('Content-Type','application/json');res.setHeader('X-Content-Type-Options','nosniff');
  if(req.url==='/healthz'||req.url==='/readyz'){res.writeHead(200);return res.end(JSON.stringify({status:'ok',service:'orders'}));}
  if(req.method==='GET'&&(req.url==='/api/orders'||req.url==='/api/orders/')){res.writeHead(200);return res.end(JSON.stringify({service:'orders',items:orders}));}
  if(req.method==='POST'&&req.url==='/api/orders'){
    let body='';req.on('data',chunk=>{body+=chunk;if(body.length>8192)req.destroy();});
    req.on('end',()=>{let input;try{input=JSON.parse(body||'{}');}catch{res.writeHead(400);return res.end(JSON.stringify({error:'invalid JSON'}));}
      if(typeof input.item!=='string'||!input.item.trim()){res.writeHead(400);return res.end(JSON.stringify({error:'item is required'}));}
      res.writeHead(201);res.end(JSON.stringify({item:{id:`ORD-${Date.now()}`,customer:typeof input.customer==='string'&&input.customer.trim()?input.customer.trim():'Guest',item:input.item.trim(),status:'Received (demo only)'}}));
    });return;
  }
  res.writeHead(404);res.end(JSON.stringify({error:'not found'}));
}).listen(3001,'0.0.0.0',()=>console.log('orders listening on 3001'));
