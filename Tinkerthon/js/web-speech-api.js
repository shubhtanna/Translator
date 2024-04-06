
const countries = {
  "am-ET": "Amharic",
  "ar-SA": "Arabic",
  "be-BY": "Bielarus",
  "bem-ZM": "Bemba",
  "bi-VU": "Bislama",
  "bjs-BB": "Bajan",
  "bn-IN": "Bengali",
  "bo-CN": "Tibetan",
  "br-FR": "Breton",
  "bs-BA": "Bosnian",
  "ca-ES": "Catalan",
  "cop-EG": "Coptic",
  "cs-CZ": "Czech",
  "cy-GB": "Welsh",
  "da-DK": "Danish",
  "dz-BT": "Dzongkha",
  "de-DE": "German",
  "dv-MV": "Maldivian",
  "el-GR": "Greek",
  "en-GB": "English",
  "es-ES": "Spanish",
  "et-EE": "Estonian",
  "eu-ES": "Basque",
  "fa-IR": "Persian",
  "fi-FI": "Finnish",
  "fn-FNG": "Fanagalo",
  "fo-FO": "Faroese",
  "fr-FR": "French",
  "gl-ES": "Galician",
  "gu-IN": "Gujarati",
  "ha-NE": "Hausa",
  "he-IL": "Hebrew",
  "hi-IN": "Hindi",
  "hr-HR": "Croatian",
  "hu-HU": "Hungarian",
  "id-ID": "Indonesian",
  "is-IS": "Icelandic",
  "it-IT": "Italian",
  "ja-JP": "Japanese",
  "kk-KZ": "Kazakh",
  "km-KM": "Khmer",
  "kn-IN": "Kannada",
  "ko-KR": "Korean",
  "ku-TR": "Kurdish",
  "ky-KG": "Kyrgyz",
  "la-VA": "Latin",
  "lo-LA": "Lao",
  "lv-LV": "Latvian",
  "men-SL": "Mende",
  "mg-MG": "Malagasy",
  "mi-NZ": "Maori",
  "ms-MY": "Malay",
  "mt-MT": "Maltese",
  "my-MM": "Burmese",
  "ne-NP": "Nepali",
  "niu-NU": "Niuean",
  "nl-NL": "Dutch",
  "no-NO": "Norwegian",
  "ny-MW": "Nyanja",
  "ur-PK": "Pakistani",
  "pau-PW": "Palauan",
  "pa-IN": "Panjabi",
  "ps-PK": "Pashto",
  "pis-SB": "Pijin",
  "pl-PL": "Polish",
  "pt-PT": "Portuguese",
  "rn-BI": "Kirundi",
  "ro-RO": "Romanian",
  "ru-RU": "Russian",
  "sg-CF": "Sango",
  "si-LK": "Sinhala",
  "sk-SK": "Slovak",
  "sm-WS": "Samoan",
  "sn-ZW": "Shona",
  "so-SO": "Somali",
  "sq-AL": "Albanian",
  "sr-RS": "Serbian",
  "sv-SE": "Swedish",
  "sw-SZ": "Swahili",
  "ta-LK": "Tamil",
  "te-IN": "Telugu",
  "tet-TL": "Tetum",
  "tg-TJ": "Tajik",
  "th-TH": "Thai",
  "ti-TI": "Tigrinya",
  "tk-TM": "Turkmen",
  "tl-PH": "Tagalog",
  "tn-BW": "Tswana",
  "to-TO": "Tongan",
  "tr-TR": "Turkish",
  "uk-UA": "Ukrainian",
  "uz-UZ": "Uzbek",
  "vi-VN": "Vietnamese",
  "wo-SN": "Wolof",
  "xh-ZA": "Xhosa",
  "yi-YD": "Yiddish",
  "zu-ZA": "Zulu"
}





var messages = {
  start: {
    msg: "Click on the microphone icon and begin speaking.",
    class: "alert-success",
  },
  speak_now: {
    msg: "Speak now.",
    class: "alert-success",
  },
  no_speech: {
    msg: 'No speech was detected. You may need to adjust your <a href="//support.google.com/chrome/answer/2693767" target="_blank">microphone settings</a>.',
    class: "alert-danger",
  },
  no_microphone: {
    msg: 'No microphone was found. Ensure that a microphone is installed and that <a href="//support.google.com/chrome/answer/2693767" target="_blank">microphone settings</a> are configured correctly.',
    class: "alert-danger",
  },
  allow: {
    msg: 'Click the "Allow" button above to enable your microphone.',
    class: "alert-warning",
  },
  denied: {
    msg: "Permission to use microphone was denied.",
    class: "alert-danger",
  },
  blocked: {
    msg: "Permission to use microphone is blocked. To change, go to chrome://settings/content/microphone",
    class: "alert-danger",
  },
  upgrade: {
    msg: 'Web Speech API is not supported by this browser. It is only supported by <a href="//www.google.com/chrome">Chrome</a> version 25 or later on desktop and Android mobile.',
    class: "alert-danger",
  },
  stop: {
    msg: "Stop listening, click on the microphone icon to restart",
    class: "alert-success",
  },
  copy: {
    msg: "Content copy to clipboard successfully.",
    class: "alert-success",
  },
};

var final_transcript = "";
var recognizing = false;
var ignore_onend;
var start_timestamp;
var recognition;

$(document).ready(function () {
  for (var i = 0; i < langs.length; i++) {
    select_language.options[i] = new Option(langs[i][0], i);
  }
  select_language.selectedIndex = 10;
  updateCountry();
  select_dialect.selectedIndex = 6;

  if (!("webkitSpeechRecognition" in window)) {
    upgrade();
  } else {
    showInfo("start");
    start_button.style.display = "inline-block";
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
      recognizing = true;
      showInfo("speak_now");
      start_img.src = "images/mic-animation.gif";
    };

    recognition.onerror = function (event) {
      if (event.error == "no-speech") {
        start_img.src = "images/mic.gif";
        showInfo("no_speech");
        ignore_onend = true;
      }
      if (event.error == "audio-capture") {
        start_img.src = "images/mic.gif";
        showInfo("no_microphone");
        ignore_onend = true;
      }
      if (event.error == "not-allowed") {
        if (event.timeStamp - start_timestamp < 100) {
          showInfo("blocked");
        } else {
          showInfo("denied");
        }
        ignore_onend = true;
      }
    };

    recognition.onend = function () {
      recognizing = false;
      if (ignore_onend) {
        return;
      }
      start_img.src = "images/mic.gif";
      if (!final_transcript) {
        showInfo("start");
        return;
      }
      showInfo("stop");
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.selectNode(document.getElementById("final_span"));
        window.getSelection().addRange(range);
      }
    };

    recognition.onresult = function (event) {
      var interim_transcript = "";
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      final_transcript = capitalize(final_transcript);
      final_span.innerHTML = linebreak(final_transcript);
      interim_span.innerHTML = linebreak(interim_transcript);
    };
  }
});

function upgrade() {
  start_button.style.visibility = "hidden";
  showInfo("upgrade");
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, "<p></p>").replace(one_line, "<br>");
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function (m) {
    return m.toUpperCase();
  });
}

$("#copy_button").click(function () {
  if (recognizing) {
    recognizing = false;
    recognition.stop();
  }
  setTimeout(copyToClipboard, 500);
});

function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? "hidden" : "visible";
}

function copyToClipboard() {
  if (document.selection) {
    var range = document.body.createTextRange();
    range.moveToElementText(document.getElementById("results"));
    range.select().createTextRange();
    document.execCommand("copy");
  } else if (window.getSelection) {
    var range = document.createRange();
    range.selectNode(document.getElementById("results"));
    window.getSelection().addRange(range);
    document.execCommand("copy");
  }
  showInfo("copy");
}

$("#start_button").click(function () {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = "";
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = "";
  interim_span.innerHTML = "";
  start_img.src = "images/mic-slash.gif";
  showInfo("allow");
  start_timestamp = event.timeStamp;
});

$("#select_language").change(function () {
  updateCountry();
});

function showInfo(s) {
  if (s) {
    var message = messages[s];
    $("#info").html(message.msg);
    $("#info").removeClass();
    $("#info").addClass("alert");
    $("#info").addClass(message.class);
  } else {
    $("#info").removeClass();
    $("#info").addClass("d-none");
  }
}

var translate_select_language = document.getElementById(
  "translate_select_language"
);
var translate_select_dialect = document.getElementById(
  "translate_select_dialect"
);

for (const countryCode in countries) {
  const countryName = countries[countryCode];
  const option = document.createElement("option");
  option.value = countryCode;
  option.textContent = countryName;
  translate_select_language.appendChild(option);
}


var translated_text = document.getElementById("translate_final_span")


var translate_btn = document.getElementById("translate_btn");
// const info_text = document.getElementById('interim_span');

var info_text = document.querySelector(".interim");

var finalSpan = document.getElementById("final_span");

translate_btn.addEventListener("click", () => {
  // let text = info_text.value;
  // console.log(text)

  var finalText = finalSpan.innerText,
  translateFrom =  select_dialect.value,
  translateTo = translate_select_language.value;
  console.log(finalText)
  let apiUrl = `https://api.mymemory.translated.net/get?q=${finalText}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiUrl).then(res => res.json()).then(data => {
    console.log(data)
    translated_text.innerText = data.responseData.translatedText;
    console.log(translated_text);
  })
});

let speakBtn = document.getElementById('speakBtn');
speakBtn.addEventListener('click',()=>{
    const textToSpeak = translated_text.innerText;
    if(textToSpeak !== ''){
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      window.speechSynthesis.speak(utterance);
    }
});

