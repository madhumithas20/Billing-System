// src/components/PrintButton.js
import React from 'react';

function PrintButton() {
  return (
    <button onClick={() => window.print()}>
      Print
    </button>
  );
}

export default PrintButton;
