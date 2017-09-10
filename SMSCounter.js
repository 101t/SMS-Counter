(function(){
	window.SMSCounter = SMSCounter = (function(){
		function SMSCounter() {}
        SMSCounter.NOTRLOCK = true;
        SMSCounter.gsm7bitChars = "@£$¥èéùìòÇ\\nØø\\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\\\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
        SMSCounter.gsm7bitExChar = "\\^{}\\\\\\[~\\]|€";
        SMSCounter.gsm7bitExTRChars = "ŞşĞğçıİ";
        SMSCounter.gsm7bitExTRArr = SMSCounter.gsm7bitExTRChars.split("");
        SMSCounter.gsm7bitExTRENChars = "SsGgciI";
        SMSCounter.gsm7bitExTRENArr = SMSCounter.gsm7bitExTRENChars.split("");
        SMSCounter.gsm7bitRegExp = RegExp("^[" + SMSCounter.gsm7bitChars + "]*$");
        SMSCounter.gsm7bitExRegExp = RegExp("^[" + SMSCounter.gsm7bitChars + SMSCounter.gsm7bitExChar + "]*$");
        SMSCounter.gsm7bitExTRExp = RegExp("^[" + SMSCounter.gsm7bitChars + SMSCounter.gsm7bitExChar + SMSCounter.gsm7bitExTRChars + "]*$");
        SMSCounter.gsm7bitExOnlyRegExp = RegExp("^[\\" + SMSCounter.gsm7bitExChar + "]*$");
        SMSCounter.GSM_7BIT = 'GSM_7BIT';
        SMSCounter.GSM_7BIT_EX = 'GSM_7BIT_EX';
        SMSCounter.GSM_7BIT_EX_TR = 'GSM_7BIT_EX_TR';
        SMSCounter.UTF16 = 'UTF16';
        SMSCounter.messageLength = {
            GSM_7BIT: 160,
            GSM_7BIT_EX: 160,
            GSM_7BIT_EX_TR: 155,
            UTF16: 70
        };
        SMSCounter.multiMessageLength = {
            GSM_7BIT: 153,
            GSM_7BIT_EX: 153,
            GSM_7BIT_EX_TR: 149,
            UTF16: 67
        };
        SMSCounter.TR_enabled = false;
        SMSCounter.TR_ascii = function(text) {
            var res = text;
            for (var j = 0; j < text.length; j++) {
                for (var i = 0; i < this.gsm7bitExTRArr.length; i++) {
                    res = res.replace(this.gsm7bitExTRArr[i], this.gsm7bitExTRENArr[i]);
                }
            }
            return res;
        };
        SMSCounter.countGsm7bitExTR = function(text) {
            var cnt = 0;
            for (var j = 0; j < text.length; j++) {
                if (this.gsm7bitExTRArr.indexOf(text[j]) > -1) {
                    cnt++;
                }
            }
            return cnt;
        };
        SMSCounter.count = function(text, TR_enabled) {
            var count, encoding, length, part_count, per_message, remaining;
            if (typeof TR_enabled == "undefined") {
                this.TR_enabled = false
            } else {
                this.TR_enabled = TR_enabled;
            }
            if (!this.TR_enabled) {
                text = this.TR_ascii(text);
            }
            encoding = this.detectEncoding(text);
            length = text.length;
            if (encoding === this.GSM_7BIT_EX || encoding === this.GSM_7BIT_EX_TR) {
                length += this.countGsm7bitEx(text);
            }
            if (this.TR_enabled && self.SMSCounter.NOTRLOCK) {
                length += SMSCounter.countGsm7bitExTR(text);
            }
            per_message = this.messageLength[encoding];
            if (length > per_message) {
                per_message = this.multiMessageLength[encoding];
            }
            part_count = Math.ceil(length / per_message);
            remaining = length > 0 ? (per_message * part_count) - length : '&nbsp;';
            return {
                encoding: encoding,
                length: length,
                per_message: per_message,
                remaining: remaining,
                part_count: part_count,
                text: text
            };
        };
        SMSCounter.detectEncoding = function(text) {
            switch (false) {
                case text.match(this.gsm7bitRegExp) == null:
                    return this.GSM_7BIT;
                case text.match(this.gsm7bitExRegExp) == null:
                    return this.GSM_7BIT_EX;
                case (text.match(this.gsm7bitExTRExp) == null) || (this.TR_enabled === false):
                    return this.GSM_7BIT_EX_TR;
                default:
                    return this.UTF16;
            }
        };
        SMSCounter.countGsm7bitEx = function(text) {
            var char2, chars;
            var that = this;
            chars = (function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = text.length; _i < _len; _i++) {
                    char2 = text[_i];
                    if (char2.match(that.gsm7bitExOnlyRegExp) != null) {
                        _results.push(char2);
                    }
                }
                return _results;
            }).call(this);
            return chars.length;
        };
        return SMSCounter;
	})();
    if (typeof jQuery !== "undefined" && jQuery !== null) {
        $ = jQuery;
        $.fn.countSms = function(target) {
            var count_sms, input;
            input = this;
            target = $(target);
            count_sms = function() {
                var count, k, v, _results;
                count = SMSCounter.count(input.val());
                _results = [];
                for (k in count) {
                    v = count[k];
                    _results.push(target.find("." + k).text(v));
                }
                return _results;
            };
            this.on('keyup', count_sms);
            return count_sms();
        };
    }
}).call(this);
