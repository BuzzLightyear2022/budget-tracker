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