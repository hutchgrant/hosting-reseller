/*
* Handlebar helper to compare variables 
*      
*      {{#compare something somethingelse operator="=="}} 
*      <p>show something</p> 
*      {{/compare}}
*
* @param {any} val1 left value
* @param {any} val2 right value
* @param {any} operator operator
* @returns {boolean}  
*/
var config = {};

exports.compare = function(){
    return function (lvalue, rvalue, options) { 
          if (arguments.length < 3)
              throw new Error("Handlebars Helper 'compare' needs 2 parameters");

          var operator = options.hash.operator || "==";

          var operators = {
              '==':       function(l,r) { return l == r; },
              '===':      function(l,r) { return l === r; },
              '!=':       function(l,r) { return l != r; },
              '<':        function(l,r) { return l < r; },
              '>':        function(l,r) { return l > r; },
              '<=':       function(l,r) { return l <= r; },
              '>=':       function(l,r) { return l >= r; },
              'typeof':   function(l,r) { return typeof l == r; }
          }

          if (!operators[operator])
              throw new Error("Handlebars Helper 'compare' doesn't know the operator "+operator);

          var result = operators[operator](lvalue,rvalue);

          if( result ) {
              return options.fn(this);
          } else {
              return options.inverse(this);
          }
        };
}
exports.init = function(c){
    config = c;
}
/*
* Handlebar helper to display site preference variables
*      {{config "sitename"}}
*
* @param {any} keyvalue
* @returns {String}  
*/
exports.config = function(){
    return function (lvalue, rvalue) { 
        for(key in config){
            if(key == lvalue){
                if(typeof(config[key]) === 'object'){
                    for(subkey in config[key]){
                        if(subkey == rvalue){
                            return config[key][subkey];
                        }
                    }
                }else{
                    return config[key];
                } 
            }
        }
    }
}