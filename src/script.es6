import jQuery from 'jquery'
import levenshtein from 'levenshtein.js'

window.$ = window.jQuery = jQuery;

function simularity(word, target)
{
    var simularity = levenshtein.get(word, target);
    var length = target.length;
    return (length-simularity)/length;
}


$(function()
{
    $("#content").html(simularity("hello", "hallow"));
});
