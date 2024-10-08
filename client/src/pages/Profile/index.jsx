import Cookies from "js-cookie";
import { useAppStore } from "@/store";
import { useEffect, useState, useRef } from "react";
import { renderMatches, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, HOST, UPDATE_PROFILE_ROUTE } from "@/utils/constants";


const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState(userInfo.firstName || "");
  const [lastName, setLastName] = useState(userInfo.lastName || "");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0); // Default color
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if(userInfo.image){
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required");
      return false;
    }
    return true;
  };

  // Define the colors array
  const colors = ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500", "bg-purple-500"];

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const token=Cookies.get("jwt");
        console.log("token" , token);
        const response = await apiClient.post(
          
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          {headers: {
            'token':Cookies.get("jwt"), 
            "Content-Type":"application/json"
          }, withCredentials: true }
        );
        console.log(response);
        if (response.status == 200 && response.data) {
          console.log("recieved");
          setUserInfo({ ...response.data , profileSetup:true });
          toast.success("Profile Updated Successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
      }
    }
  };

  

  
  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup your profile");
    }
  };
  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    console.log({ file });
    if (file) {
      const formData = new FormData(); // Corrected here
      formData.append("profile-image", file);
      console.log(Cookies.get("user"));
      const curr = JSON.parse(Cookies.get("user"));
      console.log(curr);
      formData.append("user" , curr.id)
      try {
        const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData,{ headers: {
          'Content-Type': 'multipart/form-data',
        },});
        if (response.status === 200 && response.data.image) {
          // setImage(response.data.image); // Store the uploaded image
          setUserInfo({ ...userInfo, image: response.data.image }); // Update user info
          toast.success("Image updated successfully");
        }
      } catch (error) {
        console.error("Error updating image:", error);
        toast.error("Failed to update image");
      }
    }
  };

  const handleDeleteImage = async () => {
    // Implement the logic to delete the image, assuming an endpoint is available
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, { withCredentials: true });
      if (response.status === 200) {
       setUserInfo({ ...userInfo , image:null});
       toast.success("Image removed");
       setImage(null);
  }
}catch(error){
  console.log(error);
}};


  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image} // Updated to use the uploaded image
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${selectedColor}`}
                >
                  {firstName ? firstName.charAt(0) : userInfo.email.charAt(0)}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white cursor-pointer" />
                ) : (
                  <FaPlus className="text-white cursor-pointer" />
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                  name="profile-image"
                  accept=".png, .jpg, .svg, .webp"
                />
              </div>
            )}
          </div>

          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <input
                type="email"
                placeholder="Email"
                value={userInfo.email}
                disabled
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === color ? "outline outline-white/50 outline-2" : ""
                  }`}
                  onClick={() => setSelectedColor(color)} // Update selectedColor
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <button
            className="h-16 w-full bg-purple-700 text-white hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
