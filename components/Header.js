import React, { useState, useRef } from "react";
import Router from "next/router";
import { useAppContext } from "@/context/CartContext";

export default function Header() {
  const { state, dispatch } = useAppContext();
  const [displayCheckout, setDisplayCheckout] = useState(false);
  const modalRef = useRef();

  // Handles checkout process
  async function checkout() {
    const lineItems = Object.keys(state.products).flatMap((id) =>
      Object.keys(state.products[id]).map((size) => ({
        price: id,
        quantity: state.products[id][size],
        description: size, // Include size in the description or as metadata TEST
      }))
    );

    // Make a POST request to the API endpoint for creating a checkout session
    const res = await fetch("api/checkout", {
      method: "POST",
      body: JSON.stringify({ lineItems }), // Send the line items in the request body
    });

    // Parse the JSON response from the server
    const data = await res.json();
    console.log(data);

    // Redirect the user to the Stripe checkout page (or cancel)
    Router.push(data.session.url);
  }

  function increment(id, size, count) {
    return () =>
      dispatch({
        type: "vary_count",
        value: [id, size, count + 1],
      });
  }

  function decrement(id, size, count) {
    if (count - 1 > 0) {
      return () =>
        dispatch({
          type: "vary_count",
          value: [id, size, count - 1],
        });
    }
    return () =>
      dispatch({
        type: "remove_product",
        value: [id, size],
      });
  }

  return (
    <div className="shadow-lg py-8 sticky top-0 flex justify-center items-center bg-white">
      {displayCheckout && (
        <div
          ref={modalRef}
          className="absolute bg-white shadow border border-gray-200 border-solid z-50 top-0 h-screen w-screen sm:w-80 right-0 flex flex-col gap-2 px-2 bg-white"
        >
          <div className="overflow-auto flex-1">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl py-4">CART</h1>
              <div
                className="ml-auto w-fit p-2 cursor-pointer select-none transition duration-300 opacity-50"
                onClick={() => setDisplayCheckout(false)}
              >
                ╳
              </div>
            </div>
            <hr className="py-2" />
            {Object.keys(state.products).map((productId, index) => {
              const prod = state.products[productId];
              console.log(prod);
              const product = state.prices.find((val) => val.id === productId);
              return (
                <div key={index} className="flex flex-col gap-4">
                  {Object.keys(prod).map((size) => {
                    const number = prod[size];
                    return (
                      <div
                        key={size}
                        className="border-l border-solid border-gray-100 text-xs  p-2 flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <p className="truncate">{product.product.name}</p>
                          <p>${product.unit_amount / 100}</p>
                        </div>
                        <div className="font-extralight flex justify-between items-center">
                          <h1>SIZE: {size}</h1>
                          <div>
                            <h1>
                              QUANTITY:{" "}
                              <span className="pl-4 border border-solid py-1 pr-6 border-gray-400 ml-3 relative">
                                {number}
                                <div className="absolute top-0 right-0 h-full w-3 flex flex-col ">
                                  <div
                                    className="leading-none scale-75 cursor-pointer"
                                    onClick={increment(productId, size, number)}
                                  >
                                    <i className="fa-solid fa-chevron-up"></i>
                                  </div>
                                  <div
                                    className="leading-none scale-75 cursor-pointer"
                                    onClick={decrement(productId, size, number)}
                                  >
                                    <i className="fa-solid fa-chevron-down"></i>
                                  </div>
                                </div>
                              </span>
                            </h1>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <button
            onClick={checkout}
            className=" m-1 shadow bg-black text-white font-light text-sm py-2 transition duration-300 hover:opacity-50 select-none"
          >
            CHECKOUT
          </button>
        </div>
      )}
      <h1
        onClick={() => Router.push("/")}
        className="flex-1 text-center cursor-pointer select-none transition hover:opacity-50 duration-300"
      >
        MYSTERY THEORIES STORE
      </h1>
      <div onClick={() => setDisplayCheckout(!displayCheckout)}>
        <i className="fa-solid fa-bag-shopping px-2 py-2 text-xl sm:text-3xl mr-4 transition hover:opacity-60 duration-300 cursor-pointer"></i>
      </div>
    </div>
  );
}
