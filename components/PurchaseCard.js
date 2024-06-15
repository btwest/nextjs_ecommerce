import React from "react";
import Router from "next/router";

export default function PurchaseCard(props) {
  const { price } = props;
  console.log(price);
  return (
    <div
      // Navigates to "/price.id" when clicked
      onClick={() => Router.push(`${price.id}`)}
      className="w-60 h-80 cursor-pointer transition-all duration-300 hover:overflow-hidden group"
    >
      {price.product.images && (
        <div className="h-60 overflow-hidden">
          <img
            src={price.product.images[0]}
            alt={price.product.name}
            className="object-contain transform transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      )}

      <h1 className="text-sm text-left py-2 font-light tracking-wide uppercase">
        {price.product.name}
      </h1>
      <p className="text-left text-sm font-extralight">
        ${price.unit_amount / 100}
      </p>
    </div>
  );
}
