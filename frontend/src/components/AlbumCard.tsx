import React from "react";
import { useNavigate } from "react-router-dom";

import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";

interface AlbumCardProps {
	id: string;
	image: string;
	name: string;
	desc: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ image, name, desc, id }) => {
	const navigate = useNavigate();

	const cloudinaryInstance = new Cloudinary({
		cloud: { cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME },
	});
	// Instantiate an image object using the public_id from NeonDB
	const cloudinaryImage = cloudinaryInstance.image(image);

	return (
		<div
			onClick={() => navigate("/album/" + id)}
			className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
		>
			<AdvancedImage
				cldImg={cloudinaryImage}
				className="rounded w-[160px]"
				alt=""
			/>
			{/* <img src={image} className="rounded w-[160px]" alt="" /> */}
			<p className="font-bold mt-2 mb-1">{name.slice(0, 15)}...</p>
			<p className="text-slate-200 text-sm">{desc.slice(0, 18)}...</p>
		</div>
	);
};

export default AlbumCard;
