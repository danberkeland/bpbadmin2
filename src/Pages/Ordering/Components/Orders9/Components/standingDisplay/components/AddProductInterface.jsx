import React, { useState } from "react"

import { Button } from "primereact/button"
import { Dropdown } from "primereact/dropdown"

import { useProductList } from "../../../../../Data/productData"
import { InputText } from "primereact/inputtext"

export const AddProductInterface = ({ standingChanges, setStandingChanges, isWhole, isStand, viewMode, setSelectedProduct, filterBy }) => {
  const { data: productList } = useProductList(true)
  const [productToAdd, setProductToAdd] = useState(null)

  // "Adding a product" doesn't immediately create a record to commit to the DB. Rather, we put 
  // a special 'placeholder' object into standingChanges which generates 0 qties for each weekday 
  // when we build out the 'view'.  
  const handleAddProduct = () => {
    let dataKey = [productToAdd.prodNick, 'placeholder', (isWhole ? '1' : '0'), (isStand ? '1' : '0')].join('_')
    let placeholderItem = {
      dayOfWeek: 'placeholder',
      product: {
        prodNick: productToAdd.prodNick,
        prodName: productToAdd.prodName
      },
      isStand: isStand,
      isWhole: isWhole,
    }

    setStandingChanges({ ...standingChanges, [dataKey]: placeholderItem })
    if (viewMode === 'PRODUCT') setProductToAdd(null)
  }

  return (
    <div style={{margin: "10px"}}>
      <Dropdown 
        id="product-list-dropdown"
        options={productList}
        optionLabel="prodName"
        optionValue="prodNick"
        value={productToAdd?.prodNick}
        filter
        filterBy={filterBy}
        showFilterClear
        resetFilterOnHide
        onChange={e => setProductToAdd(productList.find(item => item.prodNick === e.value))}
        style={{width: "100%", marginBottom: "10px"}}
      />

      <Button label="Add Product" 
        onClick={e => {
          handleAddProduct()
          setSelectedProduct({prodNick: productToAdd.prodNick, prodName: productToAdd.prodName})
        }}
        disabled={!productToAdd}
      />
    </div>
  )
}