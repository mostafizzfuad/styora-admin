import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ productId: string }> }
) => {
	try {
		await connectToDB();
		const { productId } = await params;
		const product = await Product.findById(productId).populate({
			path: "collections",
			model: Collection,
		});

		if (!product) {
			return new NextResponse(
				JSON.stringify({ message: "Product not found" }),
				{ status: 404 }
			);
		}
		return new NextResponse(JSON.stringify(product), {
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
				"Access-Control-Allow-Methods": "GET",
				"Access-Control-Allow-Headers": "Content-Type",
			},
		});
	} catch (err) {
		console.log("[productId_GET]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
};

export const POST = async (
	req: NextRequest,
	{ params }: { params: Promise<{ productId: string }> }
) => {
	try {
		const { userId } = await auth();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		await connectToDB();
		const { productId } = await params;
		const product = await Product.findById(productId);

		if (!product) {
			return new NextResponse(
				JSON.stringify({ message: "Product not found" }),
				{ status: 404 }
			);
		}

		const {
			title,
			description,
			media,
			category,
			collections,
			tags,
			sizes,
			colors,
			price,
			expense,
		} = await req.json();

		if (
			!title ||
			!description ||
			!media ||
			!category ||
			!price ||
			!expense
		) {
			return new NextResponse("Missing required fields", { status: 400 });
		}

		// add to collection -> included in new data, but not included in existing data
		const addedCollections = collections?.filter(
			(collectionId: string) =>
				!product.collections.includes(collectionId)
		);
		// remove from collection -> included in existing data, but not included in new data
		const removedCollections = product.collections.filter(
			(collectionId: string) => !collections?.includes(collectionId)
		);

		// update collections
		await Promise.all([
			// update added collections with this product
			...addedCollections.map((collectionId: string) =>
				Collection.findByIdAndUpdate(collectionId, {
					$push: { products: product._id },
				})
			),
			// update removed collections to remove this product
			...removedCollections.map((collectionId: string) =>
				Collection.findByIdAndUpdate(collectionId, {
					$pull: { products: product._id },
				})
			),
		]);

		// update product
		const updatedProduct = await Product.findByIdAndUpdate(
			product._id,
			{
				title,
				description,
				media,
				category,
				collections,
				tags,
				sizes,
				colors,
				price,
				expense,
			},
			{ new: true }
		).populate({ path: "collections", model: Collection });
		await updatedProduct.save();
		return NextResponse.json(updatedProduct, { status: 200 });
	} catch (err) {
		console.log("[productId_POST]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
};

export const DELETE = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ productId: string }> }
) => {
	try {
		const { userId } = await auth();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		await connectToDB();
		const { productId } = await params;
		const product = await Product.findById(productId);

		if (!product) {
			return new NextResponse(
				JSON.stringify({ message: "Product not found" }),
				{ status: 404 }
			);
		}

		await Product.findByIdAndDelete(productId);

		// update all collections to remove this product
		await Promise.all(
			product.collections.map((collectionId: string) =>
				Collection.findByIdAndUpdate(collectionId, {
					$pull: { products: product._id },
				})
			)
		);
		return new NextResponse("Product deleted successfully", {
			status: 200,
		});
	} catch (err) {
		console.log("[productId_DELETE]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
};

export const dynamic = "force-dynamic";
