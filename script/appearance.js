const neoSelectbox = class {
    className;
    selectedOption;
    selectedIndex;
    thisIndex;

    static options = {};
    static selectboxes = {};
    static instance = {};

    fontSize = 14;
    width = 150;

    constructor(className, optionArr) {
        this.className = className;

        if (!neoSelectbox.instance[this.className]) {
            neoSelectbox.instance[this.className] = [];
        }
        if (!neoSelectbox.selectboxes[this.className]) {
            neoSelectbox.selectboxes[this.className] = [];
        }

        if (!optionArr || !Array.isArray(optionArr)) {
            neoSelectbox.options[this.className] = ["選択肢がありません"];
        } else {
            neoSelectbox.options[this.className] = optionArr;
        }

        const neoSelectboxDiv = this.neoSelectboxDiv();

        // initialization.
        this.chooseOperation(0, neoSelectboxDiv);

        neoSelectboxDiv.addEventListener('click', () => {
            this.displayOptionwindow(neoSelectboxDiv);
        }, false);

        neoSelectbox.instance[this.className].push(this);
        neoSelectbox.selectboxes[this.className].push(neoSelectboxDiv);
        this.thisIndex = neoSelectbox.instance[this.className].length - 1;

        return neoSelectboxDiv;
    }
    chooseOperation = (index, selectbox) => {
        this.selectedIndex = index;
        this.selectedOption = neoSelectbox.options[this.className][this.selectedIndex];
        const selectedOptionDiv = selectbox.children[0];
        selectedOptionDiv.textContent = this.selectedOption;

        const selectBoxesInstances = neoSelectbox.instance[this.className];
        const selectBoxesElements = neoSelectbox.selectboxes[this.className];
        const selectedItem = neoSelectbox.options[this.className][index];
        selectBoxesInstances.forEach((element, selectboxIndex) => {
            if (this.thisIndex < selectboxIndex) {
                element.selectedOption = selectedItem;
                element.selectedIndex = index;
                selectBoxesElements[selectboxIndex].children[0].textContent = selectedItem;
            }
        });
    }
    deleteOperation = (deleteIndex) => {
        const delConfirm = confirm(`"${neoSelectbox.options[this.className][deleteIndex]}"を削除しますか？`);
        if (delConfirm) {
            const deletedOption = neoSelectbox.options[this.className];
            neoSelectbox.options[this.className].splice(deleteIndex, 1);
            neoSelectbox.instance[this.className].forEach((element, index) => {
                if (neoSelectbox.instance[this.className][index].selectedIndex > deleteIndex || neoSelectbox.instance[this.className][index].selectedIndex === neoSelectbox.options[this.className].length) {
                    neoSelectbox.instance[this.className][index].selectedIndex--;
                    neoSelectbox.instance[this.className][index].selectedOption = neoSelectbox.options[this.className][neoSelectbox.instance[this.className][index].selectedIndex];
                    neoSelectbox.selectboxes[this.className][index].children[0].textContent = neoSelectbox.instance[this.className][index].selectedOption;
                } else if (neoSelectbox.instance[this.className][index].selectedIndex === deleteIndex) {
                    neoSelectbox.instance[this.className][index].selectedOption = neoSelectbox.options[this.className][neoSelectbox.instance[this.className][index].selectedIndex];
                    neoSelectbox.selectboxes[this.className][index].children[0].textContent = neoSelectbox.options[this.className][neoSelectbox.instance[this.className][index].selectedIndex];
                }
            });
        }
    }
    addItem = (value, selectbox) => {
        neoSelectbox.options[this.className].push(value);
        this.chooseOperation(neoSelectbox.options[this.className].length - 1, selectbox);
    }
    neoSelectboxDiv = () => {
        const elements = class {
            fontSize;
            width;

            constructor(fontSize, width) {
                this.fontSize = fontSize;
                this.width = width;
            }

            neoSelectboxDiv = () => {
                const div = document.createElement("div");
                Object.assign(div.style, {
                    display: "flex",
                    border: "solid",
                    borderRadius: "5px",
                    borderColor: "darkgray",
                    width: this.width + "px",
                    cursor: "default"
                });
                return div;
            }
            selectedOptionDiv = () => {
                const div = document.createElement("div");
                Object.assign(div.style, {
                    fontSize: this.fontSize + "px",
                    display: "inline-block",
                    margin: "0 0 0 0.5rem",
                    overflow: "hidden",
                    textAlign: "left",
                    whiteSpace: "noWrap",
                    overflow: "scroll"
                });
                return div;
            }
            triangleSymbolDiv = () => {
                const div = document.createElement("div");
                div.textContent = "⇣";
                Object.assign(div.style, {
                    fontSize: this.fontSize + "px",
                    display: "inline-block",
                    float: "right",
                    padding: "0 0.5rem 0 0",
                    margin: "0 0 0 auto"
                });
                return div;
            }
        }
        const element = new elements(this.fontSize, this.width);
        const neoSelectBoxDiv = element.neoSelectboxDiv();
        const selectedOptionDiv = element.selectedOptionDiv();
        const triangleSymbolDiv = element.triangleSymbolDiv();

        selectedOptionDiv.textContent = this.selectedOption;
        neoSelectBoxDiv.append(selectedOptionDiv, triangleSymbolDiv);

        return neoSelectBoxDiv;
    }
    closeDiv = () => {
        const div = document.createElement("div");
        Object.assign(div.style, {
            display: "block",
            zIndex: "1",
            left: "0",
            top: "0",
            height: "100%",
            width: "100%",
            position: "fixed",
        });
        return div;
    }
    optionwindowDiv = () => {
        const elements = class {
            fontSize;

            constructor(fontSize) {
                this.fontSize = fontSize;
            }

            optionwindowDiv = () => {
                const div = document.createElement("div");
                Object.assign(div.style, {
                    zIndex: "2",
                    display: "flex",
                    flexDirection: "column",
                    border: "solid",
                    borderRadius: "5px",
                    borderColor: "darkgray",
                    backgroundColor: "gainsboro",
                    boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 7px 20px 0 rgba(0, 0, 0, 0.17)",
                    position: "absolute"
                });
                return div;
            }
            rowDivs = (className) => {
                const rowDivs = [];
                const elements = class {
                    fontSize;

                    constructor(fontSize) {
                        this.fontSize = fontSize;
                    }

                    rowDiv = () => {
                        const div = document.createElement("div");
                        Object.assign(div.style, {
                            display: "flex",
                            flexDirection: "row",
                            padding: "0 5px"
                        });
                        return div;
                    }
                    checkSymbolDiv = () => {
                        const div = document.createElement("div");
                        div.textContent = "✓";
                        Object.assign(div.style, {
                            display: "flex",
                            whiteSpace: "nowrap",
                            fontSize: this.fontSize + "px",
                        });
                        return div;
                    }
                    optionDiv = () => {
                        const div = document.createElement("div");
                        Object.assign(div.style, {
                            display: "block",
                            whiteSpace: "nowrap",
                            padding: "0 auto 0 0 ",
                            fontSize: this.fontSize + "px"
                        });
                        return div;
                    }
                    deleteButton = () => {
                        const div = document.createElement("div");
                        div.textContent = "×";
                        Object.assign(div.style, {
                            display: "flex",
                            margin: "0 0 0 auto",
                            color: "red",
                            fontSize: this.fontSize + "px"
                        });
                        return div;
                    }
                }
                neoSelectbox.options[className].forEach((arrElement, index) => {
                    const changeColor = () => {
                        rowDiv.addEventListener('mouseover', () => {
                            Object.assign(rowDiv.style, {
                                backgroundColor: "DodgerBlue",
                                color: "white",
                                cursor: "default"
                            });
                        }, false);
                        rowDiv.addEventListener('mouseout', () => {
                            Object.assign(rowDiv.style, {
                                backgroundColor: "transparent",
                                color: "black"
                            });
                        }, false);
                    }

                    const element = new elements(this.fontSize);
                    const rowDiv = element.rowDiv();
                    const checkSymbolDiv = element.checkSymbolDiv();
                    const optionDiv = element.optionDiv();
                    const deleteButton = element.deleteButton();

                    optionDiv.textContent = neoSelectbox.options[className][index];
                    changeColor();

                    rowDiv.append(checkSymbolDiv, optionDiv, deleteButton);

                    rowDivs.push(rowDiv);
                });
                return rowDivs;
            }
        }
        const displayCheckmark = (index) => {
            const checkDiv = rowDivs[index].children[0];
            if (index === this.selectedIndex) {
                checkDiv.style.visibility = "visible";
            } else {
                checkDiv.style.visibility = "hidden";
            }
        }

        const element = new elements(this.fontSize);
        const rowDivs = element.rowDivs(this.className);
        const optionwindowDiv = element.optionwindowDiv();

        rowDivs.forEach((element, index) => {
            optionwindowDiv.append(rowDivs[index]);
            displayCheckmark(index);
        });

        return optionwindowDiv;
    }
    displayOptionwindow = (neoSelectboxDiv) => {
        const addDiv = () => {
            const elements = class {
                addDiv = () => {
                    const div = document.createElement("div");
                    Object.assign(div.style, {
                        display: "inline-block",
                        flexDirection: "column"
                    });
                    return div;
                }
                addInput = () => {
                    const input = document.createElement("input");
                    input.type = "text";
                    Object.assign(input.style, {
                        minWidth: "100px"
                    });
                    return input;
                }
                addButton = () => {
                    const button = document.createElement("button");
                    button.type = "button";
                    button.textContent = "追加";
                    Object.assign(button.style, {
                        display: "block",
                        margin: "0 0 0 auto"
                    });
                    return button;
                }
            }
            const element = new elements();
            const addDiv = element.addDiv();
            const input = element.addInput()
            const addButton = element.addButton();
            addDiv.append(input, addButton);
            return addDiv;
        }

        const body = document.querySelector("body");
        const closeDiv = this.closeDiv();
        const optionwindow = this.optionwindowDiv();
        const element = optionwindow.children;
        const addinput = addDiv();
        const addButton = addinput.children[1];
        const addvalue = addinput.children[0];

        const neoSelectboxPosition = neoSelectboxDiv.getBoundingClientRect();
        Object.assign(optionwindow.style, {
            top: (neoSelectboxPosition.y - 3) + "px",
            left: neoSelectboxPosition.x + "px",
        });

        body.append(closeDiv, optionwindow);

        const optionwindowWidth = optionwindow.getBoundingClientRect()["width"];
        addinput.children[0].style.width = optionwindowWidth + "px";
        optionwindow.append(addinput);

        for (let index = 0; index < element.length - 1; index++) {
            const eachDeleteButton = element[index].children[2];
            eachDeleteButton.addEventListener('click', (e) => {
                const idOfDeleteObj = selectOptions[this.className]["id"][index];
                this.deleteOperation(index);
                selectOptions[this.className]["id"].splice(index, 1);
                closeDiv.remove();
                optionwindow.remove();
                this.displayOptionwindow(neoSelectboxDiv);
                fetchData.fetchOperation("delete", this.className, idOfDeleteObj);
                e.stopPropagation();
            }, false);

            element[index].addEventListener('click', (e) => {
                this.chooseOperation(index, neoSelectboxDiv);
                closeDiv.remove();
                optionwindow.remove();
                e.stopPropagation();
            }, false);
        }

        addButton.addEventListener('click', () => {
            this.addItem(addvalue.value, neoSelectboxDiv);
            closeDiv.remove();
            optionwindow.remove();
            this.displayOptionwindow(neoSelectboxDiv);
            fetchData.fetchOperation("add", this.className, addvalue.value);
        }, false);

        document.addEventListener('click', (e) => {
            if (e.target === closeDiv) {
                closeDiv.remove();
                optionwindow.remove();
            }
        }, false);
    }
}

const createInputTable = class {
    static inputRows = [];
    static tableHeader;
    static dateInput;

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

        const headers = ["", "カテゴリ", "品名", "単価", "割引", "割引後", "個数", "内税", "軽減税率", "税込", "店", "固定費から引く", "備考"];
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
            input.type = "number";
            input.style.width = "100px";
            td.append(input);
            return td;
        }
        const discountTd = () => {
            const discountUnit = ["%", "円"];
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
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
            input.type = "number";
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
        table.border = "solid";

        const tableHeader = this.createTh();
        const sumRow = this.createSumRow();
        const buttons = this.createButtons();
        const dateInput = createInputTable.createDateInput();
        createInputTable.dateInput = dateInput;

        const addButton = buttons.children[0];
        const deleteButton = buttons.children[1];
        const submitButton = buttons.children[2];

        table.append(tableHeader);

        for (let i = 0; i < 5; i++) {
            const inputRow = this.createInputRow();
            createInputTable.inputRows.push(inputRow);
            table.append(inputRow);
        }

        table.append(sumRow);

        form.append(dateInput, table, buttons);

        this.changeView(sumRow);

        addButton.addEventListener('click', () => {
            this.pushRow(sumRow);
            this.changeView(sumRow);
        }, false);

        deleteButton.addEventListener('click', () => {
            this.removeRow(table);
            this.changeView(sumRow);
        }, false);

        submitButton.addEventListener('click', () => {
            const shoppingData = fetchData.getData();
            const confirmToSubmit = confirm("送信するかー？");
            if (confirmToSubmit) {
                fetchData.fetchOperation("post_shoppingData", "shopping_data", shoppingData);
            }
            window.location = "displayRecords.php";
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
        const dateValue = createInputTable.dateInput.value;
        if (dateValue) {
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
                let subtFixedSummary = "";
                if (fixedCost.length) {
                    subtFixedSummary = fixedCost[element.children[11].children[1].selectedIndex]["summary"];
                }
                const noteValue = createInputTable.inputRows[index].children[12].children[0].value;

                if (unitPriceValue) {
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
                    if (subtFixedValue) {
                        rowArr.subtFixedSummary = subtFixedSummary;
                    } else {
                        rowArr.subtFixedSummary = null;
                    }
                    rowArr.note = noteValue;
                    fetchArr.splice(index + 1, 1, rowArr);
                }
            });
            return fetchArr;
        } else {
            alert('日付を入力してないーぬよ！')
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