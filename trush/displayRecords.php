<?php
date_default_timezone_set('Asia/Tokyo');
try {
    $dsn = "mysql:dbname=budget_management;host=localhost;charset=utf8mb4";
    $user = "root";
    $pdo = new PDO($dsn, $user, $user);

    $startDate = date("Y-m-1");
    $endDate = date("Y-m-t");

    $sql = "SELECT * FROM shopping_data_test WHERE registered_on BETWEEN '$startDate 00:00:00' AND '$endDate 23:59:59'";

    $response = $pdo->query($sql);

    $fetch_data = $response->fetchAll(PDO::FETCH_ASSOC);

    $daySql = "SELECT registered_on FROM shopping_data_test WHERE registered_on BETWEEN '$startDate 00:00:00' AND '$endDate 23:59:59' GROUP BY registered_on";
    $dayResponse = $pdo->query($daySql);
    $day_data = $dayResponse->fetchAll(PDO::FETCH_COLUMN);
} catch (PDOException $e) {
}

function display_data()
{
    $table_headers = ["ID", "カテゴリ", "品名", "単価", "割引", "割引後", "個数", "内税", "軽減税率", "税込", "店"];
    $document = new DOMDocument();
    global $fetch_data;
    global $day_data;

    foreach ($day_data as $index => $day) {
        
        $hTwo = $document->createElement("h2");
        $hTwo->append($document->createTextNode($day));

        $document->append($hTwo);

        $table = $document->createElement("table");

        $header_tr = $document->createElement("tr");
        foreach ($table_headers as $header) {
            $th = $document->createElement("th");
            $th->append($document->createTextNode($header));
            $header_tr->append($th);
        }
        $table->append($header_tr);

        foreach ($fetch_data as $row) {
            $data_tr = $document->createElement("tr");
            foreach ($row as $key => $data) {

                if ($day_data[$index] === $row["registered_on"]) {
                    if ($key !== "registered_on") {
                        $td = $document->createElement("td");
                        $td->append($document->createTextNode($data));
                        $data_tr->append($td);
                    }
                    $table->append($data_tr);
                }
            }
            
        }
        $document->append($table);
    }
    echo $document->saveXML();
}

function calc_data()
{
    $taxIncluded = [];
    $discounted = [];
    $tax = 1.1;
    $reducedTax = 1.08;
    global $fetch_data;
    foreach ($fetch_data as $data) {
        if ($data["taxIncluded"] == true) {
            array_push($taxIncluded, $data["unitPrice"]);
        }
    }
    print_r($taxIncluded);
}

?>

<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>月間記録</title>
</head>

<body>
    <h1>🎉<?= date('n') ?>月買い物記録🎊</h1>
    <?php
    display_data();

    ?>
</body>

</html>