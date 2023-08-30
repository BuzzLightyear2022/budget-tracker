const createInputTable = class {
    static inputRows = [];
    static tableHeader;
    static dateInput;

    static convertFullWidthDigitsToHalfWidthDigits = (element) => {
        const fullWidthNumbers = '０１２３４５６７８９';
        element.addEventListener('input', () => {
            element.value = element.value.replace(/[０-９]/g, (match) => {
                const index = fullWidthNumbers.indexOf(match);
                return index !== -1 ? String(index) : match;
            });
        }, false);
    }
    static createDateInput = () => {
        const input = document.createElement("input");
        input.type = "date";
        return input;
    }
    createTh = () => {
        const createTh = (text) => {
            const th = document.createElement("th");
            if (text) {
                th.textContent = text;
            }
            if (text === "内税" || text === "軽減税率") {
                const input = document.createElement("input");
                input.type = "checkbox";
                th.append(input);
            }
            return th;
        }

        // const headers = ["", "カテゴリ", "品名", "単価", "割引", "割引後", "個数", "内税", "軽減税率", "税込", "店", "固定費から引く", "備考"];
        const tr = document.createElement("tr");
        const firstTh = createTh();
        const categoryTh = createTh("カテゴリ");
        const prodNameTh = createTh("品名");
        const unitPriceTh = createTh("単価");
        const discountTh = createTh("割引");
        const discountedTh = createTh("割引後");
        const countTh = createTh("個数");
        const taxIncludedTh = createTh("内税");
        const reducedTaxTh = createTh("軽減税率");
        const subtotalTh = createTh("税込");
        const shopTh = createTh("店");
        const subtFixedTh = createTh("固定費から引く");
        const noteTh = createTh("備考");
        tr.append(firstTh, categoryTh, prodNameTh, unitPriceTh, discountTh, discountedTh, countTh, taxIncludedTh, reducedTaxTh, subtotalTh, shopTh, subtFixedTh, noteTh);

        const taxIncludedCheck = taxIncludedTh.children[0];
        const reducedTaxCheck = reducedTaxTh.children[0];

        taxIncludedCheck.addEventListener('change', () => {
            const elements = createInputTable.inputRows;
            elements.forEach((element) => {
                const eachTaxIncludedCheck = element.children[7].children[0];
                eachTaxIncludedCheck.checked = taxIncludedCheck.checked;
            });
        }, false);

        reducedTaxCheck.addEventListener('change', () => {
            const elements = createInputTable.inputRows;
            elements.forEach((element) => {
                const eachReducedTaxCheck = element.children[8].children[0];
                eachReducedTaxCheck.checked = reducedTaxCheck.checked;
            });
        }, false);
        createInputTable.tableHeader = tr;
        return tr;
    }
    createInputRow = () => {
        const tr = document.createElement("tr");

        const sumCheckTd = () => {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.type = "checkbox";
            input.checked = true;
            td.append(input);
            return td;
        }
        const categoryTd = () => {
            const td = document.createElement("td");
            const select = new neoSelectbox("category", selectOptions["category"]["options"]);
            td.append(select);
            return td;
        }
        const prodNameTd = () => {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.type = "text";
            td.append(input);
            return td;
        }
        const unitPriceTd = () => {
            const td = document.createElement("td");
            const input = document.createElement("input");
            // input.type = "number";
            input.style.width = "100px";
            td.append(input);
            return td;
        }
        const discountTd = () => {
            const discountUnit = ["%", "円"];
            const td = document.createElement("td");
            const input = document.createElement("input");
            // input.type = "number";
            input.style.width = "50px";
            const select = document.createElement("select");
            discountUnit.forEach((element, index) => {
                const option = document.createElement("option");
                option.textContent = discountUnit[index];
                select.append(option);
            });
            td.append(input, select);
            return td;
        }
        const discountedTd = () => {
            const td = document.createElement("td");
            return td;
        }
        const countProdTd = () => {
            const td = document.createElement("td");
            const input = document.createElement("input");
            // input.type = "number";
            input.value = 1;
            input.style.width = "50px";
            td.append(input);
            return td;
        }
        const taxIncludedTd = () => {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.type = "checkbox";
            td.append(input);
            return td
        }
        const reducedTaxTd = () => {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.type = "checkbox";
            td.append(input);
            return td;
        }
        const subtotalTd = () => {
            const td = document.createElement("td");
            return td;
        }
        const shopTd = () => {
            const td = document.createElement("td");
            const select = new neoSelectbox("shop", selectOptions["shop"]["options"]);
            td.append(select);
            return td;
        }
        const fixedCostTd = () => {
            const td = document.createElement("td");
            const subtFixedCheck = document.createElement("input");
            subtFixedCheck.type = "checkbox"
            const select = document.createElement("select");
            fixedCost.forEach((element) => {
                const option = document.createElement("option");
                option.textContent = element["summary"] + ": " + element["budgetValue"];
                select.append(option);
            });
            td.append(subtFixedCheck, select);
            return td;
        }
        const noteTd = () => {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.type = "text";
            td.append(input);
            return td;
        }
        tr.append(sumCheckTd(), categoryTd(), prodNameTd(), unitPriceTd(), discountTd(), discountedTd(), countProdTd(), taxIncludedTd(), reducedTaxTd(), subtotalTd(), shopTd(), fixedCostTd(), noteTd());
        return tr;
    }
    createSumRow = () => {
        const tr = document.createElement("tr");
        for (let i = 0; i < 12; i++) {
            if (i === 8) {
                const td = document.createElement("td");
                td.textContent = "合計"
                tr.append(td);
            }
            const td = document.createElement("td");
            tr.append(td);
        }
        return tr;
    }
    createButtons = () => {
        const buttonDiv = document.createElement("div");
        Object.assign(buttonDiv.style, {
            margin: "5px 0"
        });
        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.textContent = "+";
        addButton.style.margin = "0 3px 0 0";
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "-";
        deleteButton.style.margin = "0 3px";
        const submitButton = document.createElement("button");
        submitButton.type = "button";
        submitButton.textContent = "確定";
        submitButton.style.display = "block"
        buttonDiv.append(addButton, deleteButton, submitButton);
        return buttonDiv;
    }
    changeView = (sumRow) => {
        const tableHeader = createInputTable.tableHeader;
        createInputTable.inputRows.forEach((element) => {
            const calc = new calculate();
            const unitPriceInput = element.children[3].children[0];
            const discountInput = element.children[4].children[0];
            const countProdInput = element.children[6].children[0];
            createInputTable.convertFullWidthDigitsToHalfWidthDigits(unitPriceInput);
            createInputTable.convertFullWidthDigitsToHalfWidthDigits(discountInput);
            createInputTable.convertFullWidthDigitsToHalfWidthDigits(countProdInput);
            element.addEventListener('change', () => {
                calc.calcDiscounted(element);
                calc.calcSubtotal(element);
                calc.calcSum(sumRow);
            }, false);
            tableHeader.addEventListener('change', () => {
                calc.calcDiscounted(element);
                calc.calcSubtotal(element);
                calc.calcSum(sumRow);
            }, false);
        });
    }
    pushRow = (sumRow) => {
        const inputRow = this.createInputRow();
        createInputTable.inputRows.push(inputRow);
        sumRow.before(inputRow);
    }
    removeRow = (table) => {
        const tableLength = table.children.length;
        if (tableLength > 3) {
            table.deleteRow(tableLength - 2);
            neoSelectbox.instance["category"].pop();
            neoSelectbox.instance["shop"].pop();
            neoSelectbox.selectboxes["category"].pop();
            neoSelectbox.selectboxes["shop"].pop()
            createInputTable.inputRows.pop();
        }
    }
    constructor() {
        const form = document.createElement("form");
        const table = document.createElement("table");
        table.className = "table";
        const tbody = document.createElement("tbody");
        table.append(tbody);

        const tableHeader = this.createTh();
        const sumRow = this.createSumRow();
        const buttons = this.createButtons();
        const dateInput = createInputTable.createDateInput();
        createInputTable.dateInput = dateInput;

        const addButton = buttons.children[0];
        const deleteButton = buttons.children[1];
        const submitButton = buttons.children[2];

        tbody.append(tableHeader);

        for (let i = 0; i < 5; i++) {
            const inputRow = this.createInputRow();
            createInputTable.inputRows.push(inputRow);
            tbody.append(inputRow);
        }

        tbody.append(sumRow);
        form.append(dateInput, table, buttons);

        this.changeView(sumRow);

        addButton.addEventListener('click', () => {
            this.pushRow(sumRow);
            this.changeView(sumRow);
        }, false);

        deleteButton.addEventListener('click', () => {
            this.removeRow(tbody);
            this.changeView(sumRow);
        }, false);

        submitButton.addEventListener('click', () => {
            const shoppingData = fetchData.getData();
            console.log(shoppingData);
            if (shoppingData) {
                const confirmToSubmit = confirm("送信するかー？");
                if (confirmToSubmit) {
                    fetchData.fetchOperation("post_shoppingData", "shopping_data", shoppingData);
                    window.location = "displayRecords.php";
                }
            }
        }, false);

        return form;
    }
}

const calculate = class {
    calcDiscounted = (inputRow) => {
        const unitPrice = inputRow.children[3].children[0].value;
        const discounted = inputRow.children[5];
        const discount = inputRow.children[4].children[0].value;
        const discountUnit = inputRow.children[4].children[1].options[inputRow.children[4].children[1].options.selectedIndex].textContent;
        if (unitPrice && discount && discountUnit === "%") {
            const discountedValue = Number(Math.round(unitPrice - (unitPrice * (discount * 0.01))));
            discounted.textContent = discountedValue;
        } else if (unitPrice && discount && discountUnit === "円") {
            const discountedValue = Number(unitPrice - discount);
            discounted.textContent = discountedValue;
        } else {
            discounted.textContent = unitPrice;
        }
    }
    calcSubtotal = (inputRow) => {
        const taxRate = 1.1;
        const reducedTaxRate = 1.08;

        const unitPrice = inputRow.children[3].children[0].value;
        const discounted = Number(inputRow.children[5].textContent);
        const countProd = inputRow.children[6].children[0].value;
        const subtotalTd = inputRow.children[9];
        const taxIncluded = inputRow.children[7].children[0].checked;
        const reducedTax = inputRow.children[8].children[0].checked;
        const discountedValue = () => {
            if (unitPrice && taxIncluded) {
                return Number(Math.round(discounted * countProd));
            } else if (unitPrice && reducedTax) {
                return Number(Math.round(discounted * reducedTaxRate * countProd));
            } else if (unitPrice) {
                return Number(Math.round(discounted * taxRate * countProd));
            } else {
                return null;
            }
        }
        subtotalTd.textContent = discountedValue();
    }
    calcSum = (sumRow) => {
        let sum = 0;
        createInputTable.inputRows.forEach((element, index) => {
            const isChecked = element.children[0].children[0].checked;
            const isCheckedFixed = element.children[11].children[0].checked;
            if (isChecked && !isCheckedFixed) {
                const subtotal = Number(createInputTable.inputRows[index].children[9].textContent);
                sum += subtotal;
            }
        });
        const sumTd = sumRow.children[9];
        sumTd.textContent = sum;
    }
}

const fetchData = class {
    static getData = () => {
        const fetchArr = [];
        let isNullAnySubtFixedSummary = false;
        let isNullAnyUnitPrice = false;
        const dateValue = createInputTable.dateInput.value;
        createInputTable.inputRows.forEach((element, index) => {
            const categoryValue = neoSelectbox.instance["category"][index].selectedOption;
            const prodNameValue = createInputTable.inputRows[index].children[2].children[0].value;
            const unitPriceValue = createInputTable.inputRows[index].children[3].children[0].value;
            const discountValue = createInputTable.inputRows[index].children[4].children[0].value;
            const discountUnitValue = createInputTable.inputRows[index].children[4].children[1].value;
            const countProdValue = createInputTable.inputRows[index].children[6].children[0].value;
            const taxIncludedValue = createInputTable.inputRows[index].children[7].children[0].checked;
            const reducedTaxValue = createInputTable.inputRows[index].children[8].children[0].checked;
            const shopValue = neoSelectbox.instance["shop"][index].selectedOption;
            const subtFixedValue = element.children[11].children[0].checked;
            let subtFixedSummary = null;
            if (subtFixedValue) {
                subtFixedSummary = fixedCost[element.children[11].children[1].selectedIndex]["summary"];
            }
            const noteValue = createInputTable.inputRows[index].children[12].children[0].value;
            if (prodNameValue && !unitPriceValue) {
                isNullAnyUnitPrice = true;
            }
            if (unitPriceValue) {
                if (subtFixedValue && !subtFixedSummary) {
                    isNullAnySubtFixedSummary = true;
                }
                const rowArr = {};
                rowArr.registered_on = dateValue;
                rowArr.category = categoryValue;
                rowArr.prodName = prodNameValue;
                rowArr.unitPrice = unitPriceValue;
                if (discountValue) {
                    rowArr.discount = discountValue;
                    rowArr.discountUnit = discountUnitValue;
                } else {
                    rowArr.discount = null;
                    rowArr.discountUnit = null;
                }
                rowArr.countProd = countProdValue;
                rowArr.taxIncluded = taxIncludedValue;
                rowArr.reducedTax = reducedTaxValue;
                rowArr.shop = shopValue;
                rowArr.subtFixed = subtFixedValue;
                rowArr.subtFixedSummary = subtFixedSummary;
                rowArr.note = noteValue;
                fetchArr.splice(index + 1, 1, rowArr);
            }
        });
        if (!dateValue) {
            alert('日付を入力してください');
            return;
        } else if (isNullAnyUnitPrice) {
            alert("単価が入力されていない行があります");
        } else if (isNullAnySubtFixedSummary) {
            alert("固定費から引く項目が選択されていない行があります");
            return;
        } else {
            return fetchArr;
        }
    }
    static fetchOperation = async (Method, className, body) => {
        const fetchArr = {};
        fetchArr.method = Method;
        fetchArr.className = className;
        fetchArr.body = body;
        console.log(fetchArr);
        try {
            await fetch("input.php", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify(fetchArr),
            });
        } catch (error) {
            console.log("doesn't work: " + error);
        }
    }
}

const inputTable = new createInputTable();
const testDiv = document.querySelector("#test");
testDiv.append(inputTable);