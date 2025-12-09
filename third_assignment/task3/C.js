const bf = Buffer.alloc(10);
console.log(bf);
bf.write("hello world");
console.log(bf);
console.log(bf.toString());
//node coverts each character of the string into utf-8 and stores it into the buffer
//after that when we convert it to the string it does the opposite