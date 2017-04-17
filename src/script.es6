window.jQuery = window.$ = require('jquery');
require('jquery-ui');
import levenshtein from 'levenshtein.js';
import {wordList as _wordList} from 'wordlist.js';
import {subDict} from 'substitution.js';
import Charsets from 'charsets.js';



(function() {
    String.prototype.replaceAt=function(index, replacement) {
        return this.substr(0, index) + replacement+ this.substr(index + 1);
    }
    function allSubstitution(strin)
    {
        var rule = subDict;
        var stack = [[strin,0]];
        var ret = [];
        var rule_keys = Object.keys(rule);
        while (stack.length > 0)
        {
            var _current = stack.pop();
            var pass = _current[0];
            var index = _current[1]+1;

            ret.push(pass);

            for (; index < pass.length; index++)
            {
                if (rule_keys.indexOf(pass[index]) !== -1)
                {
                    var _rule = rule[pass[index]];
                    stack.push([pass,index]);
                    _rule.forEach(function(r) {
                        stack.push([pass.replaceAt(index, r),index+r.length-1]);
                    });
                    break;
                }
            }
        }

        return ret;
    }
    /*var wordList = _wordList.reduce(function(acc, val){
        allSubstitution(val).forEach(v => acc.push(v.toLowerCase()));
        return acc;
    }, []);*/
    var wordList = _wordList;
    function getTime(d)
    {
        var r = {};
        var s = {
            years: 31536000,
            months: 2592000,
            weeks: 604800,
            days: 86400,
            hours: 3600,
            minutes: 60,
            seconds: 1,
        };

        Object.keys(s).forEach(function(key){
            r[key] = Math.floor(d / s[key]);
            d -= r[key] * s[key];
        });
        r["seconds"] += d;

        var result = "";
        Object.keys(r).forEach(function(key){
            result += key + ": " + r[key] + " ";
        });
        return result;
    }
    function similarity(word, target)
    {
        var simularity = levenshtein.get(word, target);
        var length = target.length;
        return (length-simularity)/length;
    }
    function findDict(password, threshhold)
    {
        var sim_list = wordList.map((pass) => [pass, similarity(password, pass)]).filter((v) => v[1] >= threshhold).sort(function(a,b){
            if (a[1] > b[1]) return -1;
            if (a[1] < b[1]) return 1;
            return 0;
        });
        return sim_list[0];
    }
    $.widget('nt.checkPassword', {
        options: {},
        _create: function () {
            var self = this;

            this.element.addClass("password-check");
            this.element.wrap("<div></div>");
            this._dialog = $(`<div class="password-check-container">
                            Character set size: <span class="password-charset"></span><br>
                            Password complexity: <span class="password-complexity"></span><br>
                            Time to crack: <span class="password-time"></span><br>
                            Crack method: <span class="password-method"></span>
                            </div>`)
                            .insertAfter(this.element);

            this.options.password = this.element.val();
            this.options.speed = 1072000000;
            this.options.threshhold = .8;
            this.options.dict = true;
            self.value(0);
            this.element.on("input paste", function(){
                self.value($(this).val());
            });
            this._super();
        },
        _destroy: function (){
            this.element.removeClass("password-check");
            this.element.parent().find(".password-check-container").remove();
        },
        _setOption: function(key, value) {
            var self = this;
            if (value !== undefined)
            {
                var fnList = {
                    'password': function() {
                        self.recalculate();
                    },
                    'speed': function() {
                        self.recalculate();
                    },
                    'threshhold': function(){
                        self.recalculate();
                    },
                    'dict': function(){
                        self.recalculate();
                    }
                }

                this._super( key, value );

                if (key in fnList)
                {
                    fnList[key]();
                }
            
                return this.options[key];

            }
            else
                return this.options[key];
        },
        recalculate: function()
        {
            var password = this.options.password;
            var container = this.element.parent();
            if (password !== undefined && password.length > 0)
            {

                var charset = Charsets.getCharsetsCharacterCount(password);
                var complexity = Math.pow(charset, password.length);
                var time_in_seconds = complexity / this.options.speed;
                var found_dict = false
                var dict_result = undefined;
                if (this.options.dict)
                {
                    dict_result = findDict(password.toLowerCase(), this.options.threshhold);
                    found_dict = dict_result !== undefined;
                }
                container.find($(".password-charset")).text(charset);
                container.find($(".password-complexity")).text(found_dict ? (dict_result[1]*100) + "% similar to " + dict_result[0] + " (ignoring case)": complexity);
                container.find($(".password-time")).text(found_dict ? "Really Quick" : getTime(time_in_seconds));
                container.find($(".password-method")).text(found_dict ? (dict_result[1] == 1 ? "Dictionary Attack!" : "Hybrid Attack") : "Brute Force");
            } else
            {
                container.find($(".password-charset")).text("");
                container.find($(".password-complexity")).text("");
                container.find($(".password-time")).text("");
                container.find($(".password-method")).text("");
            }
        },
        value: function(password) {
            this.options.password = password;
            this.recalculate();
        }
    });
})();
