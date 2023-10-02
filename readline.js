//cli application using the readline module
const readline = require('readline');
const fs = require('fs').promises;
const {program} = require('commander');
const {colors} = require('colors');

program.option(
    '-f, --file [type]',
    'file for saving game results',
    'results.txt',
);

program.parse(process.argv);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let count = 0; //amount of tries it took user to guess
const logFile = program.opts().file; //get the file from the program object for the commander module
const mind = Math.floor(Math.random() * 10) + 1 //make a rand number 1-10


//check if user provided a number between 1 - 10
const isVlaid = value => {
    if (isNaN(value)){
        console.log('Enter a number!'.red);
        return false;
    }
    if(value < 1 || value > 10){
        console.log("Number must be between 1 and 10".red);
        return false;
    }
    return true;
}

const log = async data => {
    try{
        await fs.appendFile(logFile, `${data}\n`);
        console.log(`succeeded in saving the result to file ${logFile}`.green)
    }
    catch(err){
        console.error('failed to create file');
    }
}

const game = () => {
    rl.question(
       "Enter a number between 1 and 10 to guess: ".yellow,
       value => {
        let a = +value;
        if(!isVlaid(a)){
            game();
            return;
        }
        count +=1;
        if(a === mind){
            console.log(`Congratulations, you guessed the number in ${count} steps(s)`.green);
            log(
                `${new Date().toLocaleDateString()}: Coungratulations, you guessed the number in ${count} steps`, 
            ).finally(() => rl.close());
            return;
        }
        console.log('You guessed it wrong, try again'.red);
        game();
       }, 
    );
};

game();