"use client";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

interface ImageUploadSingleProps {
	value: string; // single url
	onChange: (url: string) => void; // set url
	onRemove: () => void; // clear url
}

const ImageUploadSingle: React.FC<ImageUploadSingleProps> = ({
	value,
	onChange,
	onRemove,
}) => {
	const handleSuccess = (result: any) => {
		const url = result?.info?.secure_url;
		if (url) onChange(url);
	};

	return (
		<div>
			{value && (
				<div className="inline-block relative m-2">
					<img
						src={value}
						alt="Collection"
						className="w-[200px] h-[200px] object-cover rounded-md"
					/>
					<Button
						size="sm"
						type="button"
						className="absolute top-2 right-2 bg-red-1 text-white"
						onClick={onRemove}
					>
						<Trash className="h-4 w-4" />
					</Button>
				</div>
			)}

			<CldUploadWidget
				uploadPreset="styora-admin"
				options={{
					multiple: false, // single only
					maxFiles: 1,
					resourceType: "image",
				}}
				onSuccess={handleSuccess}
			>
				{({ open }) => (
					<Button
						type="button"
						onClick={() => open?.()}
						className="bg-grey-1 text-white min-w-1/6"
					>
						<Plus /> {value ? "Change Image" : "Upload Image"}
					</Button>
				)}
			</CldUploadWidget>
		</div>
	);
};

export default ImageUploadSingle;
