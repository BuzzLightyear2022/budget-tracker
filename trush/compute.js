const discountedArr = [];
const subtotalArr = [];

function calcDiscount() {
    const unitPrice = document.querySelectorAll(".unitPrice");
    const discount = document.querySelectorAll(".discount");
    const discountUnit = document.querySelectorAll(".discountUnit");
    const discountedSpan = document.querySelectorAll(".discountedSpan");
    rows.forEach((element, index) => {
        if (unitPrice[index].value && discount[index].value && discountUnit[index].options[discountUnit[index].selectedIndex].textContent === "%") {
            const discounted = Number(Math.round(unitPrice[index].value - (unitPrice[index].value * (discount[index].value * 0.01))));
            discountedArr.splice(index, 1, discounted);
            // change view.
            discountedSpan[index].textContent = discountedArr[index];
        }
        else if (unitPrice[index].value && discount[index].value && discountUnit[index].options[discountUnit[index].selectedIndex].textContent === "円") {
            const discounted = Number(unitPrice[index].value - discount[index].value);
            discountedArr.splice(index, 1, discounted);
            // change view.
            discountedSpan[index].textContent = discountedArr[index];
        } else if (unitPrice[index].value) {
            const discounted = Number(unitPrice[index].value);
            discountedArr.splice(index, 1, discounted);
            // change view.
            discountedSpan[index].textContent = "";
        } else {
            delete discountedArr[index];
            discountedSpan.textContent = "";
        }
    });
}

function calcTaxIncluded() {
    const unitPrice = document.querySelectorAll(".unitPrice");
    const countProd = document.querySelectorAll(".countProd");
    const taxIncluded = document.querySelectorAll(".taxIncluded");
    const reducedTax = document.querySelectorAll(".reducedTax");
    const subtotalSpan = document.querySelectorAll(".subtotalSpan");
    const taxRate = 1.1;
    const reducedTaxRate = 1.08;
    rows.forEach((element, index) => {
        if (unitPrice[index].value && taxIncluded[index].checked) {
            const taxIncluded = Number(Math.round(discountedArr[index] * countProd[index].value));
            subtotalArr.splice(index, 1, taxIncluded);
            // change view.
            subtotalSpan[index].textContent = subtotalArr[index];
        } else if (unitPrice[index].value && reducedTax[index].checked) {
            const taxIncluded = Number(Math.round(discountedArr[index] * reducedTaxRate * countProd[index].value));
            subtotalArr.splice(index, 1, taxIncluded);
            // change view.
            subtotalSpan[index].textContent = subtotalArr[index];
        } else if (unitPrice[index].value && !taxIncluded[index].checked) {
            const taxIncluded = Number(Math.round(discountedArr[index] * taxRate * countProd[index].value));
            subtotalArr.splice(index, 1, taxIncluded);
            // change view.
            subtotalSpan[index].textContent = subtotalArr[index];
        } else {
            delete subtotalArr[index];
            subtotalSpan[index].textContent = "";
        }
    });
}

function calcSum() {
    const sumSpan = document.querySelector("#sumSpan");
    const sumCheck = document.querySelectorAll(".sumCheck");
    const unitPrice = document.querySelectorAll(".unitPrice");
    let sum = 0;
    sumCheck.forEach((element, index) => {
        if (sumCheck[index].checked && unitPrice[index].value) {
            sum += Number(subtotalArr[index]);
        }
    });
    if (sum == 0) {
        sumSpan.textContent = "";
    } else {
        sumSpan.textContent = sum;
        console.log(subtotalArr);
    }
}

const calcAll = () => {
    calcDiscount();
    calcTaxIncluded();
    calcSum();
}