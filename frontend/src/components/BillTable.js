import React from 'react';
import './BillTable.css';

const BillTable = ({ items }) => {
  const numPlaceholderRows = 4;
  const totalRows = Math.max(items.length, numPlaceholderRows);

  return (
    <div className="bill-table-wrapper">
      <table className="bill-table">
        <thead>
          <tr>
            <th><center>Name</center></th>
            <th><center>Quantity</center></th>
            <th><center>Amount</center></th>
            <th><center>Total </center></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: totalRows }).map((_, index) => {
            const item = items[index];
            return (
              <tr key={index}>
                <td>{item?.name || ''}</td>
                <td>{item?.quantity || ''}</td>
                <td>{item?.price || ''}</td>
                <td>{item ? item.price * item.quantity : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BillTable;
