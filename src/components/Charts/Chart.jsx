import { Line, Pie } from '@ant-design/charts';
import React from 'react'
import "./style.css"

const Chart = ({sortedTransactions }) => {
  const data = sortedTransactions.map((item)=>{
    return {date:item.date, amount:item.amount}
  })
    
  const spendingData=sortedTransactions.filter((transaction)=>{
    if(transaction.type =="expense"){
      return{tag:transaction.tag, amount:transaction.amount}
    }
  })

  let finalSpendings= spendingData.reduce((acc,obj)=>{
    let key=obj.tag;
    if(!acc[key]){
    acc[key]={tag:obj.tag,amount:obj.amount}
    }else{
      acc[key].amount +=obj.amount;
    }
    return acc;
  },{})

  let newSpendings=[
    {tag:'food',amount:0},
    {tag:'education',amount:0},
    {tag:'office',amount:0}
  ]

  spendingData.forEach((item)=>{
    if(item.tag =="food"){
      newSpendings[0].amount+=item.amount;
    } else if(item.tag =="education"){
      newSpendings[1].amount+=item.amount;
    }else if(item.tag =="office"){
      newSpendings[2].amount+=item.amount;
    }
  })
      const config = {
       data:data,
        width:300,
        height:400,
        xField: 'date',
        yField: 'amount',
      };

      const spendingConfig = {
       data:newSpendings,
        width:300,
        height:400,
       angleField:'amount',
       colorField:'tag',
      };

     
return(
  <div className='charts-wrapper'>
  <div className='chart-container'>
    <h2>Your Analysis</h2>
    <Line {...config} /> 
  </div>
  <div className='chart-container'>
    <h2>Your Spendings</h2>
    <Pie {...spendingConfig} /> 
  </div>
  </div>
  
)
}

export default Chart
