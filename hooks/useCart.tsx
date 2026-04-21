import { useState, useEffect } from 'react'
import useHttp from './useHttp'
import { API_ENDPOINTS } from '@/constants/apiEnds'
import { useDispatch, useSelector } from 'react-redux'
import { addCartItem, removeCartItem, updateSelectionStatusChange } from '@/store/cart'
import { randomIdGenerator } from '@/utils/generalFunc'


const useCart = () => {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { sendRequests } = useHttp()
  const isAuthUser = useSelector((state: any) => state.user.isAuthenticated)
  const user = useSelector((state: any) => state.user.userInfo)
  const dispatch = useDispatch()

  // Fetch cart items
  const fetchCartItemsAuthUser = async (params: any = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      sendRequests({
        url_info: {
          url: API_ENDPOINTS.CART_LIST,
        },
        params: params,
      }, (response: any) => {
        setCartItems(response)
        setLoading(false)
      })
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const fetchCartItemsUnAuthUser = async () => {
    const cartItems = localStorage.getItem('cartItems')
    if (cartItems) {
      setCartItems(JSON.parse(cartItems))
    }
  }

  const fetchCartItems = async (params: any = {}) => {
    if (isAuthUser) {
      fetchCartItemsAuthUser(params)
    } else {
      fetchCartItemsUnAuthUser()
    }
  }

  // Add item to cart
  const addToCartAuthUser = async (bookId: number | string, quantity = 1) => {
    setLoading(true)
    setError(null)
    
    try {
      sendRequests({
        url_info: {
          url: API_ENDPOINTS.ADD_TO_CART,
        },
        method: 'POST',
        data: {
          book: bookId,
          quantity: quantity,
          user: user.id
        },
      }, (response: any) => {
        let cart = {
          book_id: bookId,
          quantity: quantity,
          uuid: response.uuid,
        }
        dispatch(addCartItem(cart))
        setLoading(false)
      })
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const addToCartUnAuthUser = async (book: any, quantity = 1) => {
    let cartItems: any = localStorage.getItem('cartItems')
    if (cartItems) {
      cartItems = JSON.parse(cartItems)
    } else {
      cartItems = []
    }

    // already exists
    if (cartItems.find((item: any) => item.book_details.id === book.book_details.id)) {
      cartItems.find((item: any) => item.book_details.id === book.book_details.id).quantity += quantity
    } else {
      cartItems.push({ 
        ...book,
        quantity: quantity,
        uuid: "new-book-" + randomIdGenerator(),
      })
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems))

    dispatch(addCartItem({ 
      book_id: book.book_details.id,
      quantity: quantity,
      uuid: "new-book-" + randomIdGenerator(),
    }))
  }

  const addToCart = async (book: any, quantity = 1) => {
    if (isAuthUser) {
      addToCartAuthUser(book.book_details.id, quantity)
    } else {
      addToCartUnAuthUser(book, quantity)
    }
  }

  // Remove item from cart
  const removeFromCartAuthUser = async (cartItemId: number | string) => {
    setLoading(true)
    setError(null)
    
    try {
      sendRequests({
        url_info: {
          url: API_ENDPOINTS.DELETE_CART_ITEM(cartItemId),
        },
        method: 'DELETE',
      }, (response: any) => {
        setCartItems(prev => prev.filter((item: any) => item.uuid !== cartItemId))
        dispatch(removeCartItem([cartItemId]))
        setLoading(false)
      })
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const removeFromCartUnAuthUser = async (cartItemId: number | string) => {
    const cartItems = localStorage.getItem('cartItems')
    if (cartItems) {
      const cartItemsArray = JSON.parse(cartItems)
      localStorage.setItem('cartItems', JSON.stringify(cartItemsArray.filter((item: any) => item.uuid !== cartItemId)))
      setCartItems(prev => prev.filter((item: any) => item.uuid !== cartItemId))
      dispatch(removeCartItem([cartItemId]))
    }
  }

  const removeFromCart = async (cartItemId: number | string) => {
    if (isAuthUser) {
      removeFromCartAuthUser(cartItemId)
    } else {
      removeFromCartUnAuthUser(cartItemId)
    }
  }

  // Update item quantity
  const updateQuantityAuthUser = async (cartItemId: number | string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setLoading(true)
    setError(null)
    
    try {
      sendRequests({
        url_info: {
          url: API_ENDPOINTS.UPDATE_CART_QUANTITY(cartItemId),
        },
        method: 'PATCH',
        data: {
          quantity: newQuantity,
        },
      }, (response: any) => {
        setCartItems(prev => prev.map((item: any) => item.uuid === cartItemId ? response : item))
        setLoading(false)
      })
    } catch (err: any ) {
      setError(err.message)
      setLoading(false)
    }
  }

  const updateQuantityUnAuthUser = async (cartItemId: number | string, newQuantity: number) => {
    const cartItems = localStorage.getItem('cartItems')
    if (cartItems) {
      const cartItemsArray = JSON.parse(cartItems)
      localStorage.setItem('cartItems', JSON.stringify(cartItemsArray.map((item: any) => item.uuid === cartItemId ? { ...item, quantity: newQuantity } : item)))
      setCartItems(prev => prev.map((item: any) => item.uuid === cartItemId ? { ...item, quantity: newQuantity } : item))
    }
  }

  const updateQuantity = async (cartItemId: number | string, newQuantity: number) => {
    if (isAuthUser) {
      updateQuantityAuthUser(cartItemId, newQuantity)
    } else {
      updateQuantityUnAuthUser(cartItemId, newQuantity)
    }
  }

  const updateSelectionStatusChangeAuthUser = (ids: string[], is_selected: boolean) => {
    sendRequests({
      url_info: {
        url: API_ENDPOINTS.UPDATE_CHECKOUT_SELECTION_STATUS,
      },
      method: "POST",
      data: {
        cart_ids: ids,
        is_selected: is_selected
      }
    }, (response: any) => {
      setCartItems(prev => prev.map((item: any) => ids.includes(item.uuid) ? { ...item, is_selected: is_selected } : item))
     })
  }

  const updateSelectionStatusChangeUnAuthUser = (ids: string[], is_selected: boolean) => {
    const cartItems = localStorage.getItem('cartItems')
    if (cartItems) {
      const cartItemsArray = JSON.parse(cartItems)
      localStorage.setItem('cartItems', JSON.stringify(cartItemsArray.map((item: any) => ids.includes(item.uuid) ? { ...item, is_selected: is_selected } : item)))
      setCartItems(prev => prev.map((item: any) => ids.includes(item.uuid) ? { ...item, is_selected: is_selected } : item))
    }
  }

  const updateSelectionStatusChange = (ids: string[], is_selected: boolean) => {
    if (isAuthUser) {
      updateSelectionStatusChangeAuthUser(ids, is_selected)
    } else {
      updateSelectionStatusChangeUnAuthUser(ids, is_selected)
    }
  }


  return {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateSelectionStatusChange,
    fetchCartItemsAuthUser,
    fetchCartItemsUnAuthUser,
    fetchCartItems
  }
}

export default useCart



