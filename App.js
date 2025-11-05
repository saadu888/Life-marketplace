function addItem() {
    let name = document.getElementById("itemName").value;
    let price = document.getElementById("itemPrice").value;

    if(name === "" || price === "") {
        alert("Ka cike duka filayen!");
        return;
    }

    let market = document.getElementById("market");

    let itemBox = document.createElement("div");
    itemBox.className = "item";
    itemBox.textContent = name + " - " + price + "₦";

    market.appendChild(itemBox);

    document.getElementById("itemName").value = "";
    document.getElementById("itemPrice").value = "";
}
