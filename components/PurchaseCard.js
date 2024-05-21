import React from "react";

export default function PurchaseCard(props) {
  const { price } = props;
  console.log(price);
  return (
    <div className="w-60 h-80 shadow-md border border-solid border-gray-100 cursor-pointer transition hover:opacity-60 bg-white">
      {price.product.images && (
        <div className="h-60 object-contain">
          <img src={price.product.images[0]} alt={price.product.name} />
        </div>
      )}

      <h1 className="text-sm text-center py-2 font-light tracking-wide uppercase">
        {price.product.name}
      </h1>
      <p className=" text-center text-sm font-extralight">
        ${price.unit_amount / 100}
      </p>
    </div>
  );
}
