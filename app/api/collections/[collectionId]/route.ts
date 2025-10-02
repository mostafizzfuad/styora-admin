import Collection from "@/lib/models/Collection";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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
		return new NextResponse("Collection deleted successfully", {
			status: 200,
		});
	} catch (error) {
		console.log("[collectionId_DELETE]", error);
		return new NextResponse("Internal server error", { status: 500 });
	}
};
