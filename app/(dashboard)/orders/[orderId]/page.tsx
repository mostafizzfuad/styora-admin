import { DataTable } from "@/components/custom-ui/DataTable";
import { columns } from "@/components/orderItems/OrderItemsColumns";

const OrderDetails = async ({
	params,
}: {
	params: Promise<{ orderId: string }>;
}) => {
	const { orderId } = await params;
	const res = await fetch(`http://localhost:3000/api/orders/${orderId}`);
	const { orderDetails, customer } = await res.json();
	const {
		street = "",
		line2 = "",
		city = "",
		state = "",
		postalCode = "",
		country = "",
	} = orderDetails?.shippingAddress ?? {};

	return (
		<div className="flex flex-col p-10 gap-5">
			<p className="text-base-bold">
				Order ID:{" "}
				<span className="text-base-medium">{orderDetails._id}</span>
			</p>
			<p className="text-base-bold">
				Customer name:{" "}
				<span className="text-base-medium">{customer.name}</span>
			</p>
			<p className="text-base-bold">
				Shipping address:{" "}
				<span className="text-base-medium">
					{[street, line2, city, state, postalCode, country]
						.filter(Boolean)
						.join(", ")}
				</span>
			</p>
			<p className="text-base-bold">
				Total Paid:{" "}
				<span className="text-base-medium">
					${orderDetails.totalAmount}
				</span>
			</p>
			<p className="text-base-bold">
				Shipping rate ID:{" "}
				<span className="text-base-medium">
					{orderDetails.shippingRate}
				</span>
			</p>
			<DataTable
				columns={columns}
				data={orderDetails.products}
				searchKey="product"
			/>
		</div>
	);
};

export default OrderDetails;
