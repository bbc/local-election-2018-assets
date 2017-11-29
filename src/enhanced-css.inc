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
    // Check that window.DataPres.enhanced actually exists.
    var datapresEnhancedDefined = (typeof window.DataPres !== 'undefined' && typeof window.DataPres.enhanced !== 'undefined');
    // If window.DataPres.enhanced is not found default to enhanced styles. Otherwise go off it's value.
    var shouldBeEnhanced = !datapresEnhancedDefined || window.DataPres.enhanced;
    loadCssFile(shouldBeEnhanced ? '<%= publicPath %>enhanced.css' : '<%= publicPath %>core.css');
}());
</script>
