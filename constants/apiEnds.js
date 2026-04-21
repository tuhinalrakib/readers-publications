const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_HOST

export const API_ENDPOINTS = {
  LOGIN: `${BACKEND_URL}/api/token/`,
  REFRESH_TOKEN: `${BACKEND_URL}/api/token/refresh/`,
  SIGNUP: `${BACKEND_URL}/user/api/v1/auth/registration/`,
  GOOGLE_LOGIN: `${BACKEND_URL}/user/api/v1/auth/google-login/`,
  FORGOT_PASSWORD: `${BACKEND_URL}/user/api/v1/auth/forgot-password/`,
  UPDATE_PASSWORD: `${BACKEND_URL}/user/api/v1/auth/update-password/`,
  USER_PROFILE: `${BACKEND_URL}/user/api/v1/user/profile/`,
  CATEGORIES: `${BACKEND_URL}/book/api/v1/categories/`,
  HOME_CAROUSEL: `${BACKEND_URL}/core/api/v1/home-carousel/`, 
  GENERAL_DATA: `${BACKEND_URL}/core/api/v1/general-data/`,
  BLOG_LIST: `${BACKEND_URL}/blog/api/v1/list/`,
  BLOG_DETAIL: (slug) => `${BACKEND_URL}/blog/api/v1/detail/${slug}/`,
  TESTIMONIALS: `${BACKEND_URL}/core/api/v1/testimonials/`,
  UPDATE_USER_INFO: `${BACKEND_URL}/user/api/v1/user/profile/`,
  AUTHORS: `${BACKEND_URL}/author/api/v1/list/`,
  AUTHOR_DETAIL: (pk) => `${BACKEND_URL}/author/api/v1/detail/${pk}/`,

  // Book
  WISHLIST: `${BACKEND_URL}/user/api/v1/wishlist/`,
  WISHLIST_DELETE: (id) => `${BACKEND_URL}/user/api/v1/wishlist/${id}/`,
  BOOKS: `${BACKEND_URL}/book/api/v1/list/`,
  BOOK_DETAIL: (slug) => `${BACKEND_URL}/book/api/v1/detail/${slug}/`,
  SPECIAL_PACKAGES: `${BACKEND_URL}/book/api/v1/special-packages/`,
  SPECIAL_PACKAGE_DETAIL: (id) => `${BACKEND_URL}/book/api/v1/special-packages/${id}/`,
  AUTHORS: `${BACKEND_URL}/author/api/v1/list/`,
  AUTHOR_DETAIL: (pk) => `${BACKEND_URL}/author/api/v1/detail/${pk}/`,
  BOOK_PREVIEW_IMAGES: (book_id) => `${BACKEND_URL}/book/api/v1/previews/${book_id}/`,
  BOOK_REVIEWS: (book_id) => `${BACKEND_URL}/book/api/v1/reviews/${book_id}/`,
  BOOK_REVIEW_DISTRIBUTION: (book_id) => `${BACKEND_URL}/book/api/v1/reviews/distribution/${book_id}/`,
  BOOK_RELATED: `${BACKEND_URL}/book/api/v1/related-books/`,
  BOOK_REVIEWS_CREATE: (book_id) => `${BACKEND_URL}/book/api/v1/reviews/create/${book_id}/`,
  BOOK_REVIEWS_LIST: `${BACKEND_URL}/user/api/v1/reviews/`,

  // Cart
  CART_LIST: `${BACKEND_URL}/cart/api/v1/`,
  ADD_TO_CART: `${BACKEND_URL}/cart/api/v1/`,
  DELETE_CART_ITEM: (cartItemId) => `${BACKEND_URL}/cart/api/v1/${cartItemId}/`,
  REMOVE_FROM_CART: (cartItemId) => `${BACKEND_URL}/cart/api/v1/remove/${cartItemId}/`,
  UPDATE_CART_QUANTITY: (cartItemId) => `${BACKEND_URL}/cart/api/v1/update-quantity/${cartItemId}/`,
  CLEAR_CART: `${BACKEND_URL}/cart/api/v1/clear/`,
  UPDATE_CHECKOUT_SELECTION_STATUS: `${BACKEND_URL}/cart/api/v1/update_checkout_selection_status/`,
  // Address
  STATE_LIST: `${BACKEND_URL}/core/api/v1/state-list/`,
  CITY_LIST: `${BACKEND_URL}/core/api/v1/city-list/`,
  THANA_LIST: `${BACKEND_URL}/core/api/v1/thana-list/`,
  SHIPPING_ADDRESS: `${BACKEND_URL}/shipping-address/api/v1/`,

  // Order
  ORDER_CREATE: `${BACKEND_URL}/order/api/v1/`,
  ORDER_LIST: `${BACKEND_URL}/order/api/v1/`,
  ORDER_DETAIL: (orderId) => `${BACKEND_URL}/order/api/v1/${orderId}/`,
}
