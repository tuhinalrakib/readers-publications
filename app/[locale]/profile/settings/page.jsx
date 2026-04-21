"use client";
import { useEffect } from "react";
import { Mail, User, Upload } from "lucide-react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import useHttp from "@/hooks/useHttp";
import { API_ENDPOINTS } from "@/constants/apiEnds";

const Settings = () => {
	const t = useTranslations("profile.settings");
	const fileInputRef = useRef(null);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [userInfoData, setUserInfoData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    profile_picture: null,
  });
  const [errorMsg, setErrorMsg] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const {sendRequests, isLoading, error} = useHttp();
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setUserInfoData({
      full_name: userInfo?.full_name || "",
      email: userInfo?.email || "",
      phone_number: userInfo?.phone_number || "",
      profile_picture: userInfo?.profile_picture || "",
    })
  }, [userInfo])



  const onChange = (e) => {
    setUserInfoData({
      ...userInfoData,
      [e.target.name]: e.target.value,
    });
  }

const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file)
        const reader = new FileReader();
        reader.onloadend = () => {
            setUserInfoData({
                ...userInfoData,
                profile_picture: reader.result,
            });
        };
        reader.readAsDataURL(file);
    }
};

  const validateForm = () => {
    let isValid = true;
    if (!userInfoData.full_name) {
      setErrorMsg({
        ...errorMsg,
        full_name: "Full name is required",
      });
      isValid = false;
    }
    if (!userInfoData.email) {
      setErrorMsg({
        ...errorMsg,
        email: "Email is required",
      });
      isValid = false;
    }
    if (!userInfoData.phone_number) {
      setErrorMsg({
        ...errorMsg,
        phone_number: "Phone number is required",
      });
      isValid = false;
    }
    return isValid;
  }

  const handleSubmit = () => {
    setErrorMsg({});
    setSuccessMsg("");
    if (!validateForm()) {
      return;
    }
    let formData = new FormData();
    formData.append("full_name", userInfoData.full_name);
    formData.append("email", userInfoData.email);
    formData.append("phone_number", userInfoData.phone_number);
    if(profileImage){
      formData.append("profile_picture", profileImage);
    }

    sendRequests({
      url_info: {
        url: API_ENDPOINTS.UPDATE_USER_INFO,
      },
      method: 'put',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData,
    }, (res) => {
      setSuccessMsg("Profile updated successfully");
    })
  }

	return (
		<div className="rounded-xl bg-white p-6 shadow-lg">
			<h2 className="mb-6 text-xl font-semibold">{t("title")}</h2>

			<div className="space-y-6">
				<div>
					<h3 className="mb-4 text-lg font-medium">
						{t("personal_info")}
					</h3>
					
					<div className="mb-6 flex flex-col items-center">
            {successMsg && (
              <p className="text-green-500 text-sm">{successMsg}</p>
            )}
            {error?.non_fields_error && (
              <p className="text-red-500 text-sm">{error?.non_fields_error}</p>
            )}
						<div className="relative mb-4">
							<img
								src={userInfoData.profile_picture || "/default_profile.png"}
								alt="Profile"
								className="h-32 w-32 rounded-full object-cover"
							/>
							<button
								onClick={() => fileInputRef.current?.click()}
								className="absolute bottom-0 right-0 rounded-full bg-brand-600 p-2 text-white hover:bg-brand-700"
							>
								<Upload className="h-4 w-4" />
							</button>
						</div>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleImageUpload}
							accept="image/*"
							className="hidden"
						/>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">
								{t("name")}
							</label>
							<div className="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-brand-500 ">
								<div className="flex items-center bg-gray-50 px-3 text-gray-500">
									<User className="h-5 w-5" />
								</div>
								<input
									type="text"
									className="w-full border-0 bg-transparent py-2 pl-2"
									value={userInfoData?.full_name}
                  onChange={onChange}
                  name="full_name"
								/>
							</div>
              {errorMsg.full_name && (
                <p className="text-red-500 text-sm">{errorMsg.full_name}</p>
              )}  
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">
								{t("email")}
							</label>
							<div className="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-brand-500 ">
								<div className="flex items-center bg-gray-50 px-3 text-gray-500">
									<Mail className="h-5 w-5" />
								</div>
								<input
									type="email"
									className="w-full border-0 bg-transparent py-2 pl-2"
									value={userInfoData?.email}
                  onChange={onChange}
                  name="email"
								/>
							</div>
              {errorMsg.email && (
                <p className="text-red-500 text-sm">{errorMsg.email}</p>
              )}  
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">
								{t("phone_number")}
							</label>
							<div className="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-brand-500 ">
								<div className="flex items-center bg-gray-50 px-3 text-gray-500">
									<Phone className="h-5 w-5" />
								</div>
								<input
									type="text"
									className="w-full border-0 bg-transparent py-2 pl-2"
									value={userInfoData?.phone_number}
                  placeholder="+88017xxxxxxxx"
                  onChange={onChange}
                  name="phone_number"
								/>
							</div>
              {errorMsg.phone_number && (
                <p className="text-red-500 text-sm">{errorMsg.phone_number}</p>
              )}  
						</div>
					</div>

						<div className="mt-6 flex justify-end space-x-4">
							<Button
								className="bg-brand-600 hover:bg-brand-700"
								onClick={handleSubmit} disabled={isLoading}> 
								{isLoading ? "Loading..." : "Save"} 
							</Button>
						</div>
					
				</div>

				<div className="border-t pt-6">
					<h3 className="mb-4 text-lg font-medium text-red-600">
						{t("delete_account")}
					</h3>
					<p className="mb-4 text-gray-600">
						{t("delete_account_message")}
					</p>
					<Button variant="destructive">
						{t("delete_your_account")}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Settings;
