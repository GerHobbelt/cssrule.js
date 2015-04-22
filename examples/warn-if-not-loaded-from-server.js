// 
// As the dynamic adding of CSS rules is bound by security checks by modern browsers,
// this type of activity will only succeed when the page is properly served through
// a web server.
// 
// This little module checks for that and runs user-specified `pass` or `fail` code to
// report the situation at hand.
// 

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return (root.isLoadedFromServer = factory(root));
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(root);
    } else {
        // Browser globals
        root.isLoadedFromServer = factory(root);
    }
}(this, function (win) {
    function getProtocol() {
        return (win && win.location && win.location.protocol) || false;
    }
    
    // Define the default NOP (No Operation) action
    function nop(protocol, pass_or_fail) {
        return pass_or_fail;
    }

    // Return a falsey value when the protocol *fails* the test; a truthy value otherwise.
    function test(protocol) {
        switch(protocol) {
        case 'http:':
        case 'https:':
            // remote file over http or https
            return true;

        default: 
            // some other protocol
        case 'file:':
            // local file
            return false;
        }
    }

    function isLoadedFromServer(fail_cb, pass_cb, test_cb) {
        var protocol = getProtocol();
        fail_cb = fail_cb || nop;
        pass_cb = pass_cb || nop;
        test_cb = test_cb || test;  // supposed to produce a truthy value when the test PASSES
        var rv = test_cb.call(win, protocol);
        if (rv) {
            rv = pass_cb.call(win, protocol, rv);
        } else {
            rv = fail_cb.call(win, protocol, rv);
        }
        return rv;      // deliver the optional return value produced by the `pass` or `fail` user callback back to the calling userland code.
    }

    isLoadedFromServer.test = test;
    isLoadedFromServer.getProtocol = getProtocol;

    return isLoadedFromServer;
}));



