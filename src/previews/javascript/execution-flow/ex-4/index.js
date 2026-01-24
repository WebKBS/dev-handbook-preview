console.log("A");

setTimeout(() => console.log("B"), 0);
setTimeout(() => console.log("C"), 100);

Promise.resolve().then(() => console.log("D"));

console.log("E");
