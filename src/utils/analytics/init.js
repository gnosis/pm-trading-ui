/* eslint-disable */
export default function init (){(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-83220550-2', 'auto', 'olympiatracker');
ga('send', 'pageview');
var t=setInterval(function(){var e=document.getElementById("uport-continue-btn"),n=document.getElementById("google-play-badge"),o=document.getElementById("app-store-badge");e&&n&&o&&(clearInterval(t),e.addEventListener("click",function(){ga("olympiatracker.send","event","Uport modal interactions","click","Continue with uport button")}),n.addEventListener("click",function(){ga("olympiatracker.send","event","Uport modal interactions","click","Google play button")}),o.addEventListener("click",function(){ga("olympiatracker.send","event","Uport modal interactions","click","App store button")}))},100)};