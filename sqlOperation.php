<?php

date_default_timezone_set('Asia/Tokyo');
$rawFile = file_get_contents("php://input");
// make available in PHP.
$jsonObj = json_decode($rawFile, true);
// storage shopping data to SQL
var_dump($jsonObj);

function insertShoppingData()
{
    try {
        $dsn = "mysql:dbname=budget_management;host=localhost;charset=utf8mb4";
        $user = "root";
        $pdo = new PDO($dsn, $user, $user);
    } catch (PDOException $error) {
        echo "接続失敗" . $error;
    }

    global $jsonObj;
    $shoppingData = $jsonObj;
    array_shift($shoppingData);

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
    foreach ($shoppingData as $index => $row) {
        $eachcolumns = [];
        foreach ($row as $key => $value) {
            $eachcolumns[] = ':' . $key . $index;
        }
        $placeHolders[] = '(' . implode(', ', $eachcolumns) . ')';
    }
    // bind tables and place holders.
    $sql .= implode(', ', $placeHolders);

    // sql bind Values.
    $stmt = $pdo->prepare($sql);
    foreach ($shoppingData as $index => $row) {
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

function budgetItems()
{
    global $jsonObj;
    array_shift($jsonObj);

    try {
        $dsn = "mysql:dbname=budget_management;host=localhost;charset=utf8mb4";
        $user = "root";
        $pdo = new PDO($dsn, $user, $user);
    } catch (PDOException $e) {
        var_dump($e);
    }

    $getdata_sql = "SELECT * FROM budget_items";
    $res = $pdo->query($getdata_sql);
    $fetch_data = $res->fetchAll(PDO::FETCH_ASSOC);

    $insert_arr = json_encode($jsonObj);

    if (is_array($fetch_data) && empty($fetch_data)) {
        $stmt = $pdo->prepare('INSERT INTO budget_items(item) VALUES(:items)');
        $stmt->bindValue(":items", $insert_arr, PDO::PARAM_STR);
        $stmt->execute();
    } else {
        $stmt = $pdo->prepare("UPDATE budget_items SET item = :items WHERE id = 1");
        $stmt->bindValue(":items", $insert_arr, PDO::PARAM_STR);
        $stmt->execute();
    }
}

function update_budgetName()
{
    try {
        $dsn = "mysql:dbname=budget_management;host=localhost;charset=utf8mb4";
        $user = "root";
        $pdo = new PDO($dsn, $user, $user);
    } catch (PDOException $e) {
        var_dump($e);
    }

    global $jsonObj;
    array_shift($jsonObj);
    $stmt = $pdo->prepare('UPDATE budget_data SET budgetName = :item WHERE id = :id');
    $stmt->bindValue(":item", $jsonObj[1], PDO::PARAM_STR);
    $stmt->bindValue(":id", $jsonObj[0], PDO::PARAM_INT);
    $stmt->execute();
}
function update_budgetValue()
{
    try {
        $dsn = "mysql:dbname=budget_management;host=localhost;charset=utf8mb4";
        $user = "root";
        $pdo = new PDO($dsn, $user, $user);
    } catch (PDOException $e) {
        var_dump($e);
    }

    global $jsonObj;
    array_shift($jsonObj);
    $stmt = $pdo->prepare('UPDATE budget_data SET budgetValue = :val WHERE ID = :id');
    $stmt->bindValue(':val', $jsonObj[1], PDO::PARAM_INT);
    $stmt->bindValue(':id', $jsonObj[0], PDO::PARAM_INT);
    $stmt->execute();
}
function insert_budgetName()
{
    try {
        $dsn = "mysql:dbname=budget_management;host=localhost;charset=utf8mb4";
        $user = "root";
        $pdo = new PDO($dsn, $user, $user);
    } catch (PDOException $e) {
        var_dump($e);
    }

    global $jsonObj;
    array_shift($jsonObj);
    $month = date("Y-m-01");
    $stmt = $pdo->prepare('INSERT INTO budget_data (added_month, budgetName) VALUES (:added_month, :budgetName)');
    $stmt->bindValue(':added_month', $month, PDO::PARAM_STR);
    $stmt->bindValue(':budgetName', $jsonObj[0], PDO::PARAM_STR);
    $stmt->execute();
}
function insert_budgetValue()
{
    try {
        $dsn = "mysql:dbname=budget_management;host=localhost;charset=utf8mb4";
        $user = "root";
        $pdo = new PDO($dsn, $user, $user);
    } catch (PDOException $e) {
        var_dump($e);
    }

    global $jsonObj;
    array_shift($jsonObj);
    $month = date("Y-m-01");
    $stmt = $pdo->prepare('INSERT INTO budget_data (added_month, budgetValue) VALUES (:added_month, :budgetValue)');
    $stmt->bindValue(':added_month', $month, PDO::PARAM_STR);
    $stmt->bindValue(':budgetValue', $jsonObj[0], PDO::PARAM_STR);
    $stmt->execute();
}
function delete_budgetRow()
{
    try {
        $dsn = "mysql:dbname=budget_management;host=localhost;charset=utf8mb4";
        $user = "root";
        $pdo = new PDO($dsn, $user, $user);
    } catch (PDOException $e) {
        var_dump($e);
    }

    global $jsonObj;
    array_shift($jsonObj);
    $stmt = $pdo->prepare("DELETE FROM budget_data WHERE id = :id");
    $stmt->bindValue(':id', $jsonObj[0], PDO::PARAM_INT);
    $stmt->execute();
}
function insert_amount()
{
    try {
        $dsn = "mysql:dbname=budget_management;host=localhost;charset=utf8mb4";
        $user = "root";
        $pdo = new PDO($dsn, $user, $user);
    } catch (PDOException $e) {
        var_dump($e);
    }

    global $jsonObj;
    $thisMonth = Date('Y-m-01');
    array_shift($jsonObj);
    $stmt = $pdo->prepare("INSERT INTO amount_budget (added_month, amountBudget) VALUES (:added_month, :amountBudget)");
    $stmt->bindValue(':added_month', $thisMonth, PDO::PARAM_STR);
    $stmt->bindValue(':amountBudget', $jsonObj[0], PDO::PARAM_INT);
    $stmt->execute();
}
function update_amount()
{
    try {
        $dsn = "mysql:dbname=budget_management;host=localhost;charset=utf8mb4";
        $user = "root";
        $pdo = new PDO($dsn, $user, $user);
    } catch(PDOException $e) {
        var_dump($e);
    }
    global $jsonObj;
    array_shift($jsonObj);
    $stmt = $pdo->prepare("UPDATE amount_budget SET amountBudget = :budget WHERE id = :id");
    $stmt->bindValue(":budget", $jsonObj[1], PDO::PARAM_INT);
    $stmt->bindValue(":id", $jsonObj[0], PDO::PARAM_INT);
    $stmt->execute();
}

if ($jsonObj[0]["method"] === "POST_shopping") {
    echo "run";
    insertShoppingData();
} elseif ($jsonObj[0]["method"] === "POST_budgetItems") {
    budgetItems();
} elseif ($jsonObj[0]["method"] === "UPDATE_name") {
    update_budgetName();
} elseif ($jsonObj[0]["method"] === "UPDATE_value") {
    update_budgetValue();
} elseif ($jsonObj[0]["method"] === "INSERT_name") {
    insert_budgetName();
} elseif ($jsonObj[0]["method"] === "INSERT_value") {
    insert_budgetValue();
} elseif ($jsonObj[0]["method"] === "DELETE_row") {
    delete_budgetRow();
} elseif ($jsonObj[0]["method"] === "INSERT_amount") {
    insert_amount();
} elseif ($jsonObj[0]["method"] === "UPDATE_amount") {
    update_amount();
}
