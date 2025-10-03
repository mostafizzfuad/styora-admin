import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Collection from "@/lib/models/Collection";

// POST /api/collections
export const POST = async (req: NextRequest) => {
	try {
		const { userId } = await auth();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 403 });
		}

		await connectToDB();

		const { title, description, image } = await req.json();

		const existingCollection = await Collection.findOne({ title });
		if (existingCollection) {
			return new NextResponse("Collection already exists", {
				status: 400,
			});
		}

		if (!title || !image) {
			return new NextResponse("Title and Image are required", {
				status: 400,
			});
		}

		const newCollection = await Collection.create({
			title,
			description,
			image,
		});

		await newCollection.save();
		return NextResponse.json(newCollection, { status: 200 });
	} catch (err) {
		console.log("[collections_POST]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
};

// GET /api/collections
export const GET = async (req: NextRequest) => {
	try {
		await connectToDB();

		const collections = await Collection.find().sort({ createdAt: -1 }); // -1 = descending order
		return NextResponse.json(collections, { status: 200 });
	} catch (err) {
		console.log("[collections_GET]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
};
