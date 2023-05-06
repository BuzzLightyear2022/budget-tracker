const budgetTable = class {
    static budgetData;
    static amountBudget;
    static dataTrArr = [];

    elements = class {
        createHeader = () => {
            const headers = ["項目", "予算", "予算残額"];
            const tr = document.createElement("tr");
            headers.forEach((element, index) => {
                const th = document.createElement("th");
                th.textContent = headers[index];
                tr.append(th);
            });
            return tr;
        }
        createTr = (budgetName, budgetValue) => {
            const tr = document.createElement("tr");

            const nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.textContent = budgetName;

            const valueInput = document.createElement("input");
            valueInput.type = "number";
            valueInput.value = budgetValue;

            tr.append(nameInput, valueInput);

            return tr;
        }
        createSumTr = () => {
            const tr = document.createElement("tr");
            for (let i = 0; i < 2; i++) {
                const td = document.createElement("td");
                if (i === 1) {
                    td.textContent = "";
                } else {
                    td.textContent = "合計";
                }
                tr.append(td);
            }
            return tr;
        }
        createAddButton = () => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = "行追加";
            return button;
        }
        createDeleteButton = () => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = "行削除";
            return button;
        }
        createAmountInput = () => {
            const table = document.createElement("table");

            const tr = document.createElement("tr");

            const labelTd = document.createElement("td");
            labelTd.textContent = "今月の収入: ";

            const inputTd = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.value = budgetTable.amountBudget[0]["amountBudget"];
            inputTd.append(input);

            tr.append(labelTd, inputTd);
            table.append(tr);

            return table;
        }
    }
    createData = (budgetName, budgetValue) => {
        const tr = document.createElement("tr");

        const nameTd = document.createElement("td");
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = budgetName;
        nameTd.append(nameInput);

        const valueTd = document.createElement("td");
        const valueInput = document.createElement("input");
        valueInput.type = "number";
        valueInput.value = budgetValue;
        valueTd.append(valueInput);

        tr.append(nameTd, valueTd);
        budgetTable.dataTrArr.push(tr);

        return tr;
    }
    fetchData = async (data) => {
        try {
            await fetch(
                "sqlOperation.php",
                {
                    method: "POST",
                    mode: "cors",
                    cache: "no-cache",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    redirect: "follow",
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify(data)
                }
            );
        } catch (e) {
            console.log(e);
        }
    }
    calcSum = () => {
        let sum = 0;
        budgetTable.dataTrArr.forEach((element, index) => {
            const valueInput = budgetTable.dataTrArr[index].children[1].children[0];
            sum += Number(valueInput.value);
        });
        return sum;
    }
    updateValue = (amountInput) => {
        budgetTable.dataTrArr.forEach((element, index) => {
            const rows = budgetTable.dataTrArr[index];
            const eachValueInput = budgetTable.dataTrArr[index].children[1].children[0];
            const eachNameInput = budgetTable.dataTrArr[index].children[0].children[0];

            eachNameInput.addEventListener('change', () => {
                const updateMethod = { method: "UPDATE_name" };
                const insertMethod = { method: "INSERT_name" };

                let fetchObj = [];
                if (budgetTable.budgetData[index] && !eachNameInput.value && !eachValueInput.value) {
                    fetchObj.push({ method: "DELETE_row" }, budgetTable.budgetData[index]["id"]);
                } else if (budgetTable.budgetData[index] && !eachNameInput.value) {
                    fetchObj.push(updateMethod);
                    fetchObj.push(budgetTable.budgetData[index]["id"], null);
                } else if (budgetTable.budgetData[index]) {
                    fetchObj.push(updateMethod);
                    fetchObj.push(budgetTable.budgetData[index]["id"], eachNameInput.value);
                } else {
                    fetchObj.push(insertMethod);
                    fetchObj.push(eachNameInput.value);
                }
                this.fetchData(fetchObj);
                location.reload();
            }, false);

            eachValueInput.addEventListener('change', () => {
                const updateMethod = { method: "UPDATE_value" };
                const insertMethod = { method: "INSERT_value" };

                let fetchObj = [];
                if (budgetTable.budgetData[index] && !eachNameInput.value && !eachValueInput.value) {
                    fetchObj.push({ method: "DELETE_row" }, budgetTable.budgetData[index]["id"]);
                } else if (budgetTable.budgetData[index] && !eachValueInput.value) {
                    fetchObj.push(updateMethod);
                    fetchObj.push(budgetTable.budgetData[index]["id"], null);
                } else if (budgetTable.budgetData[index]) {
                    fetchObj.push(updateMethod);
                    fetchObj.push(budgetTable.budgetData[index]["id"], eachValueInput.value);
                } else {
                    fetchObj.push(insertMethod);
                    fetchObj.push(eachValueInput.value);
                }
                this.fetchData(fetchObj);
                location.reload();
            }, false);
        });

        amountInput.addEventListener('change', () => {
            const insertMethod = { method: "INSERT_amount" };
            const updateMethod = { method: "UPDATE_amount" };

            let fetchObj = [];
            if (budgetTable.amountBudget) {
                fetchObj.push(updateMethod);
                fetchObj.push(budgetTable.amountBudget[0]["id"]);
                fetchObj.push(amountInput.value);
                console.log(fetchObj);
            } else {
                fetchObj.push(insertMethod);
                fetchObj.push(amountInput.value);
            }
            this.fetchData(fetchObj);
            location.reload();
        }, false);
    }
    addData = () => {
        const tr = document.createElement("tr");

        const nameTd = document.createElement("td");
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameTd.append(nameInput);

        const valueTd = document.createElement("td");
        const valueInput = document.createElement("input");
        valueInput.type = "number";
        valueTd.append(valueInput);

        tr.append(nameTd, valueTd);
        budgetTable.dataTrArr.push(tr);

        return tr;
    }
    changeView = (sumDivElement) => {
        budgetTable.dataTrArr.forEach((element, index) => {
            const valueInput = budgetTable.dataTrArr[index].children[1].children[0];
            sumDivElement.textContent = this.calcSum();
            valueInput.addEventListener('change', () => {
                sumDivElement.textContent = this.calcSum();
            }, false);
        });
    }
    displayBalance = (amount) => {
        const balanceDiv = document.createElement("div");
        Object.assign(balanceDiv.style, {
            padding: "20px 0"
        });
        const label = document.createElement("label");
        label.textContent = "差引残高: ";
        const span = document.createElement("span");
        span.textContent = amount - this.calcSum();

        balanceDiv.append(label, span);
        return balanceDiv;
    }
    constructor(budgetData) {
        budgetTable.budgetData = budgetData;
        budgetTable.amountBudget = amountBudget;
        const element = new this.elements();

        const outerMostDiv = document.createElement("div");

        const amountInputTable = element.createAmountInput();
        outerMostDiv.append(amountInputTable);
        const amountInput = amountInputTable.children[0].children[1].children[0];

        const stmt = document.createElement("h3");
        stmt.textContent = "固定費";
        outerMostDiv.append(stmt);

        const table = document.createElement("table");

        const th = element.createHeader();
        const sumRow = element.createSumTr();
        const sumDiv = sumRow.children[1];
        const addButton = element.createAddButton();
        const deleteButton = element.createDeleteButton();

        table.append(th);

        budgetTable.budgetData.forEach((element, index) => {
            const budgetName = budgetTable.budgetData[index]["budgetName"];
            const budgetValue = budgetTable.budgetData[index]["budgetValue"];
            const eachData = this.createData(budgetName, budgetValue);
            table.append(eachData);
        });

        sumDiv.textContent = this.calcSum();
        table.append(sumRow);

        outerMostDiv.append(table);
        outerMostDiv.append(addButton, deleteButton);

        const balanceDiv = this.displayBalance(amountInput.value);
        outerMostDiv.append(balanceDiv);

        addButton.addEventListener('click', () => {
            const tr = this.addData();
            sumRow.before(tr);
            console.log(budgetTable.dataTrArr);
            this.changeView(sumDiv);
            this.updateValue(amountInput);
        }, false);

        deleteButton.addEventListener('click', () => {
            const lastRowIndex = budgetTable.dataTrArr.length - 1;
            const lastRow = budgetTable.dataTrArr[lastRowIndex];
            const nameInput = lastRow.children[0].children[0];
            const valueInput = lastRow.children[1].children[0];
            
            if (nameInput.value || valueInput.value) {
                const confirmMes = confirm(`"${nameInput.value}"を削除しますか？`);
                if(confirmMes) {
                    const fetchObj = [];
                    fetchObj.push({ method: "DELETE_row" }, budgetTable.budgetData[lastRowIndex]["id"]);
                    this.fetchData(fetchObj);
                    budgetTable.budgetData.pop();
                    location.reload();
                }
            } else {
                budgetTable.dataTrArr.pop();
                table.deleteRow(lastRowIndex + 1);
            }
        }, false);

        this.changeView(sumDiv);
        this.updateValue(amountInput);

        return outerMostDiv;
    }
}