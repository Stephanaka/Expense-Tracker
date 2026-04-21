import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";

// Login page - Authenticates user with email and password, stores token and redirects to dashboard
const Login = () => {
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [error , setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();


  // Handle Login Form Submit - Validates input and sends login request to API
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate email format using regex helper function
    if(!validateEmail(email)){
      setError("Моля, въведете валиден имейл адрес");
      return;
    }

    // Validate password field is not empty
    if(!password){
      setError("Моля, въведете вашата парола");
      return;
    }

    // Clear any previous error messages before attempting login
    setError("");
    
    // Send login credentials to authentication API endpoint
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;

      // If token received, save to localStorage for authenticated API requests
      if (token) {
        // Store JWT token in localStorage for persistence across page refreshes
        localStorage.setItem("token", token);
        // Update global user context with authenticated user data
        updateUser(user);
        // Redirect to dashboard after successful login
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        const message = error.response.data.message;
        if (message === "Invalid credentials") {
          setError("Невалидни данни. Моля, проверете имейл и парола.");
        } else {
          setError(message);
        }
      } else {
        setError("Нещо се обърка. Моля, опитайте отново."); 
      }
    }
  }

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
      <h3 className="text-xl font-semibold text-black">Добре дошли обратно</h3>
      <p className="text-xs tex-slate-700 mt-[5px] mb-6">
        Моля, въведете своите данни за вход
      </p>

      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange = {({ target }) => setEmail(target.value)}
          label="Имейл адрес"
          placeholder="john@example.com"
          type="text"
        />
        <Input
          value={password}
          onChange = {({ target }) => setPassword(target.value)}
          label="Парола"
          placeholder="Минимум 8 символа"
          type="password"
        />


        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button type="submit" className="btn-primary">
          ВХОД
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          Нямате профил?{" "}
          <Link className="font-medium text-primary underline" to="/signup">
            Регистрирайте се
          </Link>
        </p>
      </form>
      </div>
    </AuthLayout>
  );
}

export default Login;