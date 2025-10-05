"use client";

import Loader from "@/components/custom-ui/Loader";
import ProductForm from "@/components/products/ProductForm";
import React, { use, useState, useEffect } from "react";

const ProductDetails = ({
	params,
}: {
	params: Promise<{ productId: string }>;
}) => {
	const { productId } = use(params);

	const [loading, setLoading] = useState(true);
	const [productDetails, setProductDetails] =
		useState<ProductType | null>(null);

	const getProductDetails = async () => {
		try {
			const res = await fetch(`/api/products/${productId}`, {
				method: "GET",
			});
			const data = await res.json();
			setProductDetails(data);
			setLoading(false);
		} catch (err) {
			console.error("[productId_GET]", err);
			setLoading(false);
		}
	};

	useEffect(() => {
		getProductDetails();
	}, [productId]);

	return loading ? (
		<Loader />
	) : (
		<ProductForm initialData={productDetails} />
	);
};

export default ProductDetails;
