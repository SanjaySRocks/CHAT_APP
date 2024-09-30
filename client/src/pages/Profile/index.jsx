import { useAppStore } from "@/store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState(userInfo.firstName || ""); // Initialize with userInfo
  const [lastName, setLastName] = useState(userInfo.lastName || ""); // Initialize with userInfo
  const [image, setImage] = useState(null); // Image state
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000"); // Default color as a hex code

  const saveChanges = async () => {
    // Function to save changes (to be implemented)
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Update the image state
  };

  const handleRemoveImage = () => {
    setImage(null); // Clear the image state
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={() => navigate(-1)} className="cursor-pointer">
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
                  src={URL.createObjectURL(image)} // Display the image using a URL object
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                  {firstName ? firstName.charAt(0) : userInfo.email.charAt(0)}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center">
                {image ? (
                  <FaTrash className="text-white cursor-pointer" onClick={handleRemoveImage} />
                ) : (
                  <FaPlus className="text-white cursor-pointer" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange} // Update the image state
                  className="absolute inset-0 opacity-0 cursor-pointer" // Make input fill the Avatar
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
