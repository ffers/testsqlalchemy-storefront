"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

export interface BannerSlide {
	id: string;
	image?: string;
	title: string;
	subtitle?: string;
	buttonText?: string;
	buttonLink?: string;
	textPosition?: "left" | "center" | "right";
	bgColor?: string;
}

interface HeroBannerProps {
	slides: BannerSlide[];
	autoPlayInterval?: number;
	showDots?: boolean;
	showArrows?: boolean;
}

export const HeroBanner = ({
	slides,
	autoPlayInterval = 5000,
	showDots = true,
	showArrows = true,
}: HeroBannerProps) => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	const nextSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
	}, [slides.length]);

	const prevSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
	}, [slides.length]);

	const goToSlide = (index: number) => {
		setCurrentSlide(index);
		setIsAutoPlaying(false);
		setTimeout(() => setIsAutoPlaying(true), 10000);
	};

	useEffect(() => {
		if (!isAutoPlaying || slides.length <= 1) return;

		const interval = setInterval(nextSlide, autoPlayInterval);
		return () => clearInterval(interval);
	}, [isAutoPlaying, autoPlayInterval, nextSlide, slides.length]);

	if (slides.length === 0) return null;

	const getTextPositionClasses = (position?: "left" | "center" | "right") => {
		switch (position) {
			case "left":
				return "items-start text-left";
			case "right":
				return "items-end text-right";
			default:
				return "items-center text-center";
		}
	};

	return (
		<div className="relative w-full overflow-hidden bg-neutral-100">
			<div className="relative aspect-[21/9] w-full md:aspect-[21/7]">
				{slides.map((slide, index) => (
					<div
						key={slide.id}
						className={`absolute inset-0 transition-opacity duration-700 ${
							index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
						}`}
						style={{ backgroundColor: slide.bgColor || "#262626" }}
					>
						{slide.image && (
							<Image
								src={slide.image}
								alt={slide.title}
								fill
								className="object-cover"
								priority={index === 0}
								sizes="100vw"
							/>
						)}
						<div className="absolute inset-0 bg-black/30" />
						<div
							className={`absolute inset-0 flex flex-col justify-center p-8 md:p-16 ${getTextPositionClasses(
								slide.textPosition
							)}`}
						>
							<div className="max-w-2xl">
								<h2 className="mb-2 text-2xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
									{slide.title}
								</h2>
								{slide.subtitle && (
									<p className="mb-4 text-sm text-white/90 drop-shadow md:text-lg">
										{slide.subtitle}
									</p>
								)}
								{slide.buttonText && slide.buttonLink && (
									<Link
										href={slide.buttonLink}
										className="inline-block rounded bg-white px-6 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100 md:px-8 md:py-3 md:text-base"
									>
										{slide.buttonText}
									</Link>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			{showArrows && slides.length > 1 && (
				<>
					<button
						onClick={() => {
							prevSlide();
							setIsAutoPlaying(false);
							setTimeout(() => setIsAutoPlaying(true), 10000);
						}}
						className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-neutral-800 shadow-lg transition-colors hover:bg-white md:p-3"
						aria-label="Попередній слайд"
					>
						<svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<button
						onClick={() => {
							nextSlide();
							setIsAutoPlaying(false);
							setTimeout(() => setIsAutoPlaying(true), 10000);
						}}
						className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-neutral-800 shadow-lg transition-colors hover:bg-white md:p-3"
						aria-label="Наступний слайд"
					>
						<svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</>
			)}

			{showDots && slides.length > 1 && (
				<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
					{slides.map((_, index) => (
						<button
							key={index}
							onClick={() => goToSlide(index)}
							className={`h-2 w-2 rounded-full transition-all md:h-3 md:w-3 ${
								index === currentSlide
									? "w-6 bg-white md:w-8"
									: "bg-white/50 hover:bg-white/80"
							}`}
							aria-label={`Перейти до слайду ${index + 1}`}
						/>
					))}
				</div>
			)}
		</div>
	);
};
