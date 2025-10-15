import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDB } from "@/lib/mongoDB";
import Order from "@/lib/models/Order";
import Customer from "@/lib/models/Customer";
import { stripe } from "@/lib/stripe";

export const POST = async (req: NextRequest) => {
	try {
		const rowBody = await req.text();
		const signature = req.headers.get("Stripe-Signature") as string;

		const event = stripe.webhooks.constructEvent(
			rowBody,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!
		);

		if (event.type === "checkout.session.completed") {
			const session = event.data.object as any;

			// 1) First from session, 2) if not found, from PaymentIntent.latest_charge
			let addr =
				session?.shipping_details?.address ??
				session?.customer_details?.address;

			if (!addr && session?.payment_intent) {
				const pi =
					typeof session.payment_intent === "string"
						? await stripe.paymentIntents.retrieve(
								session.payment_intent
						  )
						: session.payment_intent;

				if (pi?.latest_charge) {
					const charge =
						typeof pi.latest_charge === "string"
							? await stripe.charges.retrieve(pi.latest_charge)
							: pi.latest_charge;

					addr =
						charge?.shipping?.address ??
						charge?.billing_details?.address ??
						addr;
				}
			}

			const customerInfo = {
				clerkId: session?.client_reference_id,
				name: session?.customer_details?.name,
				email: session?.customer_details?.email,
			};

			const retrieveSession = await stripe.checkout.sessions.retrieve(
				session.id,
				{
					expand: ["line_items.data.price.product"],
				}
			);
			const lineItems = retrieveSession?.line_items?.data;

			const orderItems = lineItems?.map((item: any) => ({
				product: item.price.product.metadata.productId,
				color: item.price.product.metadata.color || "N/A",
				size: item.price.product.metadata.size || "N/A",
				quantity: item.quantity,
			}));

			await connectToDB();

			const shippingAddress = {
				street: addr?.line1 || "",
				line2: addr?.line2 || "",
				city: addr?.city || "",
				state: addr?.state || "",
				postalCode: addr?.postal_code || "",
				country: addr?.country || "",
			};

			const newOrder = new Order({
				customerClerkId: customerInfo.clerkId,
				products: orderItems,
				shippingAddress,
				shippingRate: session?.shipping_cost?.shipping_rate,
				totalAmount: session.amount_total
					? session.amount_total / 100
					: 0,
			});

			await newOrder.save();

			let customer = await Customer.findOne({
				clerkId: customerInfo.clerkId,
			});
			if (customer) {
				customer.orders.push(newOrder._id);
			} else {
				customer = new Customer({
					...customerInfo,
					orders: [newOrder._id],
				});
			}
			await customer.save();
		}
		return new NextResponse("Order created", { status: 200 });
	} catch (err) {
		console.log("[webhooks_POST]", err);
		return new NextResponse("Failed to create the order", { status: 500 });
	}
};
