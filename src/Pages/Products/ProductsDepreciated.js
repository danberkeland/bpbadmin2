import React, { useContext, useRef, useState } from "react";

import { SettingsContext } from "../../Contexts/SettingsContext";

import {
  grabOldProd,
  checkExistsNewProd,
  updateNewProd,
  createNewProd,
} from "./ProductHelpers";

import { API, graphqlOperation } from "aws-amplify";

import * as Queries from "../../graphql/queries";
import * as CustomQueries from "../../customGraphQL/queries";

import { testProducts, getUserToken, getDDbUserInfo } from "../../restAPIs";

import { classNames } from 'primereact/utils';
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
// import "primereact/resources/themes/vela-blue/theme.css";
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";

// Page to perform CRUD on product data

// const API_bpbrpc = "https://tbobxwqoq1.execute-api.us-east-2.amazonaws.com/devtwo";

function Products() {
  const doughList = [
    {label: "Baguette", value:"bag"},
    {label: "Ciabatta", value:"cia"},
    {label: "Country", value:"ctr"},
    {label: "French", value:"fre"},
    {label: "Multi", value:"multi"},
    {label: "Pretzel Bun", value:"pretz"},
    {label: "Rye", value: "rye"},
    {label: "Other", value: "other"},
    {label: "N/A", value: null},
  ]

  let emptyProduct = {
    "Type": "",
    "prodName": "N/A",
    "prodNick": "N/A",
    "packGroup": "null",
    "packSize": 0,
    "doughNick": "",
    "freezerThaw": false,
    "packGroupOrder": 0,
    "readyTime": 0,
    "bakedWhere": [
        ""
    ],
    "wholePrice": 0,
    "retailPrice": 0,
    "isWhole": true,
    "weight": 0,
    "descrip": "",
    "picURL": "",
    "squareID": "",
    "forBake": "",
    "bakeExtra": 0,
    "batchSize": 0,
    "defaultInclude": true,
    "leadTime": 0,
    "qbID": "0",
    "createdAt": "",
    "updatedAt": "",
    "inventoryProductId": "null"
  }

  const { setIsLoading } = useContext(SettingsContext);

  const [productTableData, setProductTableData] = useState([{}]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // const [productFull, setProductFull] = useState({});
  const [product, setProduct] = useState(emptyProduct);
  const [productDialog, setProductDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toast = useRef(null);
  
  const remap = () => {
    setIsLoading(true);
    grabOldProd()
      .then((oldProd) => {
        console.log("oldProd",oldProd)
        for (let old of oldProd) {
          checkExistsNewProd(old.prodNick).then((exists) => {
            console.log("exists",exists)
            if (exists) {
              updateNewProd(old);
            } else {
              createNewProd(old);
            }
          });
        }
      })
      .then((e) => {
        setIsLoading(false);
        console.log("Product DB updated");
      });
  };

  const fetchProducts = async () => {
    // subset of product attributes for table display.
    // would be nice to limit query by bake location, dough type, product group...

    setIsLoading(true)
    const response = await API.graphql({
      query: CustomQueries.listProductsForTable,
      variables: {
        Type: "Product",
        limit: 1000,
        filter: {
          // readyTime: {le: 12} // tested -- works; define filters programmatically in the future?
        }
      }
    });
    setIsLoading(false)

    console.log("fetchProducts response:", response);
    setProductTableData(response.data.prodSortAZ.items);
    
  }

  const editProduct = async (product) => {
    setProduct({...product});

    console.log(`Fetching "${product.prodNick}":`)
    const response = await API.graphql({
      query: CustomQueries.getProductForEditing,
      variables: {
        prodNick: product.prodNick
      }
    });
    console.log(`Got full data for "${response.data.getProduct.prodNick}":`, response.data.getProduct)
    setProduct(response.data.getProduct);   

    setProductDialog(true);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = {...product};
    _product[`${name}`] = val;

    setProduct(_product);
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = {...product};
    _product[`${name}`] = val;

    setProduct(_product);
  }

  const onCategoryChange = (e, name) => {
    let _product = {...product};
    _product[`${name}`] = e.value;
    setProduct(_product);
  }

  const onCheckboxChange = (e, name) => {
    let _product = {...product};
    _product[`${name}`] = e.checked;
    setProduct(_product);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  }

  const saveProduct = () => {
    console.log("Saved Product.")
    setSubmitted(true);

    const reqsMet = product.prodNick.trim() && product.prodName.trim()

    if (reqsMet) {
        let _products = [...productTableData];
        let _product = {...product};
        const index = _products.findIndex(prd => prd.prodNick === _product.prodNick);

        if (index > -1) {
            
            //findIndexById(product.prodNick);

            _products[index] = _product;
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        }
        // else {
        //     _product.id = createId();
        //     _product.image = 'product-placeholder.svg';
        //     _products.push(_product);
        //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        // }

        setProductTableData(_products);
        setProductDialog(false);
        setProduct(emptyProduct);
        setSubmitted(false);
    }
  }

  const actionBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
            <Button 
              icon="pi pi-pencil" 
              className="p-button-rounded p-button-success p-mr-2"
              onClick={() => editProduct(rowData)}
            />
            {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} /> */}
        </React.Fragment>
    );
  }

  const productDialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Toast ref={toast} />

      <div className="card">
        <Button label="remap Products" onClick={remap} disabled/>
        <Button label="List Products" onClick={fetchProducts} />
        <Button label="Edit Selected Product" onClick={() => editProduct(selectedProduct)} disabled={!selectedProduct}/>
        <Button label="Test Products" onClick={testProducts} />
        <Button label="Log User" onClick={getUserToken} />
        <Button label="Log Full User" onClick={getDDbUserInfo} />

        <div>
          <DataTable 
            value={productTableData} 
            selectionMode="single" metaKeySelection={false} 
            selection={selectedProduct} onSelectionChange={e => setSelectedProduct(e.value)}
            responsiveLayout="scroll"
            size="small"
            showGridlines
            style={{ float: "left"}}
      
          >
            <Column header="Edit" body={actionBodyTemplate} exportable={false}></Column>
            <Column field="prodNick" header="Nickname (ID)" sortable />
            <Column field="prodName" header="Product Name" sortable />
            <Column field="bakedWhere" header="Bake Location" sortable filter="true" />
            <Column field="readyTime" header="Ready Time" sortable />
            <Column field="leadTime" header="Lead Time (Days)" sortable />
            <Column field="wholePrice" header="Wholesale Price" sortable />
            {/* <Column field="doughNick" header="Dough Nickname" sortable /> */}
          </DataTable>

          <pre style={{ minwidth: "250px" }}>
            Selected Product: {JSON.stringify(selectedProduct, null, 4)} <br />
            submitted: {submitted.toString()} <br />
            productDialog: {productDialog.toString()}
          </pre>
        </div>

      </div>

      <Dialog visible={productDialog} style={{ minwidth: '450px' }} header="Edit Product Details" footer={productDialogFooter} modal className="p-fluid" onHide={hideDialog}>
        <div style={{ float: "left" }}>

          <div className="field">
              <label htmlFor="Type">Type</label>
              <InputText id="Type" value={product.Type} onChange={(e) => onInputChange(e, 'Type')} disabled />
          </div>

          <div className="field">
              <label htmlFor="prodNick">prodNick (ID)</label>
              <InputText id="prodNick" value={product.prodNick} onChange={(e) => onInputChange(e, 'prodNick')} disabled />
          </div>

          <div className="field">
              <label htmlFor="prodName">prodName*</label>
              <InputText id="prodName" value={product.prodName} onChange={(e) => onInputChange(e, 'prodName')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.prodName })} />
              {submitted && !product.prodName && <small className="p-error">prodName is required.</small>}
          </div>

          <div className="field">
              <label htmlFor="forBake">forBake</label>
              <InputText id="forBake" value={product.forBake} onChange={(e) => onInputChange(e, 'forBake')}  />
          </div>

          <div className="field">
              <label htmlFor="squareID">squareID</label>
              <InputText id="squareID" value={product.squareID} onChange={(e) => onInputChange(e, 'squareID')}  />
          </div>

          <div className="field">
              <label htmlFor="qbID">qbID</label>
              <InputText id="qbID" value={product.qbID} onChange={(e) => onInputChange(e, 'qbID')}  />
          </div>

          <div className="field">
              <label htmlFor="descrip">descrip</label>
              <InputText id="descrip" value={product.descrip} onChange={(e) => onInputChange(e, 'descrip')} />
          </div>

          <div className="field">
              <label htmlFor="picURL">picURL</label>
              <InputText id="picURL" value={product.picURL} onChange={(e) => onInputChange(e, 'picURL')} />
          </div>

          <div className="field">
              <label htmlFor="packSize">packSize</label>
              <InputNumber id="packSize" value={product.packSize} onChange={(e) => onInputNumberChange(e, 'packSize')} />
          </div>

          <div className="field">
              <label htmlFor="packGroup">packGroup</label>
              <InputText id="packGroup" value={product.packGroup} onChange={(e) => onInputChange(e, 'packGroup')}  />
          </div>

          <div className="field">
              <label htmlFor="packGroupOrder">packGroupOrder</label>
              <InputNumber id="packGroupOrder" value={product.packGroupOrder} onChange={(e) => onInputNumberChange(e, 'packGroupOrder')} />
          </div>

          {/* TODO: Query doughs from DDb */}
          <div className="field">
              <label htmlFor="doughNick">doughNick</label>
              <Dropdown id="doughNick" value={product.doughNick} options={doughList} onChange={(e) => onCategoryChange(e, 'doughNick')} placeholder="Test values" />
          </div>

          <div className="field">
              <label htmlFor="readyTime">readyTime (Hour)</label>
              <InputNumber id="readyTime" value={product.readyTime} onChange={(e) => onInputNumberChange(e, 'readyTime')} />
          </div>

          <div className="field">
              <label htmlFor="leadTime">leadTime (Days)</label>
              <InputNumber id="leadTime" value={product.leadTime} onChange={(e) => onInputNumberChange(e, 'leadTime')} />
          </div>

          <div className="field">
              <Checkbox inputId="freezerThaw" value={product.freezerThaw} checked={product.freezerThaw} onChange={e => onCheckboxChange(e, 'freezerThaw')} />
              <label htmlFor="freezerThaw">freezerThaw</label>
          </div>

          <div className="field">
              <Checkbox inputId="isWhole" value={product.isWhole} checked={product.isWhole} onChange={e => onCheckboxChange(e, 'isWhole')} />
              <label htmlFor="isWhole">isWhole</label>
          </div>

          <div className="field">
              <Checkbox inputId="defaultInclude" value={product.defaultInclude} checked={product.defaultInclude} onChange={e => onCheckboxChange(e, 'defaultInclude')} />
              <label htmlFor="defaultInclude">defaultInclude</label>
          </div>

          <div className="field">
              <label htmlFor="wholePrice">wholePrice</label>
              <InputNumber id="wholePrice" value={product.wholePrice} onChange={(e) => onInputNumberChange(e, 'wholePrice')} mode="decimal" maxFractionDigits={2} />
          </div>

          <div className="field">
              <label htmlFor="retailPrice">retailPrice</label>
              <InputNumber id="retailPrice" value={product.retailPrice} onChange={(e) => onInputNumberChange(e, 'retailPrice')} mode="decimal" maxFractionDigits={2} />
          </div>

          {/* Todo: bakedWhere */}

        </div>

        <div style={{ float: "right" }}>
          <pre>
            {JSON.stringify(product, null, 4)}
          </pre>
        </div>

      </Dialog>

    </React.Fragment>
  );
}

export default Products;

        // let emptyProduct = {
        //   ***"Type": "",
        //   ***"prodName": "N/A",
        //   ***"prodNick": "N/A",
        //   ***"packGroup": "null",
        //   ***"packSize": 0,
        //   ***"doughNick": "",
        //   ***"freezerThaw": false,
        //   ***"packGroupOrder": 0,
        //   ***"readyTime": 0,
        //   "bakedWhere": [
        //       ""
        //   ],
        //   ***"wholePrice": 0,
        //   ***"retailPrice": 0,
        //   ***"isWhole": true,
        //   "weight": 0,
        //   ***"descrip": "",
        //   ***"picURL": "",
        //   ***"squareID": "",
        //   ***"forBake": "",
        //   "bakeExtra": 0,
        //   "batchSize": 0,
        //   ***"defaultInclude": true,
        //   ***"leadTime": 0,
        //   ***"qbID": "0",
        //   "createdAt": "",
        //   "updatedAt": "",
        //   "inventoryProductId": "null"
        // }

        // }