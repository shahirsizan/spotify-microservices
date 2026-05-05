import { useSongData } from "@/context/SongContext";
import { AdvancedImage } from "@cloudinary/react";
import { twMerge } from "tailwind-merge";
import React from "react";

const CloudinaryImage: React.FC<{
	songThumbnail: string;
	className?: string;
}> = React.memo(({ songThumbnail, className }) => {
	const { cloudinaryImageInitializer } = useSongData();

	const cloudniaryImageObj = cloudinaryImageInitializer(songThumbnail);

	return (
		<AdvancedImage
			cldImg={cloudniaryImageObj}
			className={twMerge(
				"rounded w-12 aspect-square object-cover",
				className,
			)}
			alt=""
		/>
	);
});

export default CloudinaryImage;
