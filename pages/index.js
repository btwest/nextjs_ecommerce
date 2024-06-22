import PurchaseCard from "@/components/PurchaseCard";
import Head from "next/head";
import Router from "next/router";
import Stripe from "stripe";
import { useEffect } from "react";
import { useAppContext } from "@/context/CartContext";

//runs on server side before the page is rendered
export async function getServerSideProps(context) {
  //Initialize the stripe client
  const stripe = new Stripe(process.env.STRIPE_SECRET ?? "", {
    apiVersion: "2020-08-27",
  });

  //Retrieve a list of prices from Stripe, including the associated product data
  const res = await stripe.prices.list({
    limit: 10, //Limit to 10 prices
    expand: ["data.product"], //Includes product data in the response
  });

  //Filter the prices to include only the active ones
  const prices = res.data.filter((price) => price.active);

  //Return the prices as props to be used in the page component
  return {
    props: { prices }, // will be passed to the page component as props
  };
}

//Default export function representing the home page component
export default function Home({ prices }) {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    dispatch({
      type: "set_prices",
      value: prices,
    });
  }, [prices]);

  // Render the component
  return (
    <div>
      <Head></Head>
      {prices.map((price, index) => {
        return (
          // Renders an individual item
          <PurchaseCard price={price} key={index} />
        );
      })}
    </div>
  );
}
