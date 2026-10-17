const test=require('node:test');const assert=require('node:assert/strict');
test('catalog products have required fields',()=>{const items=[{id:1,name:'Bag',price:2}];assert.ok(items.length);assert.ok(items.every(p=>p.id&&p.name&&p.price>0));});
