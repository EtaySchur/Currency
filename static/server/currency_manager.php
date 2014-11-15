<?php
/**
 * Created by IntelliJ IDEA.
 * User: etayschur
 * Date: 11/8/14
 * Time: 12:39 PM
 */

if (($_POST) || (isset($_POST))) {
    var_dump("SERVER !!"); exit;
    $request = json_decode(file_get_contents("php://input"));
    switch ($request->action) {
        case "currency_check" :
            $result = convert($request->data->from ,$request->data->to );
            echo json_encode($result);
            exit;
    }

}



function convert($from , $to){



    $amount = 1;
    $resultArray = array();
    $url = 'http://rate-exchange.appspot.com/currency?from='.$from.'&to='.$to;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    // Set so curl_exec returns the result instead of outputting it.
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // Get the response and close the channel.
    $response = curl_exec($ch);
    curl_close($ch);
    $resultArray['google'] = json_decode(preg_replace('/("\w+"):(\d+(\.\d+)?)/', '\\1:"\\2"', $response), true);

    $url = 'http://finance.yahoo.com/d/quotes.csv?f=l1d1t1&s='.$from.$to.'=X';
    $handle = fopen($url, 'r');
    if ($handle) {
        $result = fgetcsv($handle);
        fclose($handle);
        $resultArray['yahoo'] = $result;
    }




    return $resultArray;
}


