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
