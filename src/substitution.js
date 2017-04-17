(function() {
	var Substitution = {
		subDict: {
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
        }
	}
	if (typeof module !== "undefined" && module !== null && typeof exports !== "undefined" && module.exports === exports) {
		  module.exports = Substitution;
	}
})();