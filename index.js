#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
class BankAccount {
    bankBalance = 100;
    showBankBalance() {
        console.log(`\nYour account balance is ${chalk.yellow(this.bankBalance)} \n`);
    }
    credit(amount) {
        if (amount > 100) {
            this.bankBalance += amount;
            this.bankBalance -= 1;
            console.log(chalk.green("Transaction successful"));
            console.log(chalk.magenta("1 dollar was deducted as the transaction is over 100 dollars"));
            console.log(`\nYour account balance is now ${chalk.yellow(this.bankBalance)} \n`);
        }
        else {
            this.bankBalance += amount;
            console.log(chalk.green("Transaction successful"));
            console.log(`\nYour account balance is now ${chalk.yellow(this.bankBalance)} \n`);
        }
        return;
    }
    debit(amount) {
        if (this.bankBalance < amount) {
            console.log(chalk.red("Transaction failed"));
            console.log("\nInsufficient balance. please recharge your account \n");
        }
        else {
            this.bankBalance -= amount;
            console.log(chalk.green("Transaction successful"));
            console.log(`\nYour account balance is now ${chalk.yellow(this.bankBalance)} \n`);
        }
        return;
    }
}
class Customer extends BankAccount {
    constructor(firstName, lastName, gender, age, mobileNumber) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.mobileNumber = mobileNumber;
    }
    firstName;
    lastName;
    gender;
    age;
    mobileNumber;
    customerInfo = () => {
        return `    Your bank details are:
        firstName = ${this.firstName}
        lastName = ${this.lastName}
        gender = ${this.gender}
        age = ${this.age}
        mobileNumber = ${this.mobileNumber}`;
    };
}
const welcome = async () => {
    const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
    console.clear();
    const rainbowTitle = chalkAnimation.rainbow('Welcome to myBank \n');
    await sleep();
    rainbowTitle.stop();
    console.log(chalk.greenBright('Hi!!!'));
    console.log("I am a countdown timer. Enter the amount of time for which you want me to run\n");
};
const createAccount = async () => {
    const validation = (input) => {
        if (input === "Null") {
            return "Plese enter details (use backspace)";
        }
        else {
            return true;
        }
    };
    const validateAge = (input) => {
        if (Number.isNaN(Number(input)) || Number(input) === 0) {
            return "Please enter correct number (use backspace)";
        }
        else {
            return true;
        }
    };
    const detailsPrompts = await inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'Enter your first name:',
            default() {
                return "Null";
            },
            validate: validation
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'Enter your last name:',
            default() {
                return "Null";
            },
            validate: validation
        },
        {
            name: 'gender',
            type: 'list',
            message: 'Select your gender:',
            choices: ["male", "female"]
        },
        {
            name: 'age',
            type: 'input',
            message: 'Enter your age:',
            default() {
                return 0;
            },
            validate: validateAge
        },
        {
            name: 'mobileNumber',
            type: 'input',
            message: 'Enter your mobile number:',
            default() {
                return "Null";
            },
            validate: validation
        }
    ]);
    let { firstName, lastName, gender, age, mobileNumber } = detailsPrompts;
    const account = new Customer(firstName, lastName, gender, Number(age), mobileNumber);
    return account;
};
let transactionMethod;
let transactionAmount;
const transaction = async (account) => {
    account.showBankBalance();
    const methodInput = await inquirer.prompt({
        name: 'method',
        type: 'list',
        message: 'Select method of transaction:',
        choices: ["Credit", "Debit"]
    });
    transactionMethod = methodInput.method;
    const amountInput = await inquirer.prompt({
        name: 'amount',
        type: 'input',
        message: 'Enter amount:',
        default() {
            return 0;
        }
    });
    transactionAmount = Number(amountInput.amount);
    if (transactionMethod === "Credit") {
        account.credit(transactionAmount);
    }
    else if (transactionMethod === "Debit") {
        account.debit(transactionAmount);
    }
    await appExit();
};
const appExit = async () => {
    let logout = "";
    while (logout !== "yes" && logout !== "no") {
        const logoutPrompt = await inquirer.prompt({
            name: 'answer',
            type: 'input',
            message: 'Do you want to continue (enter yes) or exit the app (enter no)?',
            default() {
                return "yes";
            }
        });
        logout = logoutPrompt.answer;
    }
    if (logout === "yes") {
        await transaction(account);
    }
    else if (logout === "no") {
        console.log(`\n ${chalk.green("Thank you for using the app. Have a nice day")}`);
        process.exit(0);
    }
};
await welcome();
const account = await createAccount();
console.log(chalk.green("\nAccount created successfully\n"));
console.log(account.customerInfo());
await transaction(account);
