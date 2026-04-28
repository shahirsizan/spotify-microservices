import { useSongData } from "@/context/SongContext";
import { AdvancedImage } from "@cloudinary/react";
import React from "react";

const CloudinaryImage: React.FC<{ songThumbnail: string }> = ({
	songThumbnail,
}) => {
	const { cloudinaryImageInitializer } = useSongData();

	const cloudniaryImageObj = cloudinaryImageInitializer(songThumbnail);

	return (
		<AdvancedImage
			cldImg={cloudniaryImageObj}
			className="rounded w-12 aspect-square object-cover"
			alt=""
		/>
	);
};

export default CloudinaryImage;
