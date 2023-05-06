// this Array will　be post php.
let fetchArr = [];

// when 確定button is clicked display confirm.
const fetchBtn = document.querySelector("#fetchBtn");
fetchBtn.addEventListener("click", () => {
    const confirmMes = confirm("送信するかー？");
    if(confirmMes) {
        fetchData();
        console.log(fetchArr);
    }
}, false);

const _fetchData = async () => {
    const fetchMethod = {method: "POST_shopping"};
    fetchArr.splice(1, 0, fetchMethod);
    const registered_onElm = document.querySelector("#date");
    const categoryElm = document.querySelectorAll(".category");
    const prodNameElm = document.querySelectorAll(".prodName");
    const unitPriceElm = document.querySelectorAll(".unitPrice");
    const discountElm = document.querySelectorAll(".discount");
    const discountUnitElm = document.querySelectorAll(".discountUnit");
    const countProdElm = document.querySelectorAll(".countProd");
    const taxIncludedElm = document.querySelectorAll(".taxIncluded");
    const reducedTaxElm = document.querySelectorAll(".reducedTax");
    const shopElm = document.querySelectorAll(".shop");
    const noteElm = document.querySelectorAll(".note");

    rows.forEach((element, index) => {
        if (unitPriceElm[index].value) {
            const rowArr = {};
            rowArr.registered_on = registered_onElm.value;
            rowArr.category = categoryElm[index].options[categoryElm[index].selectedIndex].textContent;
            rowArr.prodName = prodNameElm[index].value;
            rowArr.unitPrice = unitPriceElm[index].value;
            if (discountElm[index].value) {
                rowArr.discount = discountElm[index].value;
                rowArr.discountUnit = discountUnitElm[index].options[discountUnitElm[index].selectedIndex].textContent;
            } else {
                rowArr.discount = null;
                rowArr.discountUnit = null;
            }
            rowArr.countProd = countProdElm[index].value;
            rowArr.taxIncluded = taxIncludedElm[index].checked;
            rowArr.reducedTax = reducedTaxElm[index].checked;
            rowArr.shop = shopElm[index].options[shopElm[index].selectedIndex].textContent;
            rowArr.note = noteElm[index].value;
            fetchArr.splice(rows[index], 1, rowArr);
        } else {
            fetchArr.splice(rows[index], 1, null);
        }
    });

    try {
        await fetch("sqlOperation.php", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(fetchArr.filter(v => v)),
        });
    } catch (error) {
        console.log("doesn't work: " + error);
    }

    alert("送信完了！");
    document.location = 'displayRecords.php';
}
