import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ productId: string }> }
) => {
	try {
		await connectToDB();
		const { productId } = await params;
		const product = await Product.findById(productId);

		if (!product) {
			return new NextResponse(
				JSON.stringify({ message: "Product not found" }),
				{ status: 404 }
			);
		}

		const relatedProducts = await Product.find({
			$or: [
				{ category: product.category },
				{ collections: { $in: product.collections } },
			],
			_id: { $ne: product._id }, // Exclude the current product
		});

		if (!relatedProducts) {
			return new NextResponse(
				JSON.stringify({ message: "No related products found" }),
				{ status: 404 }
			);
		}
		return NextResponse.json(relatedProducts, { status: 200 });
	} catch (err) {
		console.log("[related_GET]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
};

export const dynamic = "force-dynamic";
