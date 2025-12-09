const bf = Buffer.from("hello world");
console.log(bf.toString("hex"));
console.log(bf.toString("base64"));
console.log(bf.toString("utf8"));
const hx = bf.toString("hex");
const hxb = Buffer.from(hx, "hex");
console.log(hxb.toString());

