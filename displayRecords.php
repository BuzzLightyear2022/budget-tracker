<?php

date_default_timezone_set('Asia/Tokyo');

class fetch_data
{
    public static $pdo;
    public static $start_date;
    public static $end_date;
    public static function connect_database()
    {
        if (!fetch_data::$pdo) {
            try {
                $dsn = "mysql:dbname=budget_management;host=localhost;charset=utf8mb4";
                $user = "root";
                fetch_data::$pdo = new PDO($dsn, $user, $user);
            } catch (PDOException $e) {
                echo "データベースの接続に失敗ちまちた💩";
            }
        }
    }
    public static function set_date()
    {
        fetch_data::$start_date = date("Y-m-01");
        fetch_data::$end_date = date("Y-m-t");
        if (!empty($_GET["MONTH"])) {
            fetch_data::$start_date = date($_GET["MONTH"] . "-01");
            fetch_data::$end_date = date('Y-m-t', strtotime($_GET["MONTH"] . "-01"));
        } elseif (!empty($_GET["start_date"]) && !empty($_GET["end_date"])) {
            fetch_data::$start_date = $_GET["start_date"];
            fetch_data::$end_date = $_GET["end_date"];
        }
    }
    public static function get_shopping_data()
    {
        try {
            fetch_data::connect_database();
            fetch_data::set_date();
            $stmt = "SELECT * FROM shopping_data_test WHERE registered_on BETWEEN " . "'" . fetch_data::$start_date . "'" . ' AND ' . "'" . fetch_data::$end_date . "'";
            $query = fetch_data::$pdo->query($stmt);
            return $query->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo "買い物記録データの取得に失敗しました。";
        }
    }
    public static function bin_dates_by_column()
    {
        try {
            fetch_data::connect_database();
            fetch_data::set_date();
            $stmt = "SELECT registered_on FROM shopping_data_test WHERE registered_on BETWEEN " . "'" . fetch_data::$start_date . "'" . ' AND ' . "'" . fetch_data::$end_date . "'" . " GROUP BY registered_on";
            $query = fetch_data::$pdo->query($stmt);
            return $query->fetchAll(PDO::FETCH_COLUMN);
        } catch (PDOException $e) {
            echo "日付データの取得に失敗しました。";
        }
    }
    public static function bin_categories_by_column()
    {
        try {
            fetch_data::connect_database();
            fetch_data::set_date();
            $stmt = 'SELECT category FROM shopping_data_test WHERE registered_on BETWEEN ' . "'" . fetch_data::$start_date . "'" . ' AND ' . "'" . fetch_data::$end_date . "'" . 'GROUP BY category';
            $query = fetch_data::$pdo->query($stmt);
            return $query->fetchAll(PDO::FETCH_COLUMN);
        } catch (PDOException $e) {
            echo "カテゴリーデータの取得に失敗しました。";
        }
    }
    public static function get_search_data()
    {
        $column = null;
        $order_column = null;
        $order = null;
        $set_column = function () use (&$column) {
            switch ($_GET["column"]) {
                case "カテゴリ":
                    $column = "`category`";
                    break;
                case "品名":
                    $column = "`prodName`";
                    break;
                case "店":
                    $column = "`shop`";
                    break;
            }
        };
        $set_order_column = function () use (&$order_column) {
            switch ($_GET["order_column"]) {
                case "日付":
                    $order_column = "`registered_on`";
                    break;
                case "単価":
                    $order_column = "`unitPrice`";
                    break;
                case "店":
                    $order_column = "`shop`";
                    break;
            }
        };
        $set_order = function () use (&$order) {
            switch ($_GET["order"]) {
                case "ASC":
                    $order = "ASC";
                    break;
                case "DESC":
                    $order = "DESC";
                    break;
            }
        };
        try {
            fetch_data::connect_database();
            if (!empty($_GET["keyword"]) && !empty($_GET["start_date"]) && !empty($_GET["end_date"])) {
                $set_column();
                $set_order_column();
                $set_order();
                $query = "SELECT * FROM `shopping_data_test` WHERE" . $column . " LIKE :keyword AND `registered_on` BETWEEN :start_date AND :end_date ORDER BY " . $order_column . " " . $order;
                $prepared_stmt = fetch_data::$pdo->prepare($query);
                $prepared_stmt->bindValue(':keyword', '%' . $_GET["keyword"] . "%", PDO::PARAM_STR);
                $prepared_stmt->bindValue(':start_date', $_GET["start_date"], PDO::PARAM_STR);
                $prepared_stmt->bindValue(':end_date', $_GET["end_date"], PDO::PARAM_STR);
                $prepared_stmt->execute();
                $res = $prepared_stmt->fetchAll(PDO::FETCH_ASSOC);
                return $res;
            } elseif ($_GET["column"] === "すべて" && !empty($_GET["start_date"]) && !empty($_GET["end_date"])) {
                $set_order_column();
                $set_order();
                $query = "SELECT * FROM `shopping_data_test` WHERE `registered_on` BETWEEN :start_date AND :end_date ORDER BY " . $order_column . " " . $order;
                $prepared_stmt = fetch_data::$pdo->prepare($query);
                $prepared_stmt->bindValue(':start_date', $_GET["start_date"], PDO::PARAM_STR);
                $prepared_stmt->bindValue(':end_date', $_GET["end_date"], PDO::PARAM_STR);
                $prepared_stmt->execute();
                $res = $prepared_stmt->fetchAll(PDO::FETCH_ASSOC);
                return $res;
            }
        } catch (PDOException $e) {
            echo "<br>";
            echo "データ検索メソッドの実行に失敗しました。";
            echo "<br>";
            echo $e;
        }
    }
}
class calculation
{
    public static function calc_discounted($data_arr)
    {
        $shopping_data = $data_arr;
        $discountedArr = [];
        foreach ($shopping_data as $row) {
            $row_data = [];
            $discountUnit = $row["discountUnit"];
            $row_data["id"] = $row["id"];
            if ($discountUnit === "%") {
                $discounted = round($row["unitPrice"] - ($row["unitPrice"] * ($row["discount"] * 0.01)));
                $row_data["discounted"] = $discounted;
            } elseif ($discountUnit === "円") {
                $discounted = $row["unitPrice"] - $row["discount"];
                $row_data["discounted"] = $discounted;
            } else {
                $discounted = $row["unitPrice"];
                $row_data["discounted"] = $discounted;
            }
            $discountedArr[] = $row_data;
        }
        return $discountedArr;
    }
    public static function calc_subtotal($shopping_data_arr, $discounted_arr)
    {
        $subtotal_arr = [];
        $tax = 1.1;
        $reduced_tax = 1.08;
        foreach ($shopping_data_arr as $index => $row) {
            $row_data = [];
            $row_data["id"] = $row["id"];
            if ($row["taxIncluded"] == true) {
                $row_data["subtotal"] = round($discounted_arr[$index]["discounted"] * $row["countProd"]);
            } elseif ($row["reducedTax"] == true) {
                $row_data["subtotal"] = round($discounted_arr[$index]["discounted"] * $reduced_tax * $row["countProd"]);
            } else {
                $row_data["subtotal"] = round($discounted_arr[$index]["discounted"] * $tax * $row["countProd"]);
            }
            $subtotal_arr[] = $row_data;
        }
        return $subtotal_arr;
    }
    public static function calc_sum($subtotals)
    {
        $sum = 0;
        foreach ($subtotals as $subtotal_row) {
            $sum += $subtotal_row["subtotal"];
        }
        return $sum;
    }
    public static function calc_sum_per_day($dates_arr, $shopping_data_arr, $subtotal_arr)
    {
        $dailyTotal_arr = [];
        foreach ($dates_arr as $day) {
            $daily_total = 0;
            $day_arr = [];
            foreach ($shopping_data_arr as $index => $row) {
                if ($day === $row["registered_on"]) {
                    $daily_total += $subtotal_arr[$index]["subtotal"];
                }
            }
            $day_arr["registered_on"] = $day;
            $day_arr["daily_total"] = $daily_total;
            $dailyTotal_arr[] = $day_arr;
        }
        return $dailyTotal_arr;
    }
    public static function calc_categorySum($shopping_data_arr, $subtotals)
    {
        $categories = fetch_data::bin_categories_by_column();
        $sortedCategoryTotal_arr = [];
        foreach ($categories as $category) {
            $category_total = 0;
            foreach ($shopping_data_arr as $index => $row) {
                if ($category === $row["category"]) {
                    $category_total += $subtotals[$index]["subtotal"];
                }
            }
            $sortedCategoryTotal_arr[$category] = $category_total;
        }
        arsort($sortedCategoryTotal_arr);
        $categoryTotal_arr = [];
        foreach ($sortedCategoryTotal_arr as $key => $value) {
            $row_arr = [];
            $row_arr["y"] = $value;
            $row_arr["indexLabel"] = $key;
            $categoryTotal_arr[] = $row_arr;
        }
        return json_encode($categoryTotal_arr);
    }
    public static function calc_amountCost($subtotals)
    {
        $amount_cost = 0;
        // $subtotals = calculation::calc_subtotal();
        foreach ($subtotals as $row) {
            $amount_cost += $row["subtotal"];
        }
        return $amount_cost;
    }
}
class display_data
{
    public static $category_sum = "null";
    public static $sum = 0;
    public static $nihongo_weeks = ["(日曜日)", "(月曜日)", "(火曜日)", "(水曜日)", "(木曜日)", "(金曜日)", "(土曜日)"];
    public static function display_month()
    {
        fetch_data::set_date();
        $month = date('Y年m月買い物記録', strtotime(fetch_data::$start_date));
        echo "<h1>" . $month . "</h1>";
    }
    public static function switch_to_prevMonth()
    {
        $lastMonth = Date("Y-m", strtotime('-1 month'));
        $document = new DOMDocument();
        $outerMostDiv = $document->createElement("div");
        $backLink = $document->createElement("a");
        $backLink->append($document->createTextNode("前月"));
        $backLink->setAttribute('href', 'displayRecords.php?MONTH=' . $lastMonth);
        $thisMonthLink = $document->createElement("a");
        $thisMonthLink->append($document->createTextNode("今月"));
        $thisMonthLink->setAttribute('href', 'displayRecords.php');
        $outerMostDiv->append($backLink, $thisMonthLink);
        $document->append($outerMostDiv);
        echo $document->saveXML();
    }
    public static function convertBoolean($value)
    {
        if ($value) {
            return "✔︎";
        } else {
            return "";
        }
    }
    public static function create_th($document, $column_names)
    {
        $tr = $document->createElement("tr");
        foreach ($column_names as $column_name) {
            $th = $document->createElement("th");
            $th->append($document->createTextNode($column_name));
            $tr->append($th);
        }
        return $tr;
    }
    public static function create_sum_tr($document, $sum, $pnum, $anum)
    {
        $tr = $document->createElement("tr");
        for ($i = 0; $i < $pnum; $i++) {
            $td = $document->createElement("td");
            if ($i === $pnum - 1) {
                $td->append($document->createTextNode("合計"));
            }
            $tr->append($td);
        }
        $sum_td = $document->createElement("td");
        $sum_td->append($document->createTextNode($sum));
        $tr->append($sum_td);
        for ($i = 0; $i < $anum; $i++) {
            $td = $document->createElement("td");
            $tr->append($td);
        }
        return $tr;
    }
    public static function create_data_tr($document, $table, $columns, $data_arr)
    {
        $discounted = calculation::calc_discounted($data_arr);
        $subtotals = calculation::calc_subtotal($data_arr, $discounted);
        display_data::$sum = calculation::calc_sum($subtotals);
        display_data::$category_sum = calculation::calc_categorySum($data_arr, $subtotals);
        foreach ($data_arr as $data_index => $data_row) {
            $tr = $document->createElement("tr");
            foreach ($columns as $column) {
                $td = $document->createElement("td");
                switch ($column) {
                    case "ID":
                        $td->append($document->createTextNode($data_row["id"]));
                        $tr->append($td);
                        break;
                    case "日付":
                        $td->append(
                            $document->createTextNode(
                                $data_row["registered_on"] . display_data::$nihongo_weeks[date(
                                    'w',
                                    strtotime($data_row["registered_on"])
                                )]
                            )
                        );
                        $tr->append($td);
                        break;
                    case "カテゴリ":
                        $td->append($document->createTextNode($data_row["category"]));
                        $tr->append($td);
                        break;
                    case "品名":
                        $td->append($document->createTextNode($data_row["prodName"]));
                        $tr->append($td);
                        break;
                    case "単価":
                        $td->append($document->createTextNode($data_row["unitPrice"]));
                        $tr->append($td);
                        break;
                    case "割引":
                        $td->append($document->createTextNode($data_row["discount"] . $data_row["discountUnit"]));
                        $tr->append($td);
                        break;
                    case "割引後":
                        $td->append($document->createTextNode($discounted[$data_index]["discounted"]));
                        $tr->append($td);
                        break;
                    case "個数":
                        $td->append($document->createTextNode($data_row["countProd"]));
                        $tr->append($td);
                        break;
                    case "内税":
                        $td->append($document->createTextNode(display_data::convertBoolean($data_row["taxIncluded"])));
                        $tr->append($td);
                        break;
                    case "軽減税率":
                        $td->append($document->createTextNode(display_data::convertBoolean($data_row["reducedTax"])));
                        $tr->append($td);
                        break;
                    case "税込":
                        $td->append($document->createTextNode($subtotals[$data_index]["subtotal"]));
                        $tr->append($td);
                        break;
                    case "店":
                        $td->append($document->createTextNode($data_row["shop"]));
                        $tr->append($td);
                        break;
                    case "固定費から引く":
                        $td->append($document->createTextNode(display_data::convertBoolean($data_row["subtFixed"]) . $data_row["subtFixedSummary"]));
                        $tr->append($td);
                        break;
                    case "備考":
                        $td->append($document->createTextNode((string) $data_row["note"]));
                        $tr->append($td);
                        break;
                }
            }
            $table->append($tr);
        }
    }
    public static function display_table($columns, $data_arr)
    {
        $document = new DOMDocument();
        $table = $document->createElement("table");
        $th = display_data::create_th($document, $columns);
        $table->append($th);
        display_data::create_data_tr($document, $table, $columns, $data_arr);
        $sum_tr = display_data::create_sum_tr($document, display_data::$sum, 10, 3);
        $table->append($sum_tr);
        $document->append($table);
        echo $document->saveXML();
    }
    public static function display_data()
    {
        $document = new DOMDocument();
        $create_th = function ($text) use (&$document) {
            $th = $document->createElement("th");
            if ($text === "品名" || $text === "店" || $text === "備考") {
                $th->setAttribute('width', '120px');
            } elseif ($text === "ID" || $text === "単価" || $text === "割引" || $text === "割引後" || $text === "個数" || $text === "内税" || $text === "軽減税率" || $text === "税込") {
                $th->setAttribute('width', '50px');
            } elseif ($text === "カテゴリ" || $text === "固定費から引く") {
                $th->setAttribute('width', '80px');
            }
            $th->append($document->createTextNode($text));
            return $th;
        };
        $create_td = function ($text) use (&$document) {
            $td = $document->createElement("td");
            if (!$text) {
                return $td;
            } else {
                $td->append($document->createTextNode($text));
            }
            return $td;
        };
        $create_sumTr = function ($val) use (&$document) {
            $sum_tr = $document->createElement("tr");
            for ($i = 0; $i < 8; $i++) {
                $td = $document->createElement("td");
                $sum_tr->append($td);
            }
            $labelTd = $document->createElement("td");
            $labelTd->append($document->createTextNode("合計"));
            $sumTd = $document->createElement("td");
            $sumTd->append($document->createTextNode($val));
            $sum_tr->append($labelTd, $sumTd);
            for ($i = 0; $i < 3; $i++) {
                $td = $document->createElement("td");
                $sum_tr->append($td);
            }
            return $sum_tr;
        };
        $table_headers = ["ID", "カテゴリ", "品名", "単価", "割引", "割引後", "個数", "内税", "軽減税率", "税込", "店", "固定費から引く", "備考"];
        $dates = fetch_data::bin_dates_by_column();
        $shopping_data = fetch_data::get_shopping_data();
        $discounted = calculation::calc_discounted($shopping_data);
        $subtotal = calculation::calc_subtotal($shopping_data, $discounted);
        $sum = calculation::calc_sum_per_day($dates, $shopping_data, $subtotal);
        $totalOfMonth = calculation::calc_sum($subtotal);
        display_data::$category_sum = calculation::calc_categorySum($shopping_data, $subtotal);
        foreach ($dates as $day_index => $day) {
            $hTwo = $document->createElement("h2");
            $hTwo->append($document->createTextNode($day . display_data::$nihongo_weeks[date('w', strtotime($day))]));
            $document->append($hTwo);
            $table = $document->createElement("table");
            $table->setAttribute('class', 'table');
            $tr = $document->createElement("tr");
            foreach ($table_headers as $item) {
                $th = $create_th($item);
                $tr->append($th);
            }
            $table->append($tr);
            foreach ($shopping_data as $index => $row) {
                if ($day === $row["registered_on"]) {
                    $row_tr = $document->createElement("tr");
                    $id_td = $create_td($row["id"]);
                    $category_td = $create_td($row["category"]);
                    $prodName_td = $create_td($row["prodName"]);
                    $unitPrice_td = $create_td($row["unitPrice"]);
                    $discount_td = $create_td($row["discount"] . $row["discountUnit"]);
                    $discounted_td = $create_td($discounted[$index]["discounted"]);
                    $countProd_td = $create_td($row["countProd"]);
                    $taxIncluded_td = $create_td(display_data::convertBoolean($row["taxIncluded"]));
                    $reducedTax_td = $create_td(display_data::convertBoolean($row["reducedTax"]));
                    $subtotal_td = $create_td($subtotal[$index]["subtotal"]);
                    $shop_td = $create_td($row["shop"]);
                    $subtFixed_td = $create_td(display_data::convertBoolean($row["subtFixed"]) . $row["subtFixedSummary"]);
                    $note_td = $create_td($row["note"]);
                    $row_tr->append($id_td, $category_td, $prodName_td, $unitPrice_td, $discount_td, $discounted_td, $countProd_td, $taxIncluded_td, $reducedTax_td, $subtotal_td, $shop_td, $subtFixed_td, $note_td);
                    $table->append($row_tr);
                }
            }
            $table->append($create_sumTr($sum[$day_index]["daily_total"]));
            $document->append($table);
        }
        echo "<h3>今月の使用額合計: " . $totalOfMonth . "</h3>";
        echo $document->saveXML();
    }
}
class search_data
{
    public static function display_searchWindow()
    {
        $columns = ["すべて", "カテゴリ", "品名", "店"];
        $order_columns = ["日付", "単価", "店"];
        $order = ["ASC", "DESC"];
        $document = new DOMDocument();
        $create_date_input = function ($label_text, $name) use (&$document, &$create_quote_span) {
            $date_input_span = $document->createElement("span");
            $label = $document->createElement("label");
            $label->append($document->createTextnode($label_text));
            $date_input = $document->createElement("input");
            $date_input->setAttribute("type", "date");
            $date_input->setAttribute("name", "$name");
            $date_input_span->append($label, $date_input);
            return $date_input_span;
        };
        $create_textbox = function () use (&$document, $create_quote_span) {
            $input = $document->createElement("input");
            $input->setAttribute("type", "text");
            $input->setAttribute("name", "keyword");
            return $input;
        };
        $create_select = function ($columns, $name, $label_text = null) use (&$document) {
            $span = $document->createElement("span");
            $select = $document->createElement("select");
            $select->setAttribute("name", $name);
            foreach ($columns as $column) {
                $option = $document->createElement("option");
                $option->append($document->createTextNode($column));
                $select->append($option);
            }
            if ($label_text) {
                $label = $document->createElement("label");
                $label->append($document->createTextNode($label_text));
                $span->append($select, $label);
            } else {
                $span->append($select);
            }
            return $span;
        };
        $textbox = $create_textbox();
        $column_select = $create_select($columns, "column", "で絞り込み");
        $start_date_input = $create_date_input("開始日: ", "start_date");
        $end_date_input = $create_date_input("終了日: ", "end_date");
        $order_column = $create_select($order_columns, "order_column", "で並べ替え");
        $order_select = $create_select($order, "order");
        $document->append($column_select, $textbox, $start_date_input, $end_date_input, $order_column, $order_select);
        echo $document->saveXML();
    }
}
?>

<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>月間記録</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
</head>

<body>
    <a href="index.php">メイン画面</a>
    <a href="input.php">買い物記録入力</a>
    <form action="displayRecords.php" method="get">
        <?= search_data::display_searchWindow(); ?>
        <button>検索</button>
        <button type="button" onclick="location.href='displayRecords.php'">クリア</button>
    </form>
    <h2>
        <?= display_data::switch_to_prevMonth(); ?>
    </h2>
    <div id="pieChart" style="position: relative; left: 50px; border: 2px solid #73AD21; height: 360px; width: 90%;">
    </div>
    <?php

    if (empty($_GET["start_date"]) && empty($_GET["end_date"])) {
        display_data::display_month();
        display_data::display_data();
    } else {
        $category_sum = json_encode([["y" => 1, "indexLabel" => "テスト"]]);
        $columns = ["ID", "日付", "カテゴリ", "品名", "単価", "割引", "割引後", "個数", "内税", "軽減税率", "税込", "店", "固定費から引く", "備考"];
        $search_data = fetch_data::get_search_data();
        display_data::display_table($columns, $search_data);
    }
    ?>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/canvasjs/1.7.0/canvasjs.min.js"></script>
    <script type="text/javascript">
        const categoryTotal = <?= display_data::$category_sum; ?>;
        const pieChartDiv = document.querySelector("#pieChart");
        const piechart = new CanvasJS.Chart(pieChartDiv, {
            title: {
                text: "サンプルチャート" //グラフタイトル
            },
            theme: "theme4", //テーマ設定
            data: [{
                type: 'pie', //グラフの種類
                dataPoints: categoryTotal //表示するデータ
            }]
        });
        piechart.render();
    </script>
    <script src="script/displayRecords.js"></script>
</body>

</html>