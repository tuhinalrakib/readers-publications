"use client";

import { Clock, ShoppingBag, Package, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import useHttp from "@/hooks/useHttp";
import { API_ENDPOINTS } from "@/constants/apiEnds";
import Pagination from "@/components/pagination";   

const Orders = () => {
    const locale = useLocale();
    const [orders, setOrders] = useState([]);
    const { sendRequests: fetchOrders, isLoading: isLoadingOrders } = useHttp();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState("all");

    const fetchOrderData = (params) => {
        fetchOrders(
            {
                url_info: {
                    url: API_ENDPOINTS.ORDER_LIST,
                    isAuthRequired: true,
                },
                params: params,
            },
            (res) => {
                setOrders(res.results);
                setTotalPages(res.total_pages);
                setCurrentPage(res.current_page);
            },
        );
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        fetchOrderData({
            page: currentPage,
            status: e.target.value,
        });
    };

    useEffect(() => {
        fetchOrderData({
            page: currentPage,
            status: status,
        });
    }, [currentPage]);

    const t = useTranslations("profile.orders");

    return (
        <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">{t("title")}</h2>
                <div className="flex items-center w-full sm:w-auto">
                    <select 
                        className="w-full sm:w-auto rounded-md border-gray-300 text-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3"
                        onChange={handleStatusChange}
                    >
                        <option value="all">{t("all_orders")}</option>
                        <option value="completed">{t("completed_orders")}</option>
                        <option value="pending">{t("pending_orders")}</option>
                        <option value="cancelled">{t("canceled_orders")}</option>
                    </select>
                </div>
            </div>

            {isLoadingOrders ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin text-brand-600 mb-3" />
                    <p className="text-sm text-gray-500">Loading orders...</p>
                </div>
            ) : orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md"
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 p-4 gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center flex-wrap gap-2">
                                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                                            {order.order_id}
                                        </h3>
                                        <Badge
                                            className={`text-xs sm:text-sm ${
                                                order.status === "pending"
                                                    ? "bg-green-100 text-green-800"
                                                    : order.status === "processing"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : order.status === "ready_to_ship"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : order.status === "shipped"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : order.status === "delivered"
                                                    ? "bg-green-100 text-green-800"
                                                    : order.status === "completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : order.status === "cancelled"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {order.status?.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                        {order.created_at}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                                    <div className="text-left sm:text-right">
                                        <p className="font-medium text-gray-900 text-sm sm:text-base">
                                            {order.total_amount}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500">
                                            {order.order_items_count} {t("items")}
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full sm:w-auto transition-colors group-hover:border-brand-500 group-hover:text-brand-600 text-xs sm:text-sm"
                                        asChild
                                    >
                                        <Link href={`/${locale}/profile/orders/${order.order_id}`}>
                                            {t("view_details")}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 px-4 py-2">
                                <div className="flex items-center">
                                    <Package className="mr-2 h-4 w-4 text-gray-400" />
                                    <span className="text-xs sm:text-sm text-gray-500">
                                        {order.status === "completed"
                                            ? t("completed")
                                            : order.status === "pending"
                                            ? t("pending")
                                            : order.status === "processing"
                                            ? t("processing")
                                            : order.status === "ready_to_ship"
                                            ? t("ready_to_ship")
                                            : order.status === "shipped"
                                            ? t("shipped")
                                            : order.status === "delivered"
                                            ? t("delivered")
                                            : order.status === "cancelled"
                                            ? t("cancelled")
                                            : ""}
                                    </span>
                                </div>
                                <Link
                                    href={`/${locale}/profile/orders/${order.order_id}`}
                                    className="text-xs sm:text-sm font-medium text-brand-600 hover:text-brand-700"
                                >
                                    {t("track_order")}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                    <div className="mb-4 rounded-full bg-gray-100 p-4 sm:p-6">
                        <ShoppingBag className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-base sm:text-lg font-medium">
                        {t("no_orders")}
                    </h3>
                    <p className="mb-6 max-w-md text-xs sm:text-sm text-gray-500">
                        {t("no_orders_message")}
                    </p>
                    <Button className="bg-brand-600 hover:bg-brand-700 text-xs sm:text-sm w-full sm:w-auto px-4 py-2" asChild>
                        <Link href={`/${locale}/books`}>{t("browse_books")}</Link>
                    </Button>
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-6">
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default Orders;