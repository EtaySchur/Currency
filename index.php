<?php
/**
 * Created by IntelliJ IDEA.
 * User: etayschur
 * Date: 11/8/14
 * Time: 11:52 AM
 */

$from = 'GBP';
$to = 'USD';
$url = 'http://finance.yahoo.com/d/quotes.csv?f=l1d1t1&s='.$from.$to.'=X';
$handle = fopen($url, 'r');

if ($handle) {
    $result = fgetcsv($handle);
    fclose($handle);
}

echo '1 '.$from.' is worth '.$result[0].' '.$to.' Based on data on '.$result[1].' '.$result[2];


?>
<script type="text/javascript">

    function getRate(from, to) {
        var script = document.createElement('script');
        script.setAttribute('src', "https://query.yahooapis.com/v1/public/yql?q=select%20rate%2Cname%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes%3Fs%3D"+from+to+"%253DX%26f%3Dl1n'%20and%20columns%3D'rate%2Cname'&format=json&callback=parseExchangeRate");
        document.body.appendChild(script);
    }

    function parseExchangeRate(data) {
        var name = data.query.results.row.name;
        var rate = parseFloat(data.query.results.row.rate, 10);
        alert("Exchange rate " + name + " is " + rate);
    }

    getRate("GBP", "USD");
    getRate("USD", "SEK");

</script>