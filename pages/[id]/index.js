/*Displays detailed information about a specific product. 
The specific product to display is determined by which PurchaseCard the user selects.  */

import { useAppContext } from "@/context/CartContext";
import React from "react";

export async function getServerSideProps(context) {
  const { params } = context;
  return {
    props: { id: params.id },
  };
}

export default function Description(props) {
  const [size, setSize] = React.useState(null);
  const { id: path } = props;
  const { state: { prices } = [], dispatch } = useAppContext();
  const product = prices.filter((val) => val.id === path.replace("/", ""))[0];

  if (product === undefined) {
    return (
      <div className="pt-40 select-none grid place-items-center">
        LOADING...
      </div>
    );
  }

  // Array created by extracting the keys from the metadata object of the product
  const tempSizes = Object.keys(product.product.metadata);

  // Define the desired order of the sizes
  const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
  // A function that returns a function to set the selected size

  // Sort the sizes based on the predefined order
  const sortedSizes = tempSizes.sort(
    (a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
  );
  function setSz(size) {
    return () => setSize(size);
  }
  console.log(size);

  function addToBasket(prod) {
    if (!size) {
      return;
    }
    return () => {
      setSize(null);
      dispatch({ type: "add_product", value: [prod.id, size] });
    };
  }

  return (
    <div className="flex flex-wrap md:flex-nowrap justify-center mx-auto max-w-screen-lg p-4">
      <img
        src={product.product.images[0]}
        alt={product.product.id}
        style={{ maxHeight: "600px" }}
      />
      <div className="w-full md:w-1/2 md:pl-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl lg:text-3xl font-light tracking-wide capitalize py-3">
            {product.product.name}
          </h1>
        </div>
        <p className="text-xl lg:text-2xl pb-4">${product.unit_amount / 100}</p>
        <div className="text-justify pb-4 font-light">
          <p>{product.product.description}</p>
          <p className="text-sm pt-4 pb-2">SIZE</p>
          <div className="flex text-sm items-center font-light pb-4 flex-wrap gap-2">
            {sortedSizes.map((sz, index) => {
              return (
                <div
                  onClick={setSz(sz)}
                  className={
                    " uppercase border border-solid border-gray-200 w-10 select-none cursor-pointer transition duration-300 hover:opacity-50 py-1 grid place-items-center " +
                    (sz === size
                      ? "border-green-400 text-green-400 border-2"
                      : "")
                  }
                  key={index}
                >
                  {sz}
                </div>
              );
            })}
          </div>
        </div>
        <hr />
        <button
          onClick={addToBasket(product)}
          className="w-full my-4 p-4 border border-solid border-gray-100 shadow bg-slate-100 text-slate-700 font-light transition duration-300 hover:opacity-50"
        >
          Add To Basket
        </button>
      </div>
    </div>
  );
}
