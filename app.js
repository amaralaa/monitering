#! /usr/bin/env node

var exec = require('child_process').exec;
var readline = require('readline');
var hosts = [];
var stop = false;
var BgRed = "\x1b[41m";
var BgGreen = "\x1b[42m";
var BgYellow = "\x1b[43m";
var Reset = "\x1b[0m";
var clear = '\033c';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.input.on('keypress', (str,key)=>{
    readline.clearLine(process.stdout,0);
    console.log('Good bye ...','\x1B[?25h');
    process.exit(0);
});

for(var i = 2; i <= process.argv.length ; i++){
    if(process.argv[i] !== undefined){
        hosts.push(process.argv[i]);
    }
}
if(!hosts.length){
    hosts.push('google.com');
    hosts.push('8.8.8.8');
    hosts.push('1.1.1.1');
    hosts.push('localhost');
}

function ping (host,stop,cb){
    (function pinghost(host){exec('ping -c 1 -n '+host,(e,stdOut,stdErr)=>{
        if(e) {
            pinghost(host);
            return cb(e,null);
        }
        if(stdErr) {
            pinghost(host);
            return cb(stdErr,null)
        }
        out = stdOut.match(/time=(.+?) ms/);
        time = out[0].toString().split('=');
        output=host + ' is Alive with responce time ' + time[1];
        pinghost(host);
        return cb(null,output);
    })})(host)
}
readline.cursorTo(process.stdout,0,0);
readline.clearScreenDown(process.stdout);
console.log('Press Any key Any time to exist monitor ....','\x1B[?25l')
if(hosts.length){
    hosts.forEach(function(host,i) {
        new ping(host,stop,(e,time)=>{
            if(e){
                readline.cursorTo(process.stdout,0,i+2);
                readline.clearLine(process.stdout,0);
                return console.log(BgRed,host + ' ====> Fail',Reset,host + ' Error check this host');
            }
            readline.cursorTo(process.stdout,0,i+2);
            readline.clearLine(process.stdout,0);
            return console.log(BgGreen,host + ' ====> Alive',Reset,time);
        })
    }, this);
}