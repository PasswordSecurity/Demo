window.jQuery = window.$ = require('jquery');
require('jquery-ui');
import levenshtein from 'levenshtein.js';
import {johnList} from 'john.js';
import Charsets from 'charsets.js';



(function() {
    String.prototype.replaceAt=function(index, replacement) {
        return this.substr(0, index) + replacement+ this.substr(index + 1);
    }
    function allSubstitution(strin)
    {
        var rule = {
            'a':['4','@'],
            'A':['4','@'],
            'b':['6','|3'],
            'B':['6','|3'],
            'c':['<','{'],
            'C':['<','{'],
            'e':['3'],
            'E':['3'],
            'g':['9'],
            'G':['9'],
            'i':['1','!'],
            'I':['1','!'],
            'o':['0'],
            'O':['0'],
            'q':['9'],
            'Q':['9'],
            's':['5','$'],
            'S':['5','$'],
            't':['7','+'],
            'T':['7','+'],
            'x':['%'],
            'X':['%'],
        };


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
    var wordList = johnList.reduce(function(acc, val){
        allSubstitution(val).forEach(v => acc.push(v.toLowerCase()));
        return acc;
    }, []);
    console.log(wordList);
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
            this.options.speed = 100000000000;
            this.options.threshhold = .8;
            self.value(0);
            this.element.on("input paste", function(){
                self.value($(this).val());
            });
        },
        _destroy: function (){
            this.element.removeClass("password-check");
            this.element.parent().find(".password-check-container").remove();
        },
        value: function(password) {
            var container = this.element.parent();
            this.options.password = password;
            if (password !== undefined && password.length > 0)
            {

                var charset = Charsets.getCharsetsCharacterCount(password);
                var complexity = Math.pow(charset, password.length);
                var time_in_seconds = complexity / this.options.speed;
                var dict_result = findDict(password.toLowerCase(), this.options.threshhold);
                var found_dict = dict_result !== undefined;
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
        }
    });
})();
