// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Stripe from "stripe";

//Default export function that handles API requests
export default async function handler(req, res) {
  //Check if the request method is POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "POST method required" });
  }

  //Parse the request body to get the line items
  const body = JSON.parse(req.body);

  //Check if the line items array is empty
  if (body.lineItems.length === 0) {
    return res
      .status(405)
      .json({ message: "Please select items for purchase" });
  }

  try {
    // Initialize the stripe client with the secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET ?? "", {
      apiVersion: "2020-08-27",
    });

    //Create a checkout session with the provided line items
    const session = await stripe.checkout.sessions.create({
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      line_items: body.lineItems,
      mode: "payment",
    });

    // Send the session object as the response with a 201 status code
    res.status(201).json({ session });
  } catch (err) {
    // Handle any errors by sending a 500 status code and the error message
    res.status(500).send({ message: err.message });
  }
}
