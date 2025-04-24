'use strict';

// REVERSE ARRAY 
// let arr2 =['a','b','c','d','e','f'];
// const reverse = function(){
// let a= 0;
// let b = arr2.length-1;
// while(a <= b){
//   let temp = arr2[a];
//   arr2[a] = arr2[b];
//   arr2[b] = temp;
//   a++;
//   b--;
//   }
// };
// console.log(arr2);
// reverse();
// console.log(arr2);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////////////////
// Function

const displayMovements = function(movements, sort = false){
  containerMovements.innerHTML = '';

  const movs =sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function(mov , i){
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
      <div class="movements__row">
        <div class="movements__type         movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin',html)

  })
}

const calcDisplayBalance = function(acc){
   acc.balance = acc.movements.reduce((acc, mov) => acc + mov , 0);
  labelBalance.textContent = `${acc.balance}€`;
};


/////////////////////////////////////////////////////////////
// map ma new array create thai che ee ano advantage che

// const createUserName2 = function(user){
//   const userName = user
//   .toLowerCase()
//   .split(' ')
//   .map(name => name[0])
//   .join('');
//   return userName;
// }
// console.log(createUserName2(account1.owner));
////////////////////////////////////////////////////////////////
// foreach ma sideeffect hoi che 

const calcDIsplaySummary = function(acc){
  const income = acc.movements.filter(mov => mov>0)
  .reduce((acc,cur,i,arr) => acc+cur,0)
  labelSumIn.textContent = `${income}€`;

  const outgoing = acc.movements.filter(mov => mov<0)
  .reduce((acc,cur) => acc + cur,0);
  labelSumOut.textContent = `${Math.abs(outgoing)}€`;

  const interest = acc.movements.filter(mov => mov>0)
  .map(map => map * acc.interestRate /100)
  .filter((mov,i)=> mov>=1)
  .reduce((acc,cur,i,arr)=> acc+cur );
  labelSumInterest.textContent = `${interest}€`
}


const createUserName = function(accs){
  accs.forEach(function(acc){
  acc.userName = acc.owner
  .toLowerCase()
  .split(' ')
  .map(name => name[0])
  .join('');
  });
};

createUserName(accounts);

const upadteUI = function(acc){
      // Display movement
      displayMovements(acc.movements);

      // Display balance
      calcDisplayBalance(acc);

      // Display summary
      calcDIsplaySummary(acc);
};

// Event Handler
let currentAccount;


btnLogin.addEventListener('click',function(e){
  // prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value) 

  //if(currentAccount && currentAccount.pin is == currentAccoutnt?.pin)
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    // Display UI and message
    
    labelWelcome.textContent= `Welcome back, ${currentAccount.owner.split(' ')[0]}`;

    containerApp.style.opacity = 100;

    // Clear Input Data
    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // Update UI
    upadteUI(currentAccount);
  }
});

  btnTransfer.addEventListener('click',function(e){
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const reciverAcc = accounts.find(
      acc => acc.userName === inputTransferTo.value);

      inputTransferAmount.value = inputTransferTo.value = ''

      if( 
        amount > 0 &&
        reciverAcc &&
        currentAccount.balance >= amount &&
        reciverAcc?.userName !== currentAccount.userName)
        {
      currentAccount.movements.push(-amount)
      reciverAcc.movements.push(amount);

      // Update UI
      upadteUI(currentAccount);

      // inputTransferAmount.blur();
      // inputTransferTo.blur();

    };
    console.log(currentAccount , reciverAcc);
  });


  btnLoan.addEventListener('click', function(e){
    e.preventDefault();

    const amount = Number(inputLoanAmount.value);

    if(amount > 0 &&
       currentAccount.movements.some(mov => mov > amount * 0.1)
    ){
      // Add MOvement
      currentAccount.movements.push(amount);

      //Update UI
      upadteUI(currentAccount);
    }
    inputLoanAmount.value = '';
  })


  btnClose.addEventListener('click',function(e){
    e.preventDefault();
    // console.log('Delete');

    if(currentAccount.userName === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)){

      const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);     

      // Delete Account
      accounts.splice(index , 1); 

      // HIde UI
      containerApp.style.opacity = 0;
    }
      inputCloseUsername.value = inputClosePin.value = ''; 
  })

  let sorted = false
  btnSort.addEventListener('click', function(e){
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
  })
  
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES ------------------------------------------------------

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let arr =['a','b','c','d','e','f'];

// SLICE -------------------------------------------
// console.log(arr);

// console.log(arr.slice(2));
// console.log(arr.slice(2,4)); // 4 count nai thai
// console.log(arr.slice(-2));// - mines last thi chalu kar che
// console.log(arr.slice(1,-2));
// console.log(arr);


// SPLICE  delete element --------------------------
// console.log(arr.splice(3));
// console.log(Uint16Array);
// arr.splice(-1); // delete last element
// arr.splice(-1)
// console.log(arr);

// REVERSE -----------------------------------------
// arr =['a','b','c','d','e','f'];
// let arr2 = ['l','k','j','i','h','g']
// console.log(arr);
// arr2.reverse(); // reverse array
// console.log(arr2); // old array is gone

// CONCATE -----------------------------------------
// console.log(arr.concat(arr2));
// console.log(arr);
// console.log(arr2);

// JOIN --------------------------------------------
// console.log(arr.concat(arr2).join(' - '));


// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// FOR OF LOOP -------------------------------------

// for(const [i,movement] of movements.entries()){
//   if(movement > 0){
//     console.log(`Movement ${i+1}: You deposite ${movement}`);
//   }
//   else{
//     console.log(`Movement ${i+1} You Withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log('----------FOR-EACH-----------');

// movements.forEach(function(movement, index, array){ // order fix re che
//   if(movement > 0){
//     console.log(`Movement ${index+1}: You deposite ${movement}`);
//   }
//   else{
//     console.log(`Movement ${index+1}: You Withdrew ${Math.abs(movement)}`);
//   }
// })

// FOR EACH IN MAP --------------------------------
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function(value,key,map){
//   console.log(`${key}: ${value}`);
// });

// // FOR EACH IN SET --------------------------------

// const currenciesUnique = new Set(['USD','INR','USD','GBP','EUR']);
// console.log(currenciesUnique);

// currenciesUnique.forEach(function(value,_,map){
//   console.log(`${value}: ${value}`);
// })
// ----------------------------------------------------
// challenge 1

// const checkDog = function(Julia,Kate){
//  const juliaCopy = Julia.slice(1,-2);
//  const age = (juliaCopy.concat(Kate));
//  age.forEach(function(ages,i){
//    const type = ages >= 3 ? `an adult, and is ${ages} years old` : 'still a puppy 🐶'
//    console.log(`Dog number ${i +1} is ${type}`);
//  })
// }

// checkDog([3, 5, 2, 12, 7],[4, 1, 15, 8, 3]);
// console.log('--------------------------------');
// checkDog([9, 16, 6, 8, 3],[10, 5, 6, 1, 4]);

// ----------------------------------------------------

// CHALLENGE 2 :-
// const ages = [5, 2, 4, 1, 15, 8, 3];

// const calcAverageHumanAge = function(ages){
//   const humanAge = ages.map(age =>
//   age<=2 ? 2* age : 16+age*4)

// const lessThan18 = humanAge.filter(age =>age>18)

// const average = lessThan18.reduce((acc,cur) => acc+cur) / lessThan18.length;

// return average;
// }

// const avg = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// console.log(avg,avg2);

// [5, 2, 4, 1, 15, 8, 3]  [16, 6, 10, 5, 6, 1, 4]

// ----------------------------------------------------

// CHALLENGE 3 :-



  // const calcAverageHumanAge2 = ages =>
  //    ages
  //   .map(age => age <= 2 ? 2* age : 16  + age *4)
  //   .filter(age => age > 18)
  //   .reduce((acc,cur,i,arr) => acc + cur / arr.length,0);

  // const avg3 = calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]);
  // const avg4 = calcAverageHumanAge2([16, 6, 10, 5, 6, 1, 4]);
  // console.log(avg3,avg4);
// ----------------------------------------------------

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
////////////////////////////////////////////////////
// MAP
////////////////////////////////////////////////////

// const eurToUsd = 1.1;

// const movementsUSD = movements.map(function(mov){
//  return mov * eurToUsd;
// })

// const movementsUSD = movements.map( (mov) => mov * eurToUsd);

//  console.log(movements);
//  console.log(movementsUSD);

//  const movementsUSDfor = [];
//  for(const mov of movements) movementsUSDfor.push(mov*eurToUsd);
//  console.log(movementsUSDfor);

//  const movementDescription = movements.map((mov,i,arr) =>
//   ` Movement ${i+1}: You ${ mov > 0 ? 'Deposit' : 'Withdraw'} ${Math.abs(mov)}` 
// )

// console.log(movementDescription);

////////////////////////////////////////////////////
// FILTER METHOD:-
////////////////////////////////////////////////////

// console.log(movements);
// const deposit = movements.filter(mov => mov > 0)
// console.log(deposit);
// const withdraw = movements.filter(mov => mov<0 )
// console.log(withdraw);

////////////////////////////////////////////////////
// REDUCE METHHOD:- 
////////////////////////////////////////////////////

// acc = accumelater => snowBall
// console.log(movements);

// const balance = movements.reduce(function(acc,cur,i,arr) {
//   // console.log(`AT Iteration ${i}, ACC is ${acc}`);
//   return acc + cur;
// },0)

// const balance = movements.reduce((acc,cur,i,arr) => acc + cur)
// console.log(balance);

// const largestNo = movements.reduce((acc,cur) => acc>cur? acc : cur
// ,movements[0]);
// console.log(largestNo);

////////////////////////////////////////////////////
// Chaining Mehod 
////////////////////////////////////////////////////

// const eurToUsd = 1.1;
// const totalDepositInUSD = movements.filter(mov => mov>0).map(mov => mov * eurToUsd).reduce((acc,cur) => acc + cur,0);
// console.log(totalDepositInUSD);

// /////////////////////////////////////////////////
// FIND METHOD 
////////////////////////////////////////////////////

// const firstWithdrawal = movements.find(mov => mov<0);

// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);


// let foundAccount;
// for (const acc of accounts) {
//  if (acc.owner === 'Jessica Davis'){
//     foundAccount = acc;
//  }
// }
// console.log(foundAccount);

// /////////////////////////////////////////////////
// SOME Method
////////////////////////////////////////////////////


// console.log(movements);

// EQULITY
// console.log(movements.includes(-130));

// SOME
// const anyDeposit = movements.some(mov => mov > 0);
// console.log(anyDeposit);

// EVERY
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// SEPRATE CALLBACK
// const deposit = mov => mov < 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

////////////////////////////////////////////////////
// Flat 
////////////////////////////////////////////////////

// const ar2r = [[1,2],5,[7,6],3,1,];
// console.log(ar2r.flat());

// const ar3r = [[1,2],5,[[9,7],6],3,1,];
// console.log(ar3r.flat(2));

// const overallBal = accounts
//   .map(map => map.movements)
//   .flat().
//   reduce((acc , mov) => acc + mov ,0)
// console.log(overallBal);

//Flat Map
// const overallBal2 = accounts
//   .flatMap(map => map.movements)
//   .reduce((acc , mov) => acc + mov ,0)
// console.log(overallBal2);

////////////////////////////////////////////////////
// String Sort Method
////////////////////////////////////////////////////

// const owner = ['Adam','Zack','Jons','Mike'];
// console.log(owner.sort());
// console.log(owner);

// Array Sort Method
// console.log(movements);
 
// return < 0, A, B (Keep Order)
// return > 0, B, A (Switch Order)
// return 1 (etla Switch order)
// Accending
// movements.sort((a, b) =>{
//   if(a > b){
//     return 1
//     }
//   if(b > a){
//     return -1
//   }
//   })
//   console.log(movements);

movements.sort((a, b) => a - b); // 10 - 5 = positive etla return 1 and 5 -10 = negative return -1
// console.log(movements);


// Decending

// movements.sort((a, b) =>{
//   if(a > b){
//     return -1
//     }
//   if(b > a){
//     return 1
//   }
//   })

  movements.sort((a, b) => b - a); // 5 - 10 = negative etla return -1 and 10 - 5 = positive return 1
  // console.log(movements);


 
////////////////////////////////////////////////////

// var dominantIndex = function(nums) {
//   let largest = 0;
//   let SecLargest = 0;
//   let largestIdx = 0;
//   for (let i = 0 ; i < nums.length; i++ ){
//       if(nums[i] > largest){
//           SecLargest = largest;
//           largest = nums[i];
//           largestIdx = i;
//       } 
//       else if (nums[i] > SecLargest){
//         SecLargest = nums[i];
//       }     
//   }
//   if(SecLargest * 2 <= largest){
//     return largestIdx;
//   } 
//   else return -1;
// }; 

// console.log(dominantIndex([3,6,1,0]));

////////////////////////////////////////////////////

// const arr5 = [1,2,3,4,5,6,7];

// EMpty array + fill method 

// const x = new Array(7);
// console.log(x);

// x.fill(1);
// console.log(x);
// x.fill(5, 2, 5);
// console.log(x);
// arr5.fill(23, 3, 5)
// console.log(arr5);
////////////////////////////////////////////////////

// console.log('A'+ 2 - '3');//Nan
// console.log('A'+ 2 );//A2
// console.log('NaN'+ 'NaN');
// console.log(false + 5);
// arr5.splice(2,4);
// console.log(arr5);
// arr5.shift();
// arr5.unshift(60);
// console.log(arr5);
// arr5.shift();
// console.log(arr5);
// const arr5 = [1,2,3,4,5,6,7];

// const maparr = arr5.map((cur, i) => cur > 3);
// console.log(maparr);

// let nums = [1,3,2];  // Example array

// let isIncreasing = true;  // Flag for checking if the array is non-decreasing
// let isDecreasing = true;  // Flag for checking if the array is non-increasing

// for (let i = 0; i < nums.length - 1; i++) {
//     if (nums[i] > nums[i + 1]) {
//         isIncreasing = false;  // If the current number is greater than the next, it's not increasing
//     }
//     if (nums[i] < nums[i + 1]) {
//         isDecreasing = false;  // If the current number is less than the next, it's not decreasing
//     }
// }

// // The array is monotonic if it's either non-decreasing or non-increasing
// let isMonotonic = isIncreasing || isDecreasing;
// console.log(isMonotonic);  // Output: true


////////////////////////////////////////////////////
// Array From Method
////////////////////////////////////////////////////

// const arr6 = Array.from({length : 7}, (cur ,i) => i + 1);
// const arr6 = Array.from({length : 7}, ( _ ,i) => i + 1);
// console.log(arr6);

// const arr100 = Array.from({length: 100}, (cur ,i) => Math.round(Math.random(6)*6))
// console.log(arr100);


////////////////////////////////////////////////////
// CHALLENGE 4

// TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

//1
dogs.forEach(dog => dog.recFood = Math.trunc(dog.weight * 0.75 * 28))

//2
const SarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(SarahDog);
const SarahDogEating = SarahDog.curFood > (SarahDog.recFood * 0.90) ? 'its eating too much' : 'its eating too little'
// console.log(SarahDogEating);

//3
// console.log(dogs);
const eatTooMuch =[];
const eatToolow =[];

dogs.forEach((cur,i) => {
  cur.curFood > cur.recFood ? eatTooMuch.push(cur.owners) : eatToolow.push(cur.owners);
});
// console.log(eatTooMuch);
// console.log(eatToolow);

let eatTooMuch2 = eatTooMuch.flat();
let eatToolow2 = eatToolow.flat();
// console.log(eatTooMuch2);
// console.log(eatToolow2);

//4
let eatTooMuch3 ='';
let eatToolow3 = ''; 

for(let i = 0;i<eatTooMuch2.length; i++){
  eatTooMuch3 += `${eatTooMuch2[i]} and `;
  eatToolow3 += `${eatToolow2[i]} and `;
}

// console.log(`${eatTooMuch3.trim().slice(0,-4)}'s dogs eat too much!`);
// console.log(`${eatToolow3.trim().slice(0,-4)}'s dogs eat too little!`);

//5
// console.log(dogs.some(dog => dog.curFood === dog.recFood));

//6

// console.log(dogs.some(dog => dog.curFood > (dog.recFood * 0.90) && dog.curFood < (dog.recFood  * 1.10)));

const checkEatingOkay = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

// console.log(dogs.some(checkEatingOkay));

//7
// console.log(dogs.filter(checkEatingOkay));

const copyOfDogsAceRecFood = dogs.toSorted((a,b) => a.recFood-b.recFood);
console.log(copyOfDogsAceRecFood);




