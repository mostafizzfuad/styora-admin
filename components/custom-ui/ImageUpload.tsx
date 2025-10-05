import { CldUploadWidget } from "next-cloudinary";
import { Button } from "../ui/button";
import { Plus, Trash } from "lucide-react";

interface ImageUploadProps {
	value: string[];
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	onChange,
	onRemove,
	value,
}) => {
	const handleSuccess = (result: any) => {
		onChange(result.info.secure_url);
	};

	return (
		<div>
			<div>
				{value.map((url) => (
					<div key={url} className="inline-block relative m-2">
						{" "}
						<img
							src={url}
							alt="Collection"
							className="w-[200px] h-[200px] object-cover rounded-md"
						/>
						<Button
							size="sm"
							className="absolute top-2 right-2 bg-red-1 text-white"
							onClick={() => onRemove(url)}
						>
							<Trash className="h-4 w-4" />
						</Button>
					</div>
				))}
			</div>
			<CldUploadWidget
				uploadPreset="styora-admin"
				onSuccess={handleSuccess}
			>
				{({ open }) => {
					return (
						<Button
							type="button"
							onClick={() => open()}
							className="bg-grey-1 text-white min-w-1/6"
						>
							<Plus /> Upload Image
						</Button>
					);
				}}
			</CldUploadWidget>
		</div>
	);
};

export default ImageUpload;
