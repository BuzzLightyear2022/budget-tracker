<?php
date_default_timezone_set('Asia/Tokyo');
require_once "./php/createTable.php";
$js_post = json_decode(file_get_contents("php://input"));

if (!empty($_GET["MONTH"])) {
    $thisMonth = $_GET["MONTH"] . "-01";
} else {
    $thisMonth = Date('Y-m-01');
}

try {
    $pdo = connectFoundation::$pdo;

    $getFixedCost = $pdo->query("SELECT summary, budgetValue FROM budget_data WHERE added_month = '$thisMonth' ORDER BY budgetValue DESC");

    $fixedCost = json_encode($getFixedCost->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    var_dump($e);
}

if (!empty($js_post)) {
    switch ($js_post->method) {
        case "add":
            $stmt = $pdo->prepare("INSERT INTO `options_category` (className, options) VALUES (:className, :options)");
            $stmt->bindValue(':className', $js_post->className, PDO::PARAM_STR);
            $stmt->bindValue(':options', $js_post->body, PDO::PARAM_STR);
            $stmt->execute();
            break;
        case "delete":
            $stmt = $pdo->prepare("DELETE FROM `options_category` WHERE id = :id");
            $stmt->bindValue(':id', $js_post->body, PDO::PARAM_INT);
            $stmt->execute();
            break;
        case "post_shoppingData":
            $shoppingData = $js_post->body;
            insertShoppingData($shoppingData);
            break;
    }
}

function bulkInsert($className, $data_arr)
{
    global $pdo;
    $sql = "INSERT INTO `options_category` (className, options) VALUES ";
    // make place holders parts.
    foreach ($data_arr->$className as $index => $value) {
        $eachcolumns[] = '(:className' . $index . ', ' . ':' . $className . $index . ")";
    }
    // bind tables and place holders.
    $sql .= implode(', ', $eachcolumns);
    // sql bind Values.
    $stmt = $pdo->prepare($sql);
    foreach ($data_arr->$className as $index => $value) {
        $stmt->bindValue(':className' . $index, $className, PDO::PARAM_STR);
        $stmt->bindValue(':' . $className . $index, $value, PDO::PARAM_STR);
    }
    $stmt->execute();
}
function fetchOptions()
{
    try {
        global $pdo;
        $query = "SELECT * FROM `options_category`";
        $tryFetchDataSql = $pdo->query($query);
        $optionData = $tryFetchDataSql->fetchAll(PDO::FETCH_ASSOC);

        $jsonFile = json_decode(file_get_contents("json/options.json"));
    } catch (PDOException $e) {
        print("Error: " . $e->getMessage());
        die();
    }

    if (!empty($optionData)) {
        return json_encode($optionData);
    } else {
        bulkInsert("category", $jsonFile);
        bulkInsert("shop", $jsonFile);
        return fetchOptions();
    }
}
function insertShoppingData($shopping_data)
{
    try {
        global $pdo;
    } catch (PDOException $error) {
        echo "接続失敗" . $error;
    }

    var_dump($shopping_data);

    $sql = "INSERT INTO shopping_data_test (
        registered_on,
        category,
        prodName,
        unitPrice,
        discount,
        discountUnit,
        countProd,
        taxIncluded,
        reducedTax,
        shop,
        subtFixed,
        subtFixedSummary,
        note
    ) VALUES";

    // make place holders parts.
    $placeHolders = [];
    foreach ($shopping_data as $index => $row) {
        $eachcolumns = [];
        foreach ($row as $key => $value) {
            $eachcolumns[] = ':' . $key . $index;
        }
        $placeHolders[] = '(' . implode(', ', $eachcolumns) . ')';
        var_dump($placeHolders);
    }
    // bind tables and place holders.
    $sql .= implode(', ', $placeHolders);

    // sql bind Values.
    $stmt = $pdo->prepare($sql);
    foreach ($shopping_data as $index => $row) {
        foreach ($row as $key => $value) {
            switch ($key) {
                case "registered_on":
                    $stmt->bindValue(':' . $key . $index, $value, PDO::PARAM_STR);
                    break;
                case "category":
                    $stmt->bindValue(':' . $key . $index, $value, PDO::PARAM_STR);
                    break;
                case "prodName":
                    $stmt->bindValue(':' . $key . $index, $value, PDO::PARAM_STR);
                    break;
                case "unitPrice":
                    $stmt->bindValue(':' . $key . $index, $value, PDO::PARAM_INT);
                    break;
                case "discount":
                    $stmt->bindValue(':' . $key . $index, $value, PDO::PARAM_INT);
                    break;
                case "discountUnit":
                    $stmt->bindValue(':' . $key . $index, $value, PDO::PARAM_STR);
                    break;
                case "countProd":
                    $stmt->bindValue(':' . $key . $index, $value, PDO::PARAM_INT);
                    break;
                case "taxIncluded":
                    $stmt->bindValue(':' . $key . $index, $value, PDO::PARAM_INT);
                    break;
                case "reducedTax":
                    $stmt->bindValue(':' . $key . $index, $value, PDO::PARAM_INT);
                    break;
                case "shop":
                    $stmt->bindValue(':' . $key . $index, $value, PDO::PARAM_STR);
                    break;
                case "subtFixed":
                    $stmt->bindValue(':' . $key . $index, $value, PDO::PARAM_INT);
                    break;
                case "subtFixedSummary":
                    $stmt->bindValue(':' . $key . $index, $value, PDO::PARAM_STR);
                    break;
                case "note":
                    $stmt->bindValue(':' . $key . $index, $value, PDO::PARAM_STR);
                    break;
                default;
            }
        }
    }
    $stmt->execute();
}
?>

<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width = device-width, initial-scale = 1.0">
    <title>買い物記録</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
</head>

<body>
    <a href=index.php>メイン画面</a>
    <a href=displayRecords.php>買い物記録一覧</a>
    <h1>👜買い物記録💵</h1>

    <div id="test"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
    <script>
        const getOptionsArr = () => {
            const arr = {};
            options.forEach((element) => {
                const className = element["className"];
                arr[className] = { id: [], options: [] };
            });
            options.forEach((element, index) => {
                const className = element["className"];
                Object.keys(arr).forEach((arrElm) => {
                    if (arrElm === className) {
                        arr[className].id.push(element["id"]);
                        arr[className].options.push(element["options"]);
                    }
                });
            });
            return arr;
        }

        const options = JSON.parse(JSON.stringify(<?= fetchOptions() ?>));
        const fixedCost = <?= $fixedCost ?>;
        const selectOptions = getOptionsArr();
    </script>
    <script src="./script/neoSelectBox.js"></script>
    <script src="script/appearance.js"></script>
</body>

</html>