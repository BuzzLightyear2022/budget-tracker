const inputBudget = class {
    elements = class {
        createStatement = () => {
            const statement = document.createElement("h2");
            statement.textContent = "予算を入力してください。";
            return statement;
        }
        createTextInput = () => {
            const input = document.createElement("input");
            input.type = "text";
            return input;
        }
        createOkButton = () => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = "OK";
            return button;
        }
        tableHeader = () => {
            const headers = ["項目", "金額"];
            const tr = document.createElement("tr");
            headers.forEach((element, index) => {
                const th = document.createElement("th");
                th.textContent = headers[index];
                tr.append(th);
            });
            return tr;
        }
        tableData = () => {
            const tr = document.createElement("tr");
            const select = new neoSelectbox(itemsJson);
            select.fontSize = 13;
            const input = this.createTextInput();
            const data = [select, input];
            data.forEach((element, index) => {
                const td = document.createElement("td");
                td.append(data[index]);
                tr.append(td);
            });
            return tr;
        }
    }
    displayInputWindow = () => {
        const element = new this.elements;
        const outerMostDiv = document.createElement("div");

        const statement = element.createStatement();

        const table = document.createElement("table");
        const th = element.tableHeader();
        table.append(th);
        for (let i = 0; i < 5; i++) {
            const td = element.tableData();
            table.append(td);
        }

        const okButton = element.createOkButton();
        outerMostDiv.append(statement, table, okButton);
        return outerMostDiv;
    }
}

const inputBudgetInstance = new inputBudget();
const body = document.querySelector("body");
const inputWindow = inputBudgetInstance.displayInputWindow();
body.append(inputWindow);
