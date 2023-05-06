

let countRows = 0;
const rows = [];

function changeView() {
    const allInput = document.querySelectorAll("select, button, input");
    for (i = 0; i < allInput.length; i++) {
        allInput[i].addEventListener('change', () => {
            calcAll();
        });
    }
}

const sumCheck = () => {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "sumCheck";
    input.checked = true;
    const td = document.createElement("td");
    td.append(input);
    return td;
}
const categoryTd = () => {
    const td = document.createElement("td");
    const select = document.createElement("select");
    select.className = "category";
    // categoryOptions.forEach((element, index) => {
    //     const option = document.createElement("option");
    //     option.textContent = categoryOptions[index];
    //     select.append(option);
    // });
    td.append(select);
    return td;
}
const prodNameTd = () => {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "prodName";
    const td = document.createElement("td");
    td.append(input);
    return td;
}
const unitPriceTd = () => {
    const input = document.createElement("input");
    input.type = "number";
    input.className = "unitPrice";
    input.min = 0;
    const td = document.createElement("td");
    td.append(input);
    return td;
}
const discountTd = () => {
    const discountUnit = ["%", "円"];
    const input = document.createElement("input");
    input.type = "number";
    input.className = "discount";
    input.min = 0;
    input.step = 1;
    const label = document.createElement("label");
    label.HTMLFor = "discount";
    label.style.display = "inline";
    const select = document.createElement("select");
    select.className = "discountUnit";
    discountUnit.forEach((element, index) => {
        const optionElem = document.createElement("option");
        optionElem.textContent = discountUnit[index];
        select.append(optionElem);
    });
    label.append(select);
    const td = document.createElement("td");
    td.append(input, label);
    return td;
}
const discountedSpanTd = () => {
    const span = document.createElement("span");
    span.className = "discountedSpan";
    const td = document.createElement("td");
    td.append(span);
    return td;
}
const countProdTd = () => {
    const input = document.createElement("input");
    input.type = "number";
    input.className = "countProd";
    input.min = 0;
    input.step = 1;
    input.value = 1;
    const td = document.createElement("td");
    td.append(input);
    return td;
}
const taxIncludedTd = () => {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "taxIncluded";
    const td = document.createElement("td");
    td.append(input);
    return td;
}
const reducedTaxTd = () => {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "reducedTax";
    const td = document.createElement("td");
    td.append(input);
    return td;
};
const subtotalSpanTd = () => {
    const span = document.createElement("span");
    span.className = "subtotalSpan";
    const td = document.createElement("td");
    td.append(span);
    return td;
}
const shopTd = () => {
    const td = document.createElement("td");
    const select = document.createElement("select");
    select.className = "shop";
    // shopOptions.forEach((element, index) => {
    //     const option = document.createElement("option");
    //     option.textContent = shopOptions[index];
    //     select.append(option);
    // });
    td.append(select);
    return td;
}
const noteTd = () => {
    const td = document.createElement("td");
    const input = document.createElement("input");
    input.type = "text";
    input.className = "note";
    td.append(input);
    return td;
}
const errorDispTd = (e) => {
    const span = document.createElement("span");
    span.textContent = e;
    const td = document.createElement("td");
    td.append(span);
    return td;
}
const addRow = () => {
    const tr = document.createElement("tr");
    tr.append(sumCheck());
    tr.append(categoryTd());
    tr.append(prodNameTd());
    tr.append(unitPriceTd());
    tr.append(discountTd());
    tr.append(discountedSpanTd());
    tr.append(countProdTd());
    tr.append(taxIncludedTd());
    tr.append(reducedTaxTd());
    tr.append(subtotalSpanTd());
    tr.append(shopTd());
    tr.append(noteTd());
    const sumTr = document.querySelector("#sumTr");
    sumTr.before(tr);
    rows.push(++countRows);
    discountedArr.push(null);
    subtotalArr.push(null);
    changeView();
}

function removeRow() {
    const inputTable = document.querySelector("#inputTable");
    const rowLength = inputTable.rows.length;
    if (rowLength > 3) {
        inputTable.deleteRow((rowLength - 1) - 1);
        --countRows;
        rows.pop();
        discountedArr.pop();
        subtotalArr.pop();
        fetchArr.pop();
        calcAll();
    }
}