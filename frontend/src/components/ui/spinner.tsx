import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
	return (
		<div className="h-screen bg-yellow-500 flex items-center justify-center text-2xl font-bold">
			Loading...
			<Loader2Icon
				role="status"
				aria-label="Loading"
				className={cn("size-4 animate-spin ", className)}
				{...props}
			/>
		</div>
	);
}

export { Spinner };
