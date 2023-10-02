const {program} = require('commander');

console.log(process.argv)

program 
    .option('-n, --name <name>', "Your Name")
    .option('-a --age <age>', "your age")
    .parse(process.argv);

const {name, age} = program.opts();

if(!name || !age){
    console.error("Both params required");
    process.exit(1);
}

console.log(`Hello! ${name}! You are ${age} years old`);