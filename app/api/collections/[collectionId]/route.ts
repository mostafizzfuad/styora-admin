import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
	_req: NextRequest,
	{ params }: { params: { collectionId: string } }
) => {
	try {
		await connectToDB();
		const { collectionId } = await params;
		const collection = await Collection.findById(collectionId).populate({
			path: "products",
			model: Product,
		});

		if (!collection) {
			return new NextResponse(
				JSON.stringify({ message: "Collection not found" }),
				{ status: 404 }
			);
		}
		return NextResponse.json(collection, { status: 200 });
	} catch (err) {
		console.log("[collectionId_GET]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
};

export const POST = async (
	req: NextRequest,
	{ params }: { params: { collectionId: string } }
) => {
	try {
		const { userId } = await auth();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		await connectToDB();

		const { collectionId } = params;
		let collection = await Collection.findById(collectionId);
		if (!collection) {
			return new NextResponse("Collection not found", { status: 404 });
		}

		const { title, description, image } = await req.json();
		if (!title || !image) {
			return new NextResponse("Title and Image are required", {
				status: 400,
			});
		}

		collection = await Collection.findByIdAndUpdate(
			collectionId,
			{ title, description, image },
			{ new: true }
		);
		await collection.save();

		return NextResponse.json(collection, { status: 200 });
	} catch (err) {
		console.log("[collectionId_POST]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
};

export const DELETE = async (
	req: NextRequest,
	{ params }: { params: { collectionId: string } }
) => {
	try {
		const { userId } = await auth();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		await connectToDB();

		const { collectionId } = params;
		await Collection.findByIdAndDelete(collectionId);

		await Product.updateMany(
			{ collections: collectionId },
			{ $pull: { collections: collectionId } }
		);

		return new NextResponse("Collection deleted successfully", {
			status: 200,
		});
	} catch (err) {
		console.log("[collectionId_DELETE]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
};

export const dynamic = "force-dynamic"; // avoid caching of the API response