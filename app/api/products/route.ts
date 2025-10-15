import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// POST /api/products
export const POST = async (req: NextRequest) => {
	try {
		const { userId } = await auth();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		await connectToDB();
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

		// server-side validation
		// trim and check for empty strings
		const t = String(title).trim();
		const d = String(description).trim();
		const c = String(category).trim();
		if (!t || !d || !c)
			return new NextResponse("Title/description/category is required", {
				status: 400,
			});

		if (!Array.isArray(media) || media.length === 0)
			return new NextResponse("At least one image is required", {
				status: 400,
			});

		if (typeof price !== "number" || price <= 0)
			return new NextResponse("Invalid price", { status: 400 });

		if (typeof expense !== "number" || expense <= 0)
			return new NextResponse("Invalid expense", { status: 400 });

		const newProduct = await Product.create({
			title: t,
			description: d,
			media,
			category: c,
			collections,
			tags,
			sizes,
			colors,
			price,
			expense,
		});

		if (Array.isArray(collections) && collections.length) {
			const validIds = collections
				.map((id: string) => id?.trim?.() ?? id)
				.filter((id: string) => mongoose.Types.ObjectId.isValid(id));

			if (validIds.length) {
				await Collection.updateMany(
					{ _id: { $in: validIds } },
					{ $addToSet: { products: newProduct._id } } // addToSet = duplicate-safe
				);
			}
		}

		return NextResponse.json(newProduct, { status: 201 });
	} catch (err) {
		console.log("[products_POST]", err);
		return new NextResponse("Internal Error", { status: 500 });
	}
};

// GET /api/products
export const GET = async (_req: NextRequest) => {
	try {
		await connectToDB();
		const products = await Product.find()
			.sort({ createdAt: -1 })
			.populate({ path: "collections", model: Collection });
		return NextResponse.json(products, { status: 200 });
	} catch (err) {
		console.log("[products_GET]", err);
		return new NextResponse("Internal Error", { status: 500 });
	}
};

export const dynamic = "force-dynamic";
