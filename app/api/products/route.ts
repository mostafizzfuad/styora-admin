import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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
			size,
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

		const newProduct = await Product.create({
			title,
			description,
			media,
			category,
			collections,
			tags,
			size,
			colors,
			price,
			expense,
		});
		await newProduct.save();
		return NextResponse.json(newProduct, { status: 200 });
	} catch (err) {
		console.log("[products_POST]", err);
		return new NextResponse("Internal Error", { status: 500 });
	}
};
