class inputRows {
    static rows = [];
    static convertFullWidthDigitsToHalfWidthDigits = (element) => {
        const fullWidthNumbers = '０１２３４５６７８９';
        element.addEventListener('input', () => {
            if (element.value) {
                element.value = element.value.replace(/[０-９]/g, (match) => {
                    const index = fullWidthNumbers.indexOf(match);
                    return index !== -1 ? String(index) : match;
                });
            } else {
                return;
            }
        }, false);

    }
    static inputTr = (summary, budgetValue) => {
        const tr = document.createElement("tr");
        const summaryTd = document.createElement("td");
        const summaryInput = document.createElement("input");
        summaryInput.type = "text";
        if (summary) {
            summaryInput.value = summary;
        } else {
            summaryInput.value = null;
        }
        summaryTd.append(summaryInput);
        const budgetValueTd = document.createElement("td");
        const budgetValueInput = document.createElement("input");
        // budgetValueInput.type = "number";
        if (budgetValue) {
            budgetValueInput.value = budgetValue;
        } else {
            budgetValueInput.value = 0;
        }
        budgetValueTd.append(budgetValueInput);
        tr.append(summaryTd, budgetValueTd);
        return tr;
    }
    static calcSum = () => {
        let sum = 0;
        inputRows.rows.forEach((element, index) => {
            const budgetValueInput = element.children[1].children[0];
            sum += Number(budgetValueInput.value);
        });
        return sum;
    }
    static changeView = (sumTd, amountBudgetInput, balanceElm) => {
        const displaySum = () => {
            sumTd.textContent = inputRows.calcSum();
            balanceElm.textContent = amountBudgetInput.value - inputRows.calcSum();
        }
        inputRows.rows.forEach((element) => {
            const eachValueInput = element.children[1].children[0];
            eachValueInput.addEventListener('input', () => {
                inputRows.convertFullWidthDigitsToHalfWidthDigits(eachValueInput);
            }, false);
            element.addEventListener('change', { handleEvent: displaySum }, false);
        });
        amountBudgetInput.addEventListener('change', { handleEvent: displaySum }, false);
    }
}
class fetchData {
    static amountBudgetInput = document.querySelector("#amountBudgetInput");
    static getData = (postMethod) => {
        const postArr = {
            method: postMethod
        };
        const dataArr = [];
        inputRows.rows.forEach((element, index) => {
            const summaryInput = inputRows.rows[index].children[0].children[0];
            const budgetValueInput = inputRows.rows[index].children[1].children[0];
            if (summaryInput.value || budgetValueInput.value) {
                const rowArr = {};
                rowArr.summary = summaryInput.value;
                rowArr.budgetValue = budgetValueInput.value;
                dataArr.push(rowArr);
            }
        });
        postArr.data = dataArr;
        return postArr;
    }
    static checkPostData = () => {
        const postData = {
            INSERT_amountBudget: [],
            UPDATE_amountBudget: [],
            INSERT_row: [],
            UPDATE_row: [],
            UPDATE_summary: [],
            UPDATE_budgetValue: [],
            DELETE_row: []
        };
        const amountBudgetInput = document.querySelector("#amountBudgetInput");
        if (!amountBudget && amountBudgetInput.value) {
            postData.INSERT_amountBudget.push({
                amountBudget: amountBudgetInput.value
            });
        } else if (Number(amountBudget["amountBudget"]) !== Number(amountBudgetInput.value) && amountBudgetInput.value) {
            postData["UPDATE_amountBudget"].push({
                id: amountBudget["id"],
                amountBudget: amountBudgetInput.value
            });
        }
        let isAnyBudgetValueInput = true;
        inputRows.rows.forEach((element, index) => {
            const summaryInput = element.children[0].children[0];
            if (!summaryInput.value) {
                isAnyBudgetValueInput = false;
            }
            const budgetValueInput = element.children[1].children[0];
            if (budgetData[index]) {
                if (String(budgetData[index]["summary"]) !== String(summaryInput.value) && Number(budgetData[index]["budgetValue"]) !== Number(budgetValueInput.value)) {
                    postData["UPDATE_row"].push({
                        id: budgetData[index]["id"],
                        summary: summaryInput.value,
                        budgetValue: budgetValueInput.value
                    });
                } else if (String(budgetData[index]["summary"]) !== String(summaryInput.value)) {
                    let summaryVal = null;
                    if (summaryInput.value) {
                        summaryVal = summaryInput.value;
                    }
                    postData["UPDATE_summary"].push({
                        id: budgetData[index]["id"],
                        summary: summaryVal,
                    });
                } else if (Number(budgetData[index]["budgetValue"]) !== Number(budgetValueInput.value)) {
                    let budgetValueConst = null;
                    if (budgetValueInput.value) {
                        budgetValueConst = budgetValueInput.value;
                    }
                    postData["UPDATE_budgetValue"].push({
                        id: budgetData[index]["id"],
                        budgetValue: budgetValueConst,
                    });
                }
            } else {
                const summaryValue = summaryInput.value;
                const budgetValue = budgetValueInput.value;
                postData["INSERT_row"].push({
                    summary: summaryValue,
                    budgetValue: budgetValue
                });
            }
        });
        budgetData.forEach((element, index) => {
            if (!inputRows.rows[index]) {
                postData["DELETE_row"].push({
                    id: element["id"]
                });
            }
        });
        if (isAnyBudgetValueInput) {
            console.log(postData);
            return postData;
        } else {
            alert('予算名が入力されていない行があります');
            return;
        }

    }
    static fetchData = async (data) => {
        const confirmMes = confirm("送信するかー？");
        if (confirmMes) {
            try {
                await fetch("inputBudget.php", {
                    method: "POST",
                    mode: "cors",
                    cache: "no-cache",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    redirect: "follow",
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify(data)
                });
            } catch (e) {
                console.log(e);
            }
        }
    }

}

const amountBudgetInput = document.querySelector("#amountBudgetInput");
const inputTable = document.querySelector("#inputTable");
const sumTr = document.querySelector("#sumTr");
const sumTd = document.querySelector("#sumTd");
const balanceElm = document.querySelector("#balanceElm");
const title = document.querySelector("#title");
const pullButton = document.createElement("button");
const addButton = document.querySelector("#addButton");
const removeButton = document.querySelector("#removeButton");
const submitButton = document.querySelector("#submit");

if (!budgetData.length && !amountBudget.length && !lastMonthData) {
    for (i = 0; i < 5; i++) {
        const tr = inputRows.inputTr();
        inputRows.rows.push(tr);
        sumTr.before(tr);
    }
    amountBudgetInput.value = 0;
} else if (!budgetData.length && !amountBudget.length && lastMonthData) {
    amountBudgetInput.value = 0;
    for (i = 0; i < 5; i++) {
        const tr = inputRows.inputTr();
        inputRows.rows.push(tr);
        sumTr.before(tr);
    }
    pullButton.style.display = "block";
    pullButton.textContent = "先月のデータをひっぱる！";
    title.after(pullButton);
} else {
    amountBudgetInput.value = amountBudget["amountBudget"];
    budgetData.forEach((element) => {
        const tr = inputRows.inputTr(element["summary"], element["budgetValue"]);
        sumTr.before(tr);
        inputRows.rows.push(tr);
        if (!amountBudget) {
            amountBudgetInput.value = 0;
        }
    });
}
sumTd.textContent = inputRows.calcSum();
balanceElm.textContent = amountBudgetInput.value - inputRows.calcSum();
inputRows.changeView(sumTd, amountBudgetInput, balanceElm);

addButton.addEventListener('click', () => {
    const tr = inputRows.inputTr();
    inputRows.rows.push(tr);
    sumTr.before(tr);
    inputRows.changeView(sumTd, amountBudgetInput, balanceElm);
}, false);

removeButton.addEventListener('click', () => {
    const lastRow = inputRows.rows[inputRows.rows.length - 1];
    const lastSummaryInput = lastRow.children[0].children[0];
    const lastBudgetValueInput = lastRow.children[1].children[0];
    if (inputRows.rows.length > 1) {
        if (lastSummaryInput.value || lastBudgetValueInput.value) {
            const confirmMes = confirm(`"${lastSummaryInput.value}"を削除しますか？`);
            if (confirmMes) {
                inputRows.rows.pop();
                inputTable.deleteRow(inputRows.rows.length + 1);
            }
        } else {
            inputRows.rows.pop();
            inputTable.deleteRow(inputRows.rows.length + 1);
        }
        sumTd.textContent = inputRows.calcSum();
        balanceElm.textContent = amountBudgetInput.value - inputRows.calcSum();
    }
}, false);

pullButton.addEventListener('click', () => {
    window.location = "inputBudget.php?pullLastMonth=true";
}, false);

submitButton.addEventListener('click', () => {
    const postData = fetchData.checkPostData();
    if (postData) {
        fetchData.fetchData(postData);
        document.location.href = "index.php";
    }
}, false);

const inputRowsArrs = inputRows.rows;
inputRowsArrs.forEach((element) => {
    const budgetInput = element.children[1].children[0];
    budgetInput.addEventListener('input', () => {
        inputRows.convertFullWidthDigitsToHalfWidthDigits(budgetInput);
    }, false);
});

amountBudgetInput.addEventListener('input', () => {
    inputRows.convertFullWidthDigitsToHalfWidthDigits(amountBudgetInput);
}, false);