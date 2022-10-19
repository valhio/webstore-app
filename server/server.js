const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors({ origin: true, credentials: true }));

const stripe = require("stripe")(
  "sk_test_51LuaOkB6gdK47cnCWSZTWE4WsUhyUXCC3CJgtdU034FZteyDDWW1uswXJ6wZEzNhaazu70w8vT7T9OJtejSnO3Ff00ZEJbnYSr"
);

app.post("/checkout", async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["BG","RO","GR","RS","MK"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "bgn",
            },
            display_name: "Free shipping",
            //   # Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 2,
              },
              maximum: {
                unit: "business_day",
                value: 3,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 5*100,
              currency: "bgn",
            },
            display_name: "Next day Speedy/Econt Post",
            //   # Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: "bgn",
          product_data: {
            name: item.name,
            images: [item.product],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: "http://localhost:4242/success.html",
      cancel_url: "http://localhost:4242/cancel.html",
      // checkout: 'http://localhost:4242/checkout.html',
    });

    // res.status(200).json({session});
    res.status(200).json({ id: session.id });
  } catch (error) {
    next(error);
  }
});

app.listen(4242, () => {
  console.log("Server running on port 4242");
});
