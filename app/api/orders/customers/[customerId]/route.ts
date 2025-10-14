import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ customerId: string }> }
) => {
	try {
		await connectToDB();
		const { customerId } = await params;

		const orders = await Order.find({
			customerClerkId: customerId,
		}).populate({
			path: "products.product",
			model: Product,
		});

		return NextResponse.json(orders, { status: 200 });
	} catch (err) {
		console.log("[customerId_GET]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
};

export const dynamic = "force-dynamic";
