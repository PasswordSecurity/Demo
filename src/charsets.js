(function() {
	var Charsets = {
		lower_alpha: "abcdefghijklmnopqrstuvwxyz",
		upper_alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		numeric: "1234567890",
		symbolic: "!@$<>+%",

		getCharsetsCharacterCount: function(instr)
		{
			var charCount = 0;
			[Charsets.lower_alpha, Charsets.upper_alpha, Charsets.numeric,Charsets.symbolic].forEach(function(charset) {
				charCount += (Array.from(charset).filter((n) => instr.indexOf(n) !== -1).length > 0) ? charset.length : 0;});
			return charCount;
		}
	};
	if (typeof module !== "undefined" && module !== null && typeof exports !== "undefined" && module.exports === exports) {
		  module.exports = Charsets;
	}
})()