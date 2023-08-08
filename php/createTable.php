<?php

date_default_timezone_set("Asia/Tokyo");

class connectFoundation
{
    public static $pdo;
    public static function connectDatabase($dsn, $user, $pw)
    {
        try {
            connectFoundation::$pdo = new PDO($dsn, $user, $pw);
        } catch (PDOException $e) {
            echo $e;
        }
    }
}
class createTables
{
    public static function shopping_data_test()
    {
        try {
            $query = "CREATE TABLE IF NOT EXISTS shopping_data_test (
                id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
                registered_on DATE NOT NULL,
                category VARCHAR(60),
                prodName VARCHAR(60),
                unitPrice INT(11),
                discount INT(11),
                discountUnit VARCHAR(1),
                countProd INT(11),
                taxIncluded BOOLEAN,
                reducedTax BOOLEAN,
                shop VARCHAR(60),
                subtFixed TINYINT,
                SubtFixedSummary VARCHAR(256),
                note VARCHAR(60)
            )";
            connectFoundation::$pdo->query($query);
        } catch (PDOException $e) {
            echo $e;
        }
    }
    public static function budget_items()
    {
        try {
            $query = "CREATE TABLE IF NOT EXISTS budget_items (
                id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
                item VARCHAR(2048)
            )";
            connectFoundation::$pdo->query($query);
        } catch (PDOException $e) {
            echo $e;
        }
    }
    public static function budgetData() {
        try {
            $query = "CREATE TABLE IF NOT EXISTS budget_data (
                    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    added_month DATE,
                    summary VARCHAR(256),
                    budgetValue INT(11)
                )";
            connectFoundation::$pdo->query($query);
        } catch (PDOException $e) {
            echo $e;
        }
    }
    public static function amount_budget()
    {
        $query = "CREATE TABLE IF NOT EXISTS amount_budget (
            id iNT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            added_month DATE,
            amountBudget INT(11)
        )";
        connectFoundation::$pdo->query($query);
    }
    public static function options_category()
    {
        $query = "CREATE TABLE IF NOT EXISTS options_category(
            id INT (11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            className VARCHAR(256),
            options VARCHAR(256)
        )";
        connectFoundation::$pdo->query($query);
    }
}

$dsn = "mysql:dbname=budget_management;host=localhost;charset=utf8mb4";
connectFoundation::connectDatabase($dsn, 'root', 'root');
createTables::shopping_data_test();
createTables::budget_items();
createTables::budgetData();
createTables::amount_budget();
createTables::options_category();