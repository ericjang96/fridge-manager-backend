class Ingredient{
    constructor(name, boughtDate, expiryDate, amountUnit, amount){
        this.name = name;
        this.boughtDate = boughtDate;
        this.expiryDate = expiryDate;
        this.amountUnit = amountUnit;
        this.amount = amount;
    }
}

module.exports = Ingredient;