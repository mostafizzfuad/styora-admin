"use client";

import CollectionForm from "@/components/collections/CollectionForm";
import Loader from "@/components/custom-ui/Loader";
import React, { use, useState, useEffect } from "react";

const CollectionDetails = ({
	params,
}: {
	params: Promise<{ collectionId: string }>;
}) => {
	const { collectionId } = use(params);

	const [loading, setLoading] = useState(true);
	const [collectionDetails, setCollectionDetails] =
		useState<CollectionType | null>(null);

	const getCollectionDetails = async () => {
		try {
			const res = await fetch(`/api/collections/${collectionId}`, {
				method: "GET",
			});
			const data = await res.json();
			setCollectionDetails(data);
			setLoading(false);
		} catch (err) {
			console.error("[collectionId_GET]", err);
			setLoading(false);
		}
	};

	useEffect(() => {
		getCollectionDetails();
	}, [collectionId]);

	return loading ? (
		<Loader />
	) : (
		<CollectionForm initialData={collectionDetails} />
	);
};

export default CollectionDetails;
