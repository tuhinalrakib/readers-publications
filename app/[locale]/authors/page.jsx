"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { BookOpen, Star, PenLine, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useHttp from "@/hooks/useHttp";
import { API_ENDPOINTS } from "@/constants/apiEnds";
import { useEffect, useState } from "react";

export default function AuthorsPage() {
	const t = useTranslations();
	const locale = useLocale();
	const [authors, setAuthors] = useState([]);

	const { sendRequests, isLoading } = useHttp();

	useEffect(() => {
		sendRequests(
			{
				url_info: {
					url: API_ENDPOINTS.AUTHORS,
				},
			},
			(res) => {
				const authorList = Array.isArray(res) ? res : (res?.results || []);
				setAuthors(authorList);
			},
		);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
			<div className="border-b bg-white">
				<div className="container mx-auto py-6">
					<div className="flex flex-col items-center justify-center text-center">
						<div className="mb-2 rounded-full bg-brand-50 p-1.5">
							<PenLine className="h-5 w-5 text-brand-600" />
						</div>
						<div>
							<h2 className="mb-1 text-xl font-bold text-slate-900">
								{t("authors.title")}
							</h2>
							<p className="text-xs text-slate-500">
								{t("authors.description")}
							</p>
						</div>
					</div>
				</div>
			</div>

			<section className="py-8">
				<div className="container mx-auto px-4">
					{isLoading ? (
						<div className="flex flex-col items-center justify-center py-20">
							<Loader2 className="h-10 w-10 animate-spin text-brand-600 mb-3" />
							<p className="text-sm text-slate-500">Loading authors...</p>
						</div>
					) : (
						<div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{authors?.length === 0 && (
								<div className="flex items-center justify-center col-span-full py-12">
									<p className="text-sm text-slate-500 text-center">No authors found :)</p>
								</div>
							)}
						{authors.map((author) => (
							<Link
								key={author.id}
								href={`/${locale}/authors/${author.slug}`}
								className="group block">
								<Card className="h-full overflow-hidden border-slate-200 transition-all duration-300 hover:border-brand-200 hover:shadow-md">
									<CardHeader className="flex flex-row items-center gap-3 bg-white p-4">

											<Avatar className="h-14 w-14 border-2 border-slate-100">
												<AvatarImage
													src={author?.profile_picture}
													alt={author.name}
												/>
												<AvatarFallback className="bg-brand-50 text-brand-600">
													{author.name ? author.name.slice(0, 2) : ""}
												</AvatarFallback>
											</Avatar>

										<div className="flex-1">
											<CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-brand-600">
												{locale === "bn"
													? author.name_bn
													: author.name}
											</CardTitle>
											<div className="flex items-center gap-1 text-xs text-slate-500">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{author.rating} ({author.rating_count})</span>
                      </div>
										</div>
									</CardHeader>
									<CardContent className="p-4">
										<p className="mb-3 text-xs text-slate-600 line-clamp-2">
                      {locale === "bn" ? author.description_bn : author.description}
                    </p>
										<div className="mb-3 flex flex-wrap gap-1.5">
											{author?.tags?.length > 0 && author?.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600"
                        >
                          {locale === "bn" ? tag.name_bn : tag.name}
                        </span>
                      ))}
										</div>
										<div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{author?.books}</span>
                      </div>
                    </div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
					)}
				</div>
			</section>
		</div>
	);
}
