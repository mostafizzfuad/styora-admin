type CollectionType = {
	_id: string;
	title: string;
	description: string;
	image: string;
	products: ProductType[];
};

type ProductType = {
	_id: string;
	title: string;
	description: string;
	media: [string];
	category: string;
	collections: [CollectionType];
	tags: [string];
	size: [string];
	color: [string];
	price: number;
	expense: number;
	createdAt: string;
	updatedAt: string;
};

type OrderColumnType = {
	_id: string;
	customer: string;
	products: number;
	totalAmount: number;
	createdAt: string;
};

type OrderItemType = {
	product: ProductType;
	color: string;
	size: string;
	quantity: number;
};

type CustomerType = {
	clerkId: string;
	name: string;
	email: string;
};
