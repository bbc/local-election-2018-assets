<!-- This will come from another component in the future -->
<script type="text/javascript">
if (typeof window.DataPres === "undefined") {
    var modernBrowser = ('addEventListener' in window && 'querySelector' in document && 'localStorage' in window),
        isOperaMini = (window.navigator.userAgent.indexOf('Opera Mini/') > -1 && window.navigator.userAgent.indexOf('Presto/') > -1);
    window.DataPres = { enhanced: modernBrowser && !isOperaMini };
}
</script>
<!-- END -->

<link rel="preload" as="style" href="<%= publicPath %>enhanced.css" media="all">
<noscript><link rel="stylesheet" href="<%= publicPath %>core.css" media="all"></script></noscript>
<script type="text/javascript">
(function loadEnhancedOrCoreCss() {
    function loadCssFile(cssPath) {
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.media = 'all';
        link.href = cssPath;
        head.appendChild(link);
    }
    loadCssFile(window.DataPres.enhanced ? '<%= publicPath %>enhanced.css' : '<%= publicPath %>core.css');
}());
</script>
