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
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loginUser] = useLoginUserMutation();
  const [registerUser] = useRegisterUserMutation();

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isStrongPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError("");
    try {
      await loginUser({ email: loginData.email, password: loginData.password }).unwrap();
      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setLoginError(err?.data?.message || "Login failed");
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsRegisterLoading(true);
    setRegisterError("");

    if (!registerData.name || registerData.name.trim().length < 2 || registerData.name.trim().length > 50) {
      setRegisterError("Full name must be between 2 and 50 characters long");
      setIsRegisterLoading(false);
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(registerData.name.trim())) {
      setRegisterError("Full name can only contain letters and spaces");
      setIsRegisterLoading(false);
      return;
    }
    if (!registerData.email || !isValidEmail(registerData.email)) {
      setRegisterError("Please provide a valid email address");
      setIsRegisterLoading(false);
      return;
    }
    if (registerData.email.length > 100) {
      setRegisterError("Email must not exceed 100 characters");
      setIsRegisterLoading(false);
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Passwords do not match");
      setIsRegisterLoading(false);
      return;
    }
    if (registerData.password.length < 6) {
      setRegisterError("Password must be at least 6 characters long");
      setIsRegisterLoading(false);
      return;
    }
    if (!isStrongPassword(registerData.password)) {
      setRegisterError("Password must contain at least one uppercase letter, one lowercase letter, and one number");
      setIsRegisterLoading(false);
      return;
    }

    try {
      await registerUser({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      }).unwrap();
      setSuccessMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/"), 300);
    } catch (err) {
      const msg =
        (Array.isArray(err?.data?.errors) && err.data.errors?.msg) ||
        err?.data?.message ||
        "Registration failed";
      setRegisterError(msg);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const PasswordToggle = ({ show, onToggle }) => (
    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={onToggle}>
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  );

  return (
    <div className="min-h-screen flex bg-[#101010]">
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {successMessage && <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>}

          <Tabs defaultValue="register" className="w-full ">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="register" className="cursor-pointer">Register</TabsTrigger>
              <TabsTrigger value="login" className="cursor-pointer">Login</TabsTrigger>
            </TabsList>

            <TabsContent value="register" className="mt-0">
              <Card className="w-full border-0 shadow-none p-10">
                <CardHeader className="space-y-1 px-0">
                  <CardTitle className="text-2xl font-bold text-left">Create account</CardTitle>
                  <CardDescription className="text-left">Enter details to create your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 px-0">
                  <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                    {registerError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{registerError}</div>}

                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input id="register-name" name="name" type="text" placeholder="Enter your full name" value={registerData.name} onChange={handleRegisterChange} required disabled={isRegisterLoading} className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input id="register-email" name="email" type="email" placeholder="yourname@domain.com" value={registerData.email} onChange={handleRegisterChange} required disabled={isRegisterLoading} className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Input id="register-password" name="password" type={showRegisterPassword ? "text" : "password"} placeholder="Create a password" value={registerData.password} onChange={handleRegisterChange} required disabled={isRegisterLoading} className="h-12" />
                        <PasswordToggle show={showRegisterPassword} onToggle={() => setShowRegisterPassword((s) => !s)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input id="confirm-password" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={registerData.confirmPassword} onChange={handleRegisterChange} required disabled={isRegisterLoading} className="h-12" />
                        <PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword((s) => !s)} />
                      </div>
                    </div>
                    <Button className="w-full h-12 mt-6 rounded-full" type="submit" disabled={isRegisterLoading}>
                      {isRegisterLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>) : ("Create account")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="login" className="mt-0">
              <Card className="w-full border-0 shadow-none p-10">
                <CardHeader className="space-y-1 px-0 ">
                  <CardTitle className="text-2xl font-bold text-left">Login</CardTitle>
                  <CardDescription className="text-left">Enter your email and password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 px-0">
                  <form className="space-y-4" onSubmit={handleLoginSubmit}>
                    {loginError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{loginError}</div>}
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input id="login-email" name="email" type="email" placeholder="Enter your email" value={loginData.email} onChange={handleLoginChange} required disabled={isLoginLoading} className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input id="login-password" name="password" type={showLoginPassword ? "text" : "password"} placeholder="Enter your password" value={loginData.password} onChange={handleLoginChange} required disabled={isLoginLoading} className="h-12" />
                        <PasswordToggle show={showLoginPassword} onToggle={() => setShowLoginPassword((s) => !s)} />
                      </div>
                    </div>
                    <Button className="w-full h-12 mt-6 rounded-full" type="submit" disabled={isLoginLoading}>
                      {isLoginLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</>) : ("Login")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
