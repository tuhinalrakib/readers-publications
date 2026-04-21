"use client"

import { API_ENDPOINTS } from "@/constants/apiEnds"
import { useEffect } from "react"
import { setUserInfo } from "@/store/userSlice"
import { setIsAuthenticated } from "@/store/userSlice"
import { useDispatch, useSelector } from "react-redux"
import useHttp from "@/hooks/useHttp"
import { setGeneralData } from "@/store/generalData"
import { setCartItems } from "@/store/cart"

function FetchRootData() {
    const { sendRequests: fetchGeneralData } = useHttp()
    const { sendRequests: fetchUserProfileData } = useHttp()
    const dispatch = useDispatch()
    const isAuthUser = useSelector((state: any) => state.user.isAuthenticated)

    const fetchUserProfile = () => {
      fetchUserProfileData({
        url_info: {
          url: API_ENDPOINTS.USER_PROFILE,
          is_auth_required: true,
        },
          method: "GET",
        }, (res: any) => {
          dispatch(setUserInfo(res))
          dispatch(setIsAuthenticated(true))
          dispatch(setCartItems(res.cart_items))
        })
      }

    const handleFtchGeneralData = () => {
      fetchGeneralData({
        url_info: {
          url: API_ENDPOINTS.GENERAL_DATA,
        },
        }, (res: any) => {
          dispatch(setGeneralData(res))
        })
      }


    useEffect(() => {
      fetchUserProfile()
      handleFtchGeneralData()
    }, [])

    useEffect(() => {
      if (!isAuthUser) {
        let cartItems = localStorage.getItem('cartItems')
        if (cartItems) {
          let cartItemsArray = JSON.parse(cartItems)
          cartItemsArray = cartItemsArray.map((item: any) => {
            return {
              "uuid": item.uuid,
              "book_id": item.book_details.id,
              "quantity": item.quantity
            }
          })
          setTimeout(() => {
            dispatch(setCartItems(cartItemsArray))
          }, 100)
        }
      }
    }, [isAuthUser])


  return null
}

export default FetchRootData