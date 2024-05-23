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
  const { id: path } = props;
  const { state: { prices } = [], dispatch } = useAppContext();
  return <div>HELLO!</div>;
}
