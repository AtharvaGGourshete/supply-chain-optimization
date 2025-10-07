import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import Glow from "@/components/ui/glow";
import { toast } from "sonner"; // Import toast

export default function RegisterPage() {
  const navigate = useNavigate();
  // RTK Query hooks
  const [loginUser] = useLoginUserMutation();
  const [registerUser] = useRegisterUserMutation();

  // State for password visibility
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for form data
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State for loading and errors
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  // Simple Frontend Validation Utilities
  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // --- Change Handlers ---
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (loginError) setLoginError("");
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    if (registerError) setRegisterError("");
  };

  // --- Submit Handlers ---

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError("");

    try {
      await loginUser({
        email: loginData.email,
        password: loginData.password,
      }).unwrap();
      
      toast.success("Login successful! Redirecting to Dashboard.");
      setTimeout(() => navigate("/"), 1200);

    } catch (err) {
      let errorMessage = "Login failed. Please check your credentials.";

      if (err?.data?.errors && Array.isArray(err.data.errors)) {
        // Backend express-validator errors (e.g., missing field validation)
        const combinedErrors = err.data.errors.map(e => e.msg).join(' | ');
        toast.error(combinedErrors, { duration: 5000 });
        setLoginError(err.data.errors[0].msg); // Set the first error for the red box

      } else if (err?.data?.message) {
        // Custom backend error (e.g., "Invalid credentials")
        errorMessage = err.data.message;
        toast.error(errorMessage);
        setLoginError(errorMessage);
      } else {
        // Network/Server down error
        toast.error(errorMessage);
        setLoginError(errorMessage);
      }
      
      // Clear password field for security and better UX on failure
      setLoginData((prev) => ({ ...prev, password: "" }));

    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsRegisterLoading(true);
    setRegisterError("");

    // Quick frontend check for password match (best practice UX)
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Passwords do not match");
      setIsRegisterLoading(false);
      return;
    }

    try {
      await registerUser({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      }).unwrap();
      
      toast.success("Registration successful! Redirecting to Dashboard.");
      setTimeout(() => navigate("/"), 1200);

    } catch (err) {
      let errorMessage = "Registration failed. Please try again.";

      if (err?.data?.errors && Array.isArray(err.data.errors)) {
        // Backend express-validator errors (multiple field errors)
        const combinedErrors = err.data.errors.map(e => e.msg).join(' | ');
        toast.error("Validation failed. Check below for details.", {
            description: combinedErrors,
            duration: 5000,
        });
        setRegisterError(err.data.errors[0].msg); // Set the first error for the red box

      } else if (err?.data?.message) {
        // Custom backend error (e.g., "User already exists with this email")
        errorMessage = err.data.message;
        toast.error(errorMessage);
        setRegisterError(errorMessage);
      } else {
        // Network/Server down error
        toast.error(errorMessage);
        setRegisterError(errorMessage);
      }

    } finally {
      setIsRegisterLoading(false);
    }
  };

  // --- Utility Component for Password Toggle ---
  const PasswordToggle = ({ show, onToggle }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
      onClick={onToggle}
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  );

  // --- JSX Rendering ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#143234] p-4">
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <Glow variant="top" intensity="high" />
      </div>
      <div className="relative z-10 w-full max-w-md space-y-8">
        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 rounded-xl bg-black/20 border border-white/10 p-1">
            <TabsTrigger
              value="register"
              className="cursor-pointer rounded-lg data-[state=active]:bg-[#276266] data-[state=active]:text-white text-gray-300"
            >
              Register
            </TabsTrigger>
            <TabsTrigger
              value="login"
              className="cursor-pointer rounded-lg data-[state=active]:bg-[#276266] data-[state=active]:text-white text-gray-300"
            >
              Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register">
            <Card className="w-full border-white/10 shadow-xl bg-black/20 text-white rounded-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  Create an Account
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your details to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                  {registerError && (
                    <div className="p-3 bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg text-sm">
                      {/* Note: This displays only the first error for visual clarity */}
                      {registerError} 
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      required
                      disabled={isRegisterLoading}
                      className="h-12 bg-black/30 border-white/20 focus:ring-[#276266] focus:border-[#276266]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="yourname@domain.com"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                      disabled={isRegisterLoading}
                      className="h-12 bg-black/30 border-white/20 focus:ring-[#276266] focus:border-[#276266]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        name="password"
                        type={showRegisterPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required
                        disabled={isRegisterLoading}
                        className="h-12 bg-black/30 border-white/20 focus:ring-[#276266] focus:border-[#276266]"
                      />
                      <PasswordToggle
                        show={showRegisterPassword}
                        onToggle={() => setShowRegisterPassword((s) => !s)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                        disabled={isRegisterLoading}
                        className="h-12 bg-black/30 border-white/20 focus:ring-[#276266] focus:border-[#276266]"
                      />
                      <PasswordToggle
                        show={showConfirmPassword}
                        onToggle={() => setShowConfirmPassword((s) => !s)}
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full h-12 mt-6 rounded-lg bg-[#276266] hover:bg-[#1f4c4f] transition-colors"
                    type="submit"
                    disabled={isRegisterLoading}
                  >
                    {isRegisterLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="login">
            <Card className="w-full border-white/10 shadow-xl bg-black/20 text-white rounded-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your credentials to log in.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                  {loginError && (
                    <div className="p-3 bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg text-sm">
                      {loginError}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                      disabled={isLoginLoading}
                      className="h-12 bg-black/30 border-white/20 focus:ring-[#276266] focus:border-[#276266]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        name="password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                        disabled={isLoginLoading}
                        className="h-12 bg-black/30 border-white/20 focus:ring-[#276266] focus:border-[#276266]"
                      />
                      <PasswordToggle
                        show={showLoginPassword}
                        onToggle={() => setShowLoginPassword((s) => !s)}
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full h-12 mt-6 rounded-lg bg-[#276266] hover:bg-[#1f4c4f] transition-colors"
                    type="submit"
                    disabled={isLoginLoading}
                  >
                    {isLoginLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging In...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}