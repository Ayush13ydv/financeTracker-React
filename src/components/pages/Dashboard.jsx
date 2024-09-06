import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import Cards from '../Cards/Cards'

import AddIncome from '../Modals/AddIncome';
import AddExpense from '../Modals/AddExpense';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth ,fireDB} from '../../firebase';
import { toast } from 'react-toastify';
// import { useAuthState } from 'react-firebase-hooks/auth';

import TableTransaction from '../Transactiontable/Table';
import Chart from '../Charts/Chart';
import NoTransactions from '../NoTransactions';
// import { getAuth } from 'firebase/auth';


const Dashboard = () => {

  const user = auth.currentUser;
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const[income,setIncome] = useState(0);
  const[expense,setExpenses] = useState(0);
  const[totalBalance,setTotalBalance] = useState(0)
  const[loading,setLoading] = useState(false)
  const[transactions,setTransactions]=useState([])

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  
  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };


  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
  addTransaction(newTransaction)
  console.log("New transactionn",newTransaction)
  

  }
 
  const addTransaction = async (transaction) => {
  console.log("User",user)
    try {
      // Add document to Firestore
      const docRef = await addDoc(
        collection(fireDB, `users/${user.uid}/transactions/`),
        transaction
        
      );
      // Get the unique ID of the added transaction
    const transactionUID = docRef.id;
    console.log("Document written with ID:", transactionUID);

    // Optionally, return the ID for further processing or UI updates
      toast.success("Transaction added")
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr)
      calculateBalance();
      return transactionUID;
  
      // Update transactions state properly  
    } 
    
    catch (e) {
      console.error("Error adding document: ", e); // Enhanced error message
      toast.error("Couldnt add transaction")
    }
  };
  
  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(()=>{
   calculateBalance();
  },[transactions]);

  const calculateBalance=()=>{
    let incometotal =0;
    let expensesTotal=0;

    transactions.forEach((transaction)=>{
      if(transaction.type==="income"){
        incometotal += transaction.amount;
      }else{
        expensesTotal +=transaction.amount
      }
    })
    setIncome(incometotal);
    setExpenses(expensesTotal);
    setTotalBalance(incometotal - expensesTotal);
  }
  
  const fetchTransactions=async()=> {
  
    setLoading(true);
    if (user && user.uid) {
      const q = query(collection(fireDB, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push({id:doc.id,...doc.data()});
      });
      setTransactions(transactionsArray);
      console.log("Transactions Array",transactionsArray)
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  const sortedTransactions = transactions.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
  })

  const resetAll = ()=>{
 setIncome(0)
setExpenses(0)
setTotalBalance(0)
// setTransactions([])
  }

  // Calculate the initial balance, income, and expenses
 
  return (
    <div>
        <Header/>
      {
        loading ?
        (<p>Loading...</p>):(
        <>
    <Cards resetAll={resetAll} income={income} expense={expense} totalBalance={totalBalance} showIncomeModal={showIncomeModal}
     showExpenseModal={showExpenseModal}/>
    {transactions && transactions.length!=0 ? (<Chart sortedTransactions={sortedTransactions}/>):
    (
     <NoTransactions/>)} 

     <AddIncome isIncomeModalVisible={isIncomeModalVisible} title="Add Income" handleIncomeCancel={handleIncomeCancel}onFinish={onFinish}/>
     <AddExpense isExpenseModalVisible={isExpenseModalVisible} title="Add Expense" handleExpenseCancel={handleExpenseCancel} onFinish={onFinish}/>
<TableTransaction  transactions={transactions} fetchTransactions={fetchTransactions}/>
        </>
        )
      }
   </div>
  )
}

export default Dashboard