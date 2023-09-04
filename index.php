<?php
date_default_timezone_set('Asia/Tokyo');
require_once './php/createTable.php';

try {
    $pdo = connectFoundation::$pdo;

    $thisMonth = Date('Y-m-01');
    $startDate = Date('Y-m-01');
    $endDate = Date('Y-m-t');
    $month_Ym = Date('Y-m');

    if (!empty($_GET["MONTH"])) {
        $thisMonth = $_GET["MONTH"] . "-01";
        $month_Ym = $_GET["MONTH"];
        $startDate = Date('Y-m-01', strtotime($thisMonth));
        $endDate = Date('Y-m-t', strtotime($thisMonth));
    }

    $query = $pdo->query("SELECT * FROM budget_data WHERE added_month = '$thisMonth' ORDER BY budgetValue DESC");
    $budgetData = $query->fetchAll(PDO::FETCH_ASSOC);

    $amountQuery = $pdo->query("SELECT * FROM amount_budget WHERE added_month = '$thisMonth'");
    $amountBudget = $amountQuery->fetch(PDO::FETCH_ASSOC);

    $recordQuery = $pdo->query("SELECT * FROM shopping_data_test WHERE registered_on BETWEEN '$startDate' AND '$endDate'");
    $shoppingData = $recordQuery->fetchAll(PDO::FETCH_ASSOC);

    $daysQuery = $pdo->query("SELECT registered_on FROM shopping_data_test WHERE registered_on BETWEEN '$startDate' AND '$endDate' GROUP BY registered_on");
    $daysData = $daysQuery->fetchAll(PDO::FETCH_COLUMN);
} catch (PDOException $e) {
    var_dump("データベース接続が失敗ちまちた");
    echo "<br>";
    echo $e;
}
function calcSum()
{
    global $budgetData;
    $sum = 0;
    foreach ($budgetData as $index => $row) {
        foreach ($row as $key => $value) {
            if ($key === "budgetValue") {
                $sum += $value;
            }
        }
    }
    return $sum;
}

class calcBudget
{
    public static $eachDayBudget = [];
    public static $totalOfDays = [];

    public static function calcDiscounted()
    {
        global $shoppingData;
        global $daysData;
        $discounted = [];
        $subtotal = [];
        $totalOfDays = [];
        foreach ($shoppingData as $index => $row) {
            $unitPrice = $row["unitPrice"];
            $discount = $row["discount"];
            $discountUnit = $row["discountUnit"];
            if (!$discount) {
                $discounted[] = $unitPrice;
            } elseif ($discountUnit === "%") {
                $discounted[] = round($unitPrice - ($unitPrice * $discount * 0.01));
            } elseif ($discountUnit === "円") {
                $discounted[] = $unitPrice - $discount;
            }
        }
        foreach ($shoppingData as $index => $row) {
            $tax = 1.1;
            $reducedTax = 1.08;
            $registered_on = $row["registered_on"];
            $countProd = $row["countProd"];
            $taxIncluded = $row["taxIncluded"];
            $reducedTaxCk = $row["reducedTax"];
            if ($taxIncluded == true) {
                $subtotal[$index]["registered_on"] = $registered_on;
                $subtotal[$index]["subtotal"] = $discounted[$index] * $countProd;
            } elseif ($reducedTaxCk == true) {
                $subtotal[$index]["registered_on"] = $registered_on;
                $subtotal[$index]["subtotal"] = round($discounted[$index] * $reducedTax * $countProd);
            } else {
                $subtotal[$index]["registered_on"] = $registered_on;
                $subtotal[$index]["subtotal"] = round($discounted[$index] * $tax * $countProd);
            }
        }
        foreach ($daysData as $index => $day) {
            $i = 0;
            foreach ($subtotal as $sIndex => $row) {
                if ($row["registered_on"] == $day && !$shoppingData[$sIndex]["subtFixed"]) {
                    $i += $row["subtotal"];
                }
            }
            $totalOfDays[$day] = $i;
        }
        return $totalOfDays;
    }
    public static function calcSubtotal()
    {
        global $shoppingData;
        global $daysData;
        $discounted = [];
        $subtotal = [];
        $totalOfDays = [];
        foreach ($shoppingData as $index => $row) {
            $unitPrice = $row["unitPrice"];
            $discount = $row["discount"];
            $discountUnit = $row["discountUnit"];
            if (!$discount) {
                $discounted[] = $unitPrice;
            } elseif ($discountUnit === "%") {
                $discounted[] = round($unitPrice - ($unitPrice * $discount * 0.01));
            } elseif ($discountUnit === "円") {
                $discounted[] = $unitPrice - $discount;
            }
        }
        foreach ($shoppingData as $index => $row) {
            $tax = 1.1;
            $reducedTax = 1.08;
            $registered_on = $row["registered_on"];
            $countProd = $row["countProd"];
            $taxIncluded = $row["taxIncluded"];
            $reducedTaxCk = $row["reducedTax"];
            if ($taxIncluded == true) {
                $subtotal[$index]["registered_on"] = $registered_on;
                $subtotal[$index]["subtotal"] = $discounted[$index] * $countProd;
            } elseif ($reducedTaxCk == true) {
                $subtotal[$index]["registered_on"] = $registered_on;
                $subtotal[$index]["subtotal"] = round($discounted[$index] * $reducedTax * $countProd);
            } else {
                $subtotal[$index]["registered_on"] = $registered_on;
                $subtotal[$index]["subtotal"] = round($discounted[$index] * $tax * $countProd);
            }
        }
        foreach ($daysData as $index => $day) {
            $i = null;
            foreach ($subtotal as $sIndex => $row) {
                if ($row["registered_on"] == $day && !$shoppingData[$sIndex]["subtFixed"]) {
                    $i = $row["subtotal"];
                }
            }
            $totalOfDays[$day] = $i;
        }
        return $subtotal;
    }
    public static function calcBalance()
    {
        global $amountBudget;
        if (!empty($amountBudget)) {
            $balance = $amountBudget["amountBudget"] - calcSum();
            return $balance;
        }
    }
    public static function calcDayBudget()
    {
        global $thisMonth;
        $endOfMonth = Date('t', strtotime($thisMonth));
        $dayBudget = floor(calcBudget::calcBalance() / $endOfMonth);
        return $dayBudget;
    }
}

?>

<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>予算管理</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
</head>

<body>
    <a href="inputBudget.php">予算入力画面</a>
    <a href="input.php">買い物入力画面</a>
    <a href="displayRecords.php">買い物記録一覧</a>
    <?php
    if (!empty($amountBudget)) {
        echo "<h3>今月の予算: " . $amountBudget["amountBudget"] . "</h3>";
    } else {
        echo "<h3>今月の予算が設定されていまてん</h3>";
    }
    ?>
    <div id="pie" style="position: relative; left: 50px; border: 2px solid #73AD21; height: 360px; width: 90%;"></div>
    <?php
    $document = new DOMDocument();
    $table = $document->createElement("table");
    $table->setAttribute('class', 'table');
    
    $headerTr = $document->createElement("tr");
    $summaryTh = $document->createElement("th");
    $summaryTh->append($document->createTextNode("摘要"));
    $budgetValueTh = $document->createElement("th");
    $budgetValueTh->append($document->createTextNode("予算"));
    $remainedBudgetTh = $document->createElement("th");
    $remainedBudgetTh->append($document->createTextNode("予算残額"));
    $headerTr->append($summaryTh, $budgetValueTh, $remainedBudgetTh);
    $table->append($headerTr);
    foreach ($budgetData as $index => $row) {
        $tr = $document->createElement("tr");
        foreach ($row as $key => $value) {
            if(!$value) {
                $value = 0;
            }
            switch ($key) {
                case "summary":
                    $summaryTd = $document->createElement("td");
                    $summaryTd->append($document->createTextNode($value));
                    $tr->append($summaryTd);
                    break;
                case "budgetValue":
                    $budgetValueTd = $document->createElement("td");
                    $budgetValueTd->append($document->createTextNode($value));
                    $tr->append($budgetValueTd);
                    break;
            }
        }
        $remainedBudgetValue = $row["budgetValue"];
        $remainedBudgetTd = $document->createElement("td");
        foreach ($shoppingData as $sindex => $srow) {
            $isSubtFixed = $srow["subtFixed"];
            $budgetDataSummary = $row["summary"];
            $fixedCostSummary = $srow["subtFixedSummary"];
            if ($isSubtFixed && ($budgetDataSummary === $fixedCostSummary)) {
                $remainedBudgetValue -= calcBudget::calcSubtotal()[$sindex]["subtotal"];
            }
        }
        $remainedBudgetTd->append($document->createTextNode($remainedBudgetValue));
        $tr->append($remainedBudgetTd);
        $table->append($tr);
    }
    $sumTr = $document->createElement("tr");
    $goukeiTd = $document->createElement("td");
    $goukeiTd->append($document->createTextNode("合計"));
    $goukeiTd->setAttribute('style', 'border-top: solid');
    $sumTd = $document->createElement("td");
    $sumTd->setAttribute('style', 'border-top: solid');
    $sumTd->append($document->createTextNode(calcSum()));
    $balanceSumTd = $document->createElement("td");
    $balanceSumTd->setAttribute('style', 'border-top: solid');
    $sumTr->append($goukeiTd, $sumTd, $balanceSumTd);
    $table->append($sumTr);
    $document->append($table);
    echo $document->saveXML();
    echo "<h3>差引残高: " . calcBudget::calcBalance() . "</h3>";
    echo "<hr>";
    ?>
    <?php
    echo "一日あたりの予算: " . calcBudget::calcDayBudget();
    ?>

    <?php
    $dayJapanese = ["日", "月", "火", "水", "木", "金", "土"];
    $balanceDom = new DOMDocument();
    $balanceTable = $balanceDom->createElement("table");
    $balanceTable->setAttribute('class', 'table table-hover');
    $thead = $balanceDom->createElement("thead");
    $headerTr = $balanceDom->createElement("tr");
    $blankTh = $balanceDom->createElement("th");
    $monthTh = $balanceDom->createElement("th");
    $monthTh->append($balanceDom->createTextNode("月"));
    $weekTh = $balanceDom->createElement("th");
    $weekTh->append($balanceDom->createTextNode("週"));
    $dayTh = $balanceDom->createElement("th");
    $dayTh->append($balanceDom->createTextNode("日"));
    $headerTr->append($blankTh, $monthTh, $weekTh, $dayTh);
    $thead->append($headerTr);
    $balanceTable->append($thead);
    $daysOfMonth = Date('t', strtotime($thisMonth));
    $yearMonth = Date('Y年m月', strtotime($thisMonth));
    $dayBudget = 0;
    $weekBudget = 0;
    $monthBudget = calcBudget::calcDayBudget() * $daysOfMonth;
    
    $graphDay = [];

    for ($i = 1; $i <= $daysOfMonth; $i++) {
        $thisDate = Date('Y-m', strtotime($thisMonth)) . "-" . str_pad($i, 2, 0, STR_PAD_LEFT);
        $thisDay = Date('w', strtotime($month_Ym . "-" . str_pad($i, 2, 0, STR_PAD_LEFT)));
        $tr = $balanceDom->createElement("tr");
        if (Date('Y-m-d') == $thisDate) {
            $tr->setAttribute("class", "table-primary");
        }
        $dateTd = $balanceDom->createElement("td");
        $dateTd->append($balanceDom->createTextNode($yearMonth . $i . "日" . "(" . $dayJapanese[$thisDay] . "曜日" . ")"));
        foreach (calcBudget::calcDiscounted() as $day => $value) {
            if ($thisDate == $day) {
                $dayBudget -= $value;
                $weekBudget -= $value;
                $monthBudget -= $value;
            }
        }
        $monthTd = $balanceDom->createElement("td");
        $monthTd->append($balanceDom->createTextNode($monthBudget));
        $weekTd = $balanceDom->createElement("td");
        if ($i === 1 && $thisDay !== 0) {
            $weekBudget += calcBudget::calcDayBudget() * (7 - $thisDay);
        } elseif ($thisDay == 0 && $daysOfMonth - $i <= 7) {
            $weekBudget += calcBudget::calcDayBudget() * ($daysOfMonth - $i + 1);
        } elseif ($thisDay == 0) {
            $weekBudget += calcBudget::calcDayBudget() * 7;
        }
        $weekTd->append($balanceDom->createTextNode($weekBudget));
        $dayTd = $balanceDom->createElement("td");
        $dayBudget += calcBudget::calcDayBudget();
        $dayTd->append($balanceDom->createTextNode($dayBudget));
        $dayDataForGraph = [];
        $dayForGraph = $yearMonth . $i . '日' . '(' . $dayJapanese[$thisDay] . '曜日' . ')';
        $dayDataForGraph["x"] = $i;
        $dayDataForGraph["y"] = $dayBudget;
        $graphDay[] = $dayDataForGraph;
        $tr->append($dateTd, $monthTd, $weekTd, $dayTd);
        $balanceTable->append($tr);
    }
    $balanceDom->append($balanceTable);
    echo $balanceDom->saveXML();
    $graphDayJson = json_encode($graphDay);
    $budgetDataJson = json_encode($budgetData);
    ?>
    
    <div id="stage"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
    <script>
        const arrayForGraphDay = <?= $graphDayJson ?>;
        const budgetData = <?= $budgetDataJson ?>;
    </script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/canvasjs/1.7.0/canvasjs.min.js"></script>
    <script src="script/script.js" type="text/javascript"></script>
</body>

</html>