// Add a new partition and add new user with access to iControl REST

var fs = require('fs');
var request = require('request');

//Do not verify certificates
var request = request.defaults({strictSSL: false, rejectUnauthorized: false});

//Your username, password, and the BIG-IP managment IP
var username = 'admin',           //username of admin on BIG-IP
    password = 'PASSWORD',        //password of admin on BIG-IP
    dusername = 'ictrlUser',      //username of new user
    dpassword = 'somePassword',   //the unencrypted value of encryptedPassword string in newUser.json
    mgmtUrl = 'xxx.xxx.xxx.xxx',  //Substitute the working management IP for your BIG-IP here 
    endpoint = mgmtUrl + '/mgmt/tm/',
    baseUrl = 'https://' + username + ':' + password + '@' + endpoint,
    dbaseUrl = 'https://' + dusername + ':' + dpassword + '@' + endpoint,
    ictrlA = 'https://' + username + ':' + password + '@' + mgmtUrl +'/mgmt/shared/authz/roles/iControl_REST_API_User';

//Read input file and create resource using HTTP POST to iControl REST API
//f is the input file e.g. f='ictrlPart.json' then f='newUser.json'
//t is the target url for e.g. t=sys/folder then t= auth/user
//cb means callback

//Define function that adds resource using the iControl REST API and HTTP POST 
function addRsc(f, t, cb) {
    console.log('\nAdd JSON in ' + f + ' to ' + t);
    fs.createReadStream(f).pipe(request.post(baseUrl + t))
   .on('error', function(err) {console.log(err)})
   .on('response', function(res) {console.log('STATUS: '+ res.statusCode)})
   .on('response', function(res) {cb()});
}

//Define function that verifies new-user-access to iControl REST API using HTTP GET  
function dgetRsc(dt, cb) {
    request(dbaseUrl + dt, function(err, res, body) {
        if (!err && res.statusCode == 200) {
        console.log('\nVerify new-user access to iControl REST API');
        cb();
       }
    });
}

//Define function that adds new-user-access to iControl REST API using HTTP GET  
function patchRsc(f, url, cb) {
    console.log('\nPatch JSON in ' + f + ' into iControl_REST_API_User');
    fs.createReadStream(f).pipe(request.patch(url))
   .on('error', function(err) {console.log(err)})
   .on('response', function(res) {console.log('STATUS: '+ res.statusCode)})
   .on('response', function(res) {cb()});
}

//Define function that adds a new partition
function crPart(cb) { 
    addRsc('ictrlPart.json', 'sys/folder', function () {
        console.log('NEW PARTITION: ictrl_part');
        cb(); 
    });
}

//Define function that adds new User (manager)
function addUser(cb) { 
    addRsc('newUser.json', 'auth/user', function () {
        console.log('NEW-USER (manager): ictrlUser' + "\ntemporary password: somePassword");
        cb(); 
    });
}

//Define function to add iControl REST API access
function addPerm(cb) { 
    patchRsc('ictrlREST.json', ictrlA, function () {
        console.log('ACCESS to iControl REST API: ictrlUser');
        cb(); 
    });
}

//Define function to check iControl REST API access
function ckPerms(cb) {
    dgetRsc('sys/license', function () {
        console.log('CONFIRMED: New-user has access to the iControl REST API');      
        cb();
    });
}

//Create and Verify resources
crPart(function () {
    addUser(function () {
        addPerm(function () {
            ckPerms(function () {
                logComplete();
            });
        });
    });
});

//Log completion of sample
function logComplete() {
    console.log('\nEXAMPLE COMPLETE');
}