"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants";

const LeftSideBar = () => {
	const pathname = usePathname();

	return (
		<div className="h-screen sticky left-0 top-0 p-10 flex flex-col gap-16 bg-blue-2 shadow-xl max-lg:hidden">
			<Image src="/logo.png" alt="logo" width={130} height={130} />

			<div className="flex flex-col gap-12">
				{navLinks.map((link) => (
					<Link
						href={link.url}
						key={link.label}
						className={`flex gap-2 text-body-medium ${
							pathname === link.url
								? "text-blue-1 font-semibold"
								: ""
						}`}
					>
						{link.icon}
						<p>{link.label}</p>
					</Link>
				))}
			</div>

			<div className="flex flex-col gap-2 text-body-medium items-center">
				<UserButton />
				<p>Edit Profile</p>
			</div>
		</div>
	);
};

export default LeftSideBar;
