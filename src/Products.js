
import React from 'react';
import './App.css';
import SubComp1 from './subComp1';

function Products() {
  return (
    <React.Fragment>
      <SubComp1 />
      <div className="App">
     New Comp 1
     made a couple changes
     made a few more changes
     New Comp 1
    </div>
    </React.Fragment>
    
  );
}

export default Products;
