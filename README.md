# Implementing The Code

Rename bundle.js if desired.

```html
<script src="bundle.js"></script>
```

## Using the code:

Use javascript!

On any element call .checkPassword()

Options:
1. speed
- How many hashes/second
2. theshhold
- When to consider it a hybrid attack
3. dict
- Whether or not to use dictionary

Example:
```JavaScript
        $(function() {
            $("#password").checkPassword();
			
			//Settings
            $("#speed").val($("#password").checkPassword("option", "speed"));
            $("#speed").on("input paste", function(){
                $("#password").checkPassword("option", "speed", parseInt($(this).val()));
            });
            $("#threshhold").val($("#password").checkPassword("option", "threshhold"));
            $("#threshhold").on("input paste", function(){
                if (parseFloat($(this).val()) > 0)
                        $("#password").checkPassword("option", "threshhold", parseFloat($(this).val()));
            });
            $("#dictionary").prop("checked", $("#password").checkPassword("option", "dict"));
            $("#dictionary").change(function(){
                $("#password").checkPassword("option", "dict", $(this).prop("checked"));
            })
        });
```

## Stylizing the Code:

CSS:
```CSS
.password-check-container.password-charset {...}
.password-check-container.password-complexity {...}
.password-check-container.password-time {...}
.password-check-container.password-method {...}
```


# Building

## NEEDED GLOBAL MODULES:

"babel-cli": "^6.24.1",

"babel-plugin-resolver": "^1.1.0",

"babel-preset-es2015": "^6.24.1",

"babelify": "^7.3.0",

"browserify": "^14.3.0",

"uglifyify": "^3.0.4"

## Directory Structure

>	src (source files)
>	------
>		/ .babelrc
>		/ charsets.js (charsets. Add more here)
>		/ john.js (Dictionary File)
>		/ levenshtein.js (levenshtein algorithm)
>		/ script.es6 (Main Script File)

>	lib (output files)
>	node_modules
> 	index.html (index file)
>	bundle.js (final javascript file)
>	john.txt (Dictionary List)

