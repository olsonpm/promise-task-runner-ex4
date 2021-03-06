'use strict';

//---------//
// Imports //
//---------//

var ptr = require('promise-task-runner')
    , PromiseTask = ptr.PromiseTask
    , PromiseTaskContainer = ptr.PromiseTaskContainer;


//------//
// Init //
//------//

var ptc = new PromiseTaskContainer();


//-------//
// Tasks //
//-------//

var myTests = {
    test1: t1
    , test2: t2
};

function t1() {
    return 'passed';
}

function t2() {
    return 'failed';
}

var test = new PromiseTask()
    .id('test')
    .task(function() {
        var testToRun = this.globalArgs().testToRun;
        return myTests[testToRun]();
    });

var deploy = new PromiseTask()
    .id('deploy')
    .dependencies(test)
    .task(function(resultsArray) {
        var env = this.globalArgs().env;
        if (env === 'prod' && resultsArray[0] === 'failed') {
            console.log('Test failed, not deploying to ' + env);
        } else {
            console.log('Deployed to ' + env);
        }
    });

ptc.addTasks(test, deploy);


//---------//
// Exports //
//---------//

module.exports = ptc;
