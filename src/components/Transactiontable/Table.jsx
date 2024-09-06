import React, { useState } from 'react';
import { Radio, Select, Table, Button } from 'antd';
import searchImg from '../../assets/search.svg';
import { parse, unparse } from 'papaparse';
import { toast } from 'react-toastify';
import "./style.css";
import {  auth, fireDB } from '../../firebase'; // Import Firebase config
import { doc, deleteDoc } from 'firebase/firestore'; // Import deleteDoc from Firestore
import { AiTwotoneDelete } from 'react-icons/ai';

const TableTransaction = ({ transactions, fetchTransactions }) => {
  const user = auth.currentUser;
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortKey, setSortKey] = useState('');
  const { Option } = Select;

  // Handler to delete a transaction by its ID
  const handleDelete = async (id) => {
 
    console.log("userId",id)
 
    try {
      // Delete the transaction from Firebase using the document ID
      await deleteDoc(doc(fireDB, `users/${user.uid}/transactions/${id}`));
    console.log(`Document with ID: ${id} deleted successfully.`);
      toast.success('Transaction deleted successfully!');

      // Refetch transactions to update the UI
      fetchTransactions();
    
    } catch (error) {
      toast.error('Failed to delete the transaction');
      console.error('Error deleting transaction:', error);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Tag', dataIndex: 'tag', key: 'tag' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" style={{backgroundColor:'none'}} onClick={(e) => {
          e.preventDefault();handleDelete(record.id);}}>
          <AiTwotoneDelete size={25} />
        </Button>
      ),
    },
  ];

  const exportCSV = () => {
    const csv = unparse({
      fields: ['name', 'type', 'tag', 'date', 'amount'],
      data: transactions,
    });
    const data = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const csvURL = window.URL.createObjectURL(data);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'transactions.csv');
    tempLink.click();
    document.body.removeChild(tempLink);
  };

  const importCsv = (event) => {
    event.preventDefault();

    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          console.log("Results>>>>", results);
        }
      });
      toast.success("All transactions added");
      fetchTransactions();
      event.target.files = null;
    } catch (error) {
      toast.error(error);
    }
  };

  let filterTransaction = transactions.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter)
  );
  const sortedTransactions = filterTransaction.sort((a, b) => {
    if (sortKey === 'date') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === 'amount') {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  return (
    <div className='table-transaction-container'>
      <div className='filters-container'>
        <div className="search-container">
          <img className="search-icon" src={searchImg} width="16" />
          <input className='search-input'
            placeholder="Search by Name"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          className="filter-select"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div>
        <div className="table-controls">
          <h2 className="table-title">My Transactions</h2>

          <Radio.Group
            className="sort-radio-group"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div className="csv-controls">
            <button className="btn export-btn"
              onClick={exportCSV}
            >
              Export to CSV
            </button>
            <label className="btn import-btn">
              Import from CSV
              <input
                id="file-csv"
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={importCsv}
              />
            </label>
          </div>
        </div>

        <Table dataSource={sortedTransactions} columns={columns}  scroll={{ x: 'max-content' }} className="transaction-table"  />
      </div>
    </div>
  );
};

export default TableTransaction;
