import { DataTable } from "@/components/custom-ui/DataTable";
import { columns } from "@/components/customers/CustomerColumns";
import { Separator } from "@/components/ui/separator";
import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/mongoDB";

const CustomersPage = async () => {
	await connectToDB();

	// fetch only needed fields as plain JS objects
	const docs = await Customer.find()
		.sort({ createdAt: -1 })
		.select("clerkId name email")
		.lean();

	// shape data for CustomerType
	const customers: CustomerType[] = docs.map((c) => ({
		clerkId: c.clerkId ?? "",
		name: c.name ?? "",
		email: c.email ?? "",
	}));

	return (
		<div className="px-10 py-5">
			<p className="text-heading2-bold">Customers</p>
			<Separator className="bg-grey-1 my-5" />
			<DataTable columns={columns} data={customers} searchKey="name" />
		</div>
	);
};

export const dynamic = "force-dynamic";
export default CustomersPage;
