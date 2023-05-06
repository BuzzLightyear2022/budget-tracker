<?php
function display_test()
{
    global $day_data;
    global $fetch_data;

    $document = new DOMDocument();

    $create_th = function ($text) use (&$document) {
        $th = $document->createElement("th");
        $th->append($document->createTextNode($text));
        return $th;
    };
    $create_td = function ($text) use (&$document) {
        $td = $document->createElement("td");
        $td->append($document->createTextNode($text));
        return $td;
    };

    $table_headers = ["ID", "カテゴリ", "品名", "単価", "割引", "割引後", "個数", "内税", "軽減税率", "税込", "店"];
    $column_names = ["id", "category", "prodName", "unitPrice", "discount", "discountUnit", "discounted", "countProd", "taxIncluded", "reducedTax", "subtotal", "shop"];
    foreach ($day_data as $day) {
        $hTwo = $document->createElement("h2");
        $hTwo->append($document->createTextNode($day));
        $document->append($hTwo);

        $table = $document->createElement("table");

        $tr = $document->createElement("tr");
        foreach ($table_headers as $item) {
            $th = $create_th($item);
            $tr->append($th);
        }
        $table->append($tr);

        foreach ($fetch_data as $row) {
            if ($day === $row["registered_on"]) {
                $row_tr = $document->createElement("tr");

                $id_td = $create_td($row["id"]);
                $category_td = $create_td($row["category"]);
                $prodName_td = $create_td($row["prodName"]);
                $unitPrice_td = $create_td($row["unitPrice"]);

                $discount_td = $create_td($row["discount"] . $row["discountUnit"]);

                $discounted_td = $create_td("discounted");
                $countProd_td = $create_td($row["countProd"]);
                $taxIncluded_td = $create_td($row["taxIncluded"]);
                $reducedTax_td = $create_td($row["reducedTax"]);
                $subtotal_td = $create_td("subtotal");
                $shop_td = $create_td($row["shop"]);

                $row_tr->append($id_td, $category_td, $prodName_td, $unitPrice_td, $discount_td, $discounted_td, $countProd_td, $taxIncluded_td, $reducedTax_td, $subtotal_td, $shop_td);

                foreach ($column_names as $column) {
                    if ($column === "discount") {
                        $column_td = $column . "_td";
                        $$column_td = $create_td($row["discount"] . $row["discountUnit"]);
                    } elseif ($column === "discountUnit") {
                        // pass discountUnit column because it was merged in the previous process.
                    } elseif($column === "discounted") {
                        $column_td = $column . "_td";
                        $$column_td = $create_td($column);
                    } elseif($column === "subtotal") {
                        $column_td = $column . "_td";
                        $$column_td = $create_td($column);
                    } else {
                        $column_td = $column . "_td";
                        $$column_td = $create_td($row[$column]);
                    }
                    $row_tr->append($$column_td);
                }
                $table->append($row_tr);
            }
        }
        $document->append($table);
    }
    echo $document->saveXML();
}
?>