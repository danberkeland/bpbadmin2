// A place to build components that display on the Products page only

import React, { useContext, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function ProductTable() {
  return (
    <DataTable
      value={productData}
      selectionMode="single"
      metaKeySelection={false}
      selection={selectedProduct}
      onSelectionChange={(e) => setSelectedProduct(e.value)}
      responsiveLayout="scroll"
    >
      <Column field="prodNick" header="Nickname (ID)" sortable />
      <Column field="prodName" header="Product Name" sortable />
      <Column
        field="bakedWhere"
        header="Bake Location"
        filter="true"
        sortable
      />
      <Column field="readyTime" header="Ready Time" sortable />
      <Column field="leadTime" header="Lead Time (Days)" sortable />
      <Column field="wholePrice" header="Wholesale Price" sortable />
      <Column field="doughNick" header="Dough Nickname" sortable />
    </DataTable>
  );
}
