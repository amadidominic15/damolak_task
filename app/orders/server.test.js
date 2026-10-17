const test=require('node:test');const assert=require('node:assert/strict');
test('blank item is invalid',()=>{const item='   ';assert.equal(item.trim().length,0);});
