import React, { useState } from "react";

import ProductList from "./ProductList";
import ProductDetails from "./ProductDetails";
import { withFadeIn } from "../../hoc/withFadeIn";

function Products() {
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleProdClick = () => {
    setSelectedProduct("");
  };

  const FadeProductList = withFadeIn(() => {
    return (
      <ProductList
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
    );
  });

  return (
    <React.Fragment>
      {selectedProduct === "" ? (
        <FadeProductList />
      ) : (
        <React.Fragment>
          <button onClick={handleProdClick}>PRODUCT LIST</button>
          <ProductDetails initialState={selectedProduct} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default Products;
