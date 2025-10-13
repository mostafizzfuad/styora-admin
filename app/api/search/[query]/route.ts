import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

// Utility function to escape special regex characters in user input
function escapeRegex(input: string) {
	return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ query: string }> }
) => {
	try {
		const { query } = await params;
		const q = decodeURIComponent((query || "").replace(/\+/g, " ")).trim();
		if (!q) return NextResponse.json([], { status: 200 });

		await connectToDB();

		const rx = new RegExp(escapeRegex(q), "i");

		const searchedProducts = await Product.find({
			$or: [
				{ title: { $regex: rx } },
				{ category: { $regex: rx } },
				{ tags: { $regex: rx } },
			],
		})
			.sort({ createdAt: -1 })
			.limit(30);
		return NextResponse.json(searchedProducts, { status: 200 });
	} catch (err) {
		console.log("[search_GET]", err);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
};
