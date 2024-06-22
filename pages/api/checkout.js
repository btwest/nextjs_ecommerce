// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Stripe from "stripe";

const successUrl =
  process.env.NODE_ENV === "production"
    ? `${process.env.NEXT_PUBLIC_URL}/success`
    : "http://localhost:3000/success";

const cancelUrl =
  process.env.NODE_ENV === "production"
    ? `${process.env.NEXT_PUBLIC_URL}/cancel`
    : "http://localhost:3000/cancel";

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
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: body.lineItems,
      mode: "payment",
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      shipping_options: [
        {
          shipping_rate: "shr_1PUUe3KZbbKpGp3jbGQMrW1U",
        },
      ],
    });
    //console.log("Stripe session created:", session);

    // Send the session object as the response with a 201 status code
    res.status(201).json({ session });
  } catch (err) {
    // Handle any errors by sending a 500 status code and the error message
    console.error("Error creating Stripe session:", err);
    res.status(500).send({ message: err.message });
  }
}
