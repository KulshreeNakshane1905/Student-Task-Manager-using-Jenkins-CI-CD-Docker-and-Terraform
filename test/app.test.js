const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const os=require("node:os");
const path=require("node:path");
const app=require("../server");

test("health endpoint reports application status",async()=>{
 const server=app.listen(0);const port=server.address().port;
 try{const r=await fetch(`http://127.0.0.1:${port}/health`);assert.equal(r.status,200);const body=await r.json();assert.equal(body.status,"ok");assert.equal(body.application,"Student Task Manager")}
 finally{await new Promise(resolve=>server.close(resolve))}
});

test("task API validates and creates a task",async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"stm-test-"));const old=process.env.DATA_DIR;process.env.DATA_DIR=dir;
 const server=app.listen(0);const base=`http://127.0.0.1:${server.address().port}`;
 try{
  const bad=await fetch(`${base}/api/tasks`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:" "})});assert.equal(bad.status,400);
  const good=await fetch(`${base}/api/tasks`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:"Complete assignment"})});assert.equal(good.status,201);const task=await good.json();assert.equal(task.title,"Complete assignment");assert.equal(task.status,"Pending");
 }finally{await new Promise(resolve=>server.close(resolve));if(old===undefined)delete process.env.DATA_DIR;else process.env.DATA_DIR=old;fs.rmSync(dir,{recursive:true,force:true})}
});
