# SMS Counter
SMS counter is JQuery lib that help to count sms characters of SMS messages

### Requirements
You only need [jquery](http://jquery.com/) 1.x and higher lib to run it.

### Usage
Test example code:

```html
<!DOCTYPE html>
	<html>
	<meta charset="utf-8">
	<head>
		<title>SMS Counter</title>
	</head>
	<body>
	<textarea id="mymagicsms"></textarea>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
	<script type="text/javascript" src="SMSCounter.js"></script>
	<script type="text/javascript">
	$(function(){
		$('#mymagicsms').on("change keyup paste", function(){
			var data = SMSCounter.count($(this).val(), true);
			var length = data["length"];
			var remaining = data["remaining"];
			var part_count = data["part_count"];
			var text = data["text"];
			var per_message = data["per_message"];
			var encoding = data['encoding'];
			var sms_type = "";
			if (encoding == "GSM_7BIT") {
				sms_type = "Normal";
			}else if (encoding == "GSM_7BIT_EX") {
				sms_type = "Extended"; // for 7 bit GSM: ^ { } \ [ ] ~ | €
			} else if (encoding == "GSM_7BIT_EX_TR") {
				sms_type = "Turkish"; // Only for Turkish Characters "Ş ş Ğ ğ ç ı İ" encoding see https://en.wikipedia.org/wiki/GSM_03.38#Turkish_language_.28Latin_script.29
			} else if (encoding == "UTF16") {
				sms_type = "Unicode"; // for other languages "Arabic, Chinese, Russian" see http://en.wikipedia.org/wiki/GSM_03.38#UCS-2_Encoding
			}
			console.log(length);
			console.log(remaining);
			console.log(part_count);
			console.log(per_message);
			console.log(encoding);
			console.log(sms_type);
		});
	})
	</script>
	</body>
</html>
```

### License
It is free to use like freedom no warrenty.
