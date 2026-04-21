import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import uploadImage from "../../utils/uploadImage";

// SignUp page - Creates new user account with validation, profile photo upload, and password confirmation
const SignUp = () => {
  const[profilePic, setProfilePic] = useState(null);
  const[fullName, setFullName] = useState("");
  const[email , setEmail] = useState("");
  const[password , setPassword] = useState("");
  const[confirmPassword , setConfirmPassword] = useState("");

  const[error , setError] = useState(null);
  
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle SignUp Form Submit - Validates all fields, uploads profile image, creates new user account
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate full name field is not empty
    if(!fullName){
      setError("Моля, въведете вашето име");
      return;
    }

    // Validate email format using regex helper function
    if(!validateEmail(email)){
      setError("Моля, въведете валиден имейл адрес");
      return;
    }

    // Validate password field is not empty
    if(!password){
      setError("Моля, въведете парола");
      return;
    }

    // Validate password meets minimum length requirement for security
    if(password.length < 8){
      setError("Паролата трябва да е минимум 8 символа");
      return;
    }

    // Validate confirmation password field is not empty
    if(!confirmPassword){
      setError("Моля, потвърдете паролата");
      return;
    }

    // Verify both password fields match exactly
    if(password !== confirmPassword){
      setError("Паролите не съвпадат");
      return;
    }

    // Clear any previous error messages before attempting signup
    setError("");

    // SignUp API Call - create new user account with validated data
    try {
      // Initialize empty image URL (will be populated if user uploads profile pic)
      let profileImageUrl = "";

      //Upload image if present
      if(profilePic){
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Нещо се обърка. Моля, опитайте отново."); 
      }
    }
  };


  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-10 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Създайте профил</h3>
        <p className="text-xs tex-slate-700 mt-[5px] mb-6">
          Присъединете се към нас, като въведете своите данни по-долу.
        </p>

        <form onSubmit={handleSignUp}>

          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />



          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value) }
              label="Пълно име"
              placeholder="Иван"
              type="text"
            /> 

            <Input
              value={email}
              onChange = {({ target }) => setEmail(target.value)}
              label="Имейл адрес"
              placeholder="john@example.com"
              type="text"
            />

          <div className="col-span-2">
            <Input
              value={password}
              onChange = {({ target }) => setPassword(target.value)}
              label="Парола"
              placeholder="Минимум 8 символа"
              type="password"
            />
          </div>

          <div className="col-span-2">
            <Input
              value={confirmPassword}
              onChange = {({ target }) => setConfirmPassword(target.value)}
              label="Потвърждение на парола"
              placeholder="Потвърдете паролата"
              type="password"
            />
          </div>
          </div>


          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          
          <button type="submit" className="btn-primary">
            РЕГИСТРАЦИЯ
          </button>
          
          <p className="text-[13px] text-slate-800 mt-3">
            Вече имате профил?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Вход
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignUp;