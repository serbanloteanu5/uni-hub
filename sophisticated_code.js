// Filename: sophisticated_code.js
// Description: A complex and elaborate JavaScript code

/**
 * Custom Class representing a Person
 */
class Person {
  constructor(name, age, profession) {
    this.name = name;
    this.age = age;
    this.profession = profession;
  }

  sayHello() {
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
  }
}

/**
 * Custom Class representing a Bank Account
 */
class BankAccount {
  constructor(accountNumber, balance) {
    this.accountNumber = accountNumber;
    this.balance = balance;
  }

  deposit(amount) {
    this.balance += amount;
    console.log(`Deposited ${amount} into Account ${this.accountNumber}, new balance: ${this.balance}`);
  }

  withdraw(amount) {
    if (amount <= this.balance) {
      this.balance -= amount;
      console.log(`Withdrawn ${amount} from Account ${this.accountNumber}, new balance: ${this.balance}`);
    } else {
      console.log(`Insufficient balance in Account ${this.accountNumber}`);
    }
  }
}

/**
 * Main function that executes the code
 */
function main() {
  const person1 = new Person("John Doe", 30, "Engineer");
  const person2 = new Person("Jane Smith", 35, "Designer");

  person1.sayHello(); // Output: Hello, my name is John Doe and I am 30 years old.
  person2.sayHello(); // Output: Hello, my name is Jane Smith and I am 35 years old.

  const account1 = new BankAccount("1234567890", 1000);
  account1.deposit(500); // Output: Deposited 500 into Account 1234567890, new balance: 1500
  account1.withdraw(200); // Output: Withdrawn 200 from Account 1234567890, new balance: 1300
  account1.withdraw(1500); // Output: Insufficient balance in Account 1234567890
}

main();  // Execute the main function