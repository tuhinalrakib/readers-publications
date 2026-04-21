"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import useHttp from "@/hooks/useHttp";
import { API_ENDPOINTS } from "@/constants/apiEnds";

export function SpecialOffersCarousel() {
	const [api, setApi] = useState();
	const intervalRef = useRef(null);
	const [specialOffers, setSpecialOffers] = useState([]);
	const { sendRequests, isLoading } = useHttp();

	useEffect(() => {
		if (!api) return;

		const startAutoScroll = () => {
			intervalRef.current = setInterval(() => {
				api.scrollNext();
			}, 3000); // Auto scroll every 3 seconds
		};

		const stopAutoScroll = () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};

		startAutoScroll();

		// Pause auto scroll on hover
		const container = api.rootNode();
		container.addEventListener("mouseenter", stopAutoScroll);
		container.addEventListener("mouseleave", startAutoScroll);

		return () => {
			stopAutoScroll();
			container.removeEventListener("mouseenter", stopAutoScroll);
			container.removeEventListener("mouseleave", startAutoScroll);
		};
	}, [api]);

	// Fetch data
	useEffect(() => {
		sendRequests(
			{
				url_info: {
					url: API_ENDPOINTS.SPECIAL_PACKAGES,
				},
			},
			(res) => {
				setSpecialOffers(res?.results);
			},
		);
	}, []);

	return specialOffers.length > 0 ? (
		<div className="w-full">
			<section className="py-6 bg-white">
				<div className="container mx-auto px-4">
					<Carousel
						className="w-full"
						setApi={setApi}
						opts={{
							align: "start",
							loop: true,
						}}>
						<CarouselContent>
							{specialOffers.map((offer) => (
								<CarouselItem
									key={offer.uuid}
									className="basis-full md:basis-1/2">
									<div className="p-1">
										<Image
											src={
												`http://${offer.image}` ||
												"/placeholder.svg"
											}
											alt={`Special offer ${offer.uuid}`}
											width={400}
											height={300}
											className="w-full h-64 object-cover rounded-lg"
										/>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="left-2" />
						<CarouselNext className="right-2" />
					</Carousel>
				</div>
			</section>
		</div>
	) : null;
}
