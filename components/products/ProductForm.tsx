"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "../custom-ui/ImageUpload";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom-ui/Delete";
import MultiText from "../custom-ui/MultiText";
import MultiSelect from "../custom-ui/MultiSelect";
import Loader from "../custom-ui/Loader";

const formSchema = z.object({
	title: z.string().min(3).max(30),
	description: z.string().min(10).max(500).trim(),
	media: z.array(z.string()),
	category: z.string(),
	collections: z.array(z.string()),
	tags: z.array(z.string()),
	sizes: z.array(z.string()),
	colors: z.array(z.string()),
	price: z.coerce.number().min(0.1, "Price must be at least 0.1"),
	expense: z.coerce.number().min(0.1, "Expense must be at least 0.1"),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
	initialData?: ProductType | null; // Make initialData optional
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [collections, setCollections] = useState<CollectionType[]>([]);

	const getCollections = async () => {
		try {
			const res = await fetch("/api/collections", {
				method: "GET",
			});
			const data = await res.json();
			setCollections(data);
			setLoading(false);
		} catch (err) {
			console.log("[collections_GET]", err);
			toast.error("Something went wrong! Please try again.");
		}
	};

	useEffect(() => {
		getCollections();
	}, []);

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(formSchema) as any,
		defaultValues: initialData
			? {
					...initialData,
					collections: initialData.collections.map(
						(collection: CollectionType) => collection._id
					),
			  }
			: {
					title: "",
					description: "",
					media: [],
					category: "",
					collections: [],
					tags: [],
					sizes: [],
					colors: [],
					price: 0.1,
					expense: 0.1,
			  },
	});

	const handleKeyPress = (
		e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		if (e.key === "Enter") {
			e.preventDefault();
		}
	};

	const onSubmit = async (values: ProductFormValues) => {
		try {
			const url = initialData
				? `/api/products/${initialData._id}`
				: "/api/products";
			const res = await fetch(url, {
				method: "POST",
				body: JSON.stringify(values),
			});
			if (res.ok) {
				setLoading(false);
				toast.success(
					`Product ${
						initialData ? "updated" : "created"
					} successfully`
				);
				window.location.href = "/products";
				router.push("/products");
			}
		} catch (err) {
			console.log("[products_POST]", err);
			toast.error("Something went wrong! Please try again.");
		}
	};

	return loading ? (
		<Loader />
	) : (
		<div className="p-10">
			{initialData ? (
				<div className="flex items-center justify-between">
					<p className="text-heading2-bold">Edit Product</p>
					<Delete id={initialData._id} item="product" />
				</div>
			) : (
				<p className="text-heading2-bold">Create Product</p>
			)}
			<Separator className="bg-grey-1 mt-4 mb-7" />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
				>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input
										placeholder="Title"
										{...field}
										onKeyDown={handleKeyPress}
									/>
								</FormControl>
								<FormMessage className="text-red-1" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Description"
										{...field}
										rows={5}
										onKeyDown={handleKeyPress}
									/>
								</FormControl>
								<FormMessage className="text-red-1" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="media"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Image</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value}
										onChange={(urls) =>
											field.onChange(urls)
										}
										onRemove={(url) =>
											field.onChange(
												field.value.filter(
													(i) => i !== url
												)
											)
										}
									/>
								</FormControl>
								<FormMessage className="text-red-1" />
							</FormItem>
						)}
					/>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Price ($)"
											{...field}
											onKeyDown={handleKeyPress}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="expense"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Expense</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Expense ($)"
											{...field}
											onKeyDown={handleKeyPress}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<FormControl>
										<Input
											placeholder="Category"
											{...field}
											onKeyDown={handleKeyPress}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tags</FormLabel>
									<FormControl>
										<MultiText
											value={field.value}
											placeholder="Tags"
											onChange={(tag) =>
												field.onChange([
													...field.value,
													tag,
												])
											}
											onRemove={(tagToRemove) =>
												field.onChange([
													...field.value.filter(
														(item) =>
															item !== tagToRemove
													),
												])
											}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>
						{collections.length > 0 && (
							<FormField
								control={form.control}
								name="collections"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Collections</FormLabel>
										<FormControl>
											<MultiSelect
												placeholder="Collections"
												value={field.value}
												collections={collections}
												onChange={(_id) =>
													field.onChange([
														...field.value,
														_id,
													])
												}
												onRemove={(idToRemove) =>
													field.onChange([
														...field.value.filter(
															(collectionId) =>
																collectionId !==
																idToRemove
														),
													])
												}
											/>
										</FormControl>
										<FormMessage className="text-red-1" />
									</FormItem>
								)}
							/>
						)}
						<FormField
							control={form.control}
							name="colors"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Colors</FormLabel>
									<FormControl>
										<MultiText
											placeholder="Colors"
											value={field.value}
											onChange={(color) =>
												field.onChange([
													...field.value,
													color,
												])
											}
											onRemove={(colorToRemove) =>
												field.onChange([
													...field.value.filter(
														(color) =>
															color !==
															colorToRemove
													),
												])
											}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="sizes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sizes</FormLabel>
									<FormControl>
										<MultiText
											placeholder="Sizes"
											value={field.value}
											onChange={(size) =>
												field.onChange([
													...(field.value || []),
													size,
												])
											}
											onRemove={(sizeToRemove) =>
												field.onChange([
													...field.value.filter(
														(size) =>
															size !==
															sizeToRemove
													),
												])
											}
										/>
									</FormControl>
									<FormMessage className="text-red-1" />
								</FormItem>
							)}
						/>
					</div>

					<div className="flex gap-3 justify-start">
						<Button type="submit" className="bg-blue-1 text-white">
							Submit
						</Button>
						<Button
							type="button"
							onClick={() => router.push("/products")}
							className="bg-blue-1 text-white"
						>
							Discard
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default ProductForm;
