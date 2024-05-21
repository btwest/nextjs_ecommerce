/*Displays detailed information about a specific product. 
The specific product to display is determined by which PurchaseCard the user selects.  */

import React from "react";

export async function getServerSideProps(context) {
  const { params } = context;
  return {
    props: { id: params.id },
  };
}

export default function Description(props) {
  return <div>HELLO!</div>;
}
