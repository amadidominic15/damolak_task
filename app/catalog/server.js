const http = require('node:http');
const products = [
  {id:1,name:'Everyday Backpack',price:39.99,category:'Accessories'},
  {id:2,name:'Wireless Headphones',price:79,category:'Electronics'},
  {id:3,name:'Ceramic Travel Mug',price:18.5,category:'Home'},
  {id:4,name:'Desk Lamp',price:32,category:'Home'}
];
http.createServer((req,res)=>{
  res.setHeader('Content-Type','application/json');
  res.setHeader('X-Content-Type-Options','nosniff');
  if (req.url==='/healthz'||req.url==='/readyz') {res.writeHead(200);return res.end(JSON.stringify({status:'ok',service:'catalog'}));}
  if (req.url==='/api/catalog'||req.url==='/api/catalog/') {res.writeHead(200);return res.end(JSON.stringify({service:'catalog',items:products}));}
  res.writeHead(404);res.end(JSON.stringify({error:'not found'}));
}).listen(3000,'0.0.0.0',()=>console.log('catalog listening on 3000'));
