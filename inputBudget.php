<?php
date_default_timezone_set('Asia/Tokyo');

$thisMonth = Date('Y-m-01');
if (!empty($_GET["MONTH"])) {
    $thisMonth = $_GET["MONTH"] . "-01";
}

$lastMonthMs = mktime(0, 0, 0, date('m', strtotime($thisMonth)) - 1, date('d', strtotime($thisMonth)), date('Y', strtotime($thisMonth)));
$lastMonthDaysMs = strtotime($thisMonth) - $lastMonthMs;
$lastMonth = Date('Y-m-d', strtotime($thisMonth) - $lastMonthDaysMs);

try {
    $dsn = "mysql:dbname=budget_management;host=localhost;charset=utf8mb4";
    $user = "root";
    $pdo = new PDO($dsn, $user, $user);
} catch (PDOException $e) {
    var_dump($e);
}

$fetchFile = json_decode(file_get_contents("php://input"));
if (!empty($fetchFile)) {
    foreach ($fetchFile as $method => $data) {
        switch ($method) {
            case "INSERT_amountBudget":
                if (!empty($data)) {
                    insertAmountBudget($data);
                }
                break;
            case "UPDATE_amountBudget":
                if (!empty($data)) {
                    updateAmountBudget($data);
                }
                break;
            case "INSERT_row":
                if (!empty($data)) {
                    insertRow($data);
                }
                break;
            case "UPDATE_row":
                if (!empty($data)) {
                    updateRow($data);
                }
                break;
            case "UPDATE_summary":
                if (!empty($data)) {
                    updateSummary($data);
                }
                break;
            case "UPDATE_budgetValue":
                if (!empty($data)) {
                    updateBudgetValue($data);
                }
                break;
            case "DELETE_row":
                if (!empty($data)) {
                    deleteRow($data);
                }
                break;
        }
    }
}

function insertAmountBudget($data)
{
    global $pdo;
    global $thisMonth;

    $insertSql = $pdo->prepare("INSERT INTO amount_budget (added_month, amountBudget) VALUES (:added_month, :amountBudget)");
    $insertSql->bindValue(":added_month", $thisMonth, PDO::PARAM_STR);
    $insertSql->bindValue(":amountBudget", $data[0]->amountBudget, PDO::PARAM_INT);
    $insertSql->execute();
}
function updateAmountBudget($data)
{
    global $pdo;
    $updateSql = $pdo->prepare("UPDATE amount_budget SET amountBudget = :amountBudget WHERE id = :id");
    $updateSql->bindValue(":amountBudget", $data[0]->amountBudget, PDO::PARAM_INT);
    $updateSql->bindValue(":id", $data[0]->id, PDO::PARAM_INT);
    $updateSql->execute();
}
function insertRow($data)
{
    global $pdo;
    global $thisMonth;

    $insertSql = "INSERT INTO budget_data (added_month, summary, budgetValue) VALUES ";
    $placeHolders = [];
    foreach ($data as $index => $row) {
        $eachPlaceHolders = [];
        $eachPlaceHolders[] = ':added_month' . $index;
        foreach ($row as $key => $value) {
            $eachPlaceHolders[] = ':' . $key . $index;
        }
        $placeHolders[] = '(' . implode(', ', $eachPlaceHolders) . ')';
    }
    $insertSql .= implode(', ', $placeHolders);
    $insertQuery = $pdo->prepare($insertSql);
    foreach ($data as $index => $row) {
        $insertQuery->bindValue(':added_month' . $index, $thisMonth, PDO::PARAM_STR);
        foreach ($row as $key => $value) {
            switch ($key) {
                case "summary":
                    $insertQuery->bindValue(':' . $key . $index, $value, PDO::PARAM_STR);
                    break;
                case "budgetValue":
                    $insertQuery->bindValue(':' . $key . $index, $value, PDO::PARAM_INT);
                    break;
            }
        }
    }
    $insertQuery->execute();
}
function updateRow($data)
{
    global $pdo;
    foreach ($data as $index => $row) {
        $stmt = $pdo->prepare("UPDATE budget_data SET summary = :summary, budgetValue = :budgetValue WHERE id = :id");
        foreach ($row as $key => $value) {
            switch ($key) {
                case "summary":
                    $stmt->bindValue(":summary", $value, PDO::PARAM_STR);
                    break;
                case "budgetValue":
                    $stmt->bindValue(":budgetValue", $value, PDO::PARAM_INT);
                    break;
                case "id":
                    $stmt->bindValue(":id", $value, PDO::PARAM_INT);
                    break;
            }
        }
        $stmt->execute();
    }
}
function updateSummary($data)
{
    global $pdo;
    foreach ($data as $index => $row) {
        $stmt = $pdo->prepare("UPDATE budget_data SET summary = :summary WHERE id = :id");
        foreach ($row as $key => $value) {
            switch ($key) {
                case "summary":
                    $stmt->bindValue(":summary", $value, PDO::PARAM_STR);
                    break;
                case "id":
                    $stmt->bindValue(":id", $value, PDO::PARAM_INT);
                    break;
            }
        }
        $stmt->execute();
    }
}
function updateBudgetValue($data)
{
    global $pdo;
    foreach ($data as $index => $row) {
        $stmt = $pdo->prepare("UPDATE budget_data SET budgetValue = :budgetValue WHERE id = :id");
        foreach ($row as $key => $value) {
            switch ($key) {
                case "budgetValue":
                    $stmt->bindValue(":budgetValue", $value, PDO::PARAM_INT);
                    break;
                case "id":
                    $stmt->bindValue(":id", $value, PDO::PARAM_INT);
                    break;
            }
        }
        $stmt->execute();
    }
}
function deleteRow($data)
{
    global $pdo;
    foreach ($data as $index => $row) {
        $stmt = $pdo->prepare("DELETE FROM budget_data WHERE id = :id");
        $stmt->bindValue(":id", $row->id, PDO::PARAM_INT);
        $stmt->execute();
    }
}
function getBudgetData()
{
    global $pdo;
    global $thisMonth;
    global $lastMonth;
    if (!empty($_GET("pullLastMonth"))) {
        $query = $pdo->query("SELECT * FROM budget_data WHERE added_month = '$lastMonth' ORDER BY budgetValue DESC");
        $response = $query->fetchAll(PDO::FETCH_ASSOC);
        return json_encode($response);
    } else {
        $query = $pdo->query("SELECT * FROM budget_data WHERE added_month = '$thisMonth' ORDER BY budgetValue DESC");
        $response = $query->fetchAll(PDO::FETCH_ASSOC);
        return json_encode($response);
    }
}
function getAmountBudget()
{
    global $pdo;
    global $thisMonth;
    global $lastMonth;
    if (!empty($_GET("pullLastMonth"))) {
        $query = $pdo->query("SELECT * FROM amount_budget WHERE added_month = '$lastMonth'");
        $response = $query->fetch(PDO::FETCH_ASSOC);
        return json_encode($response);
    } else {
        $query = $pdo->query("SELECT * FROM amount_budget WHERE added_month = '$thisMonth'");
        $response = $query->fetch(PDO::FETCH_ASSOC);
        return json_encode($response);
    }
}
function getLastMonthData()
{
    global $pdo;
    global $lastMonth;
    $getLastSql = $pdo->query("SELECT summary, budgetValue FROM budget_data WHERE added_month = '$lastMonth' ORDER BY budgetValue DESC");
    $lastMonthBudget = $getLastSql->fetchAll(PDO::FETCH_ASSOC);
    return json_encode($lastMonthBudget);
}
function getLastAmountBudget()
{
    global $pdo;
    global $lastMonth;
    $getSql = $pdo->query("SELECT * FROM amount_budget WHERE added_month = '$lastMonth'");
    $lastAmount = $getSql->fetch(PDO::FETCH_ASSOC);
    return json_encode($lastAmount);
}

if (!empty($_GET["pullLastMonth"])) {
}
?>

<!DOCTYPE html>

<html lang="ja">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>予算入力</title>
</head>

<body>
    <a href="index.php">メイン画面</a>
    <a href="displayRecords.php">買い物記録一覧</a>
    <h2 id="title">予算を入力してください</h2>

    <label>今月の収入: </label><input id="amountBudgetInput"></input>

    <table id="inputTable">
        <tr>
            <th>摘要</th>
            <th>予算</th>
        </tr>
        <tr id="sumTr">
            <td style="border-top: solid;">合計</td>
            <td id="sumTd" style="border-top: solid"></td>
        </tr>
    </table>
    <button id="addButton">+</button>
    <button id="removeButton">-</button>
    <br>
    <button id="submit" type="button">確定</button>
    <hr>
    <label>差引残高: </label><span id="balanceElm"></span>

    <script type="text/javascript">
        console.log(true);
        const lastMonthData = <?= getLastMonthData(); ?>;
        const amountBudget = <?= getAmountBudget(); ?>;
        const budgetData = <?= getBudgetData(); ?>;
    </script>
    <script src="script/inputBudget.js" type="text/javascript"></script>
</body>

</html>