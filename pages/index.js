import Head from "next/head";
import Router from "next/router";
import Stripe from "stripe";

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
    props: { prices },
  };
}

//Default export function representing the home page component
export default function Home({ prices }) {
  //Handles checkout process
  async function checkout() {
    const lineItems = [
      {
        price: prices[0].id, //Use the first price ID from the list
        quantity: 1, //Set the quantity to 1
      },
    ];

    //Make a POST request to the API endpoint for creating a checkout session
    const res = await fetch("api/checkout", {
      method: "POST",
      body: JSON.stringify({ lineItems }), //Send the line items in the request body
    });

    //Parse the JSON response from the server
    const data = await res.json();
    console.log(data);

    //Redirect the user to the Stripe checkout page (or cancel)
    Router.push(data.session.url);
  }
  console.log(prices);

  // Render the component
  return (
    <div>
      <Head></Head>
      {prices.map((price, index) => {
        return (
          <div key={index} className="cursor-pointer" onClick={checkout}>
            Buy {price.product.name}
          </div>
        );
      })}
    </div>
  );
}
