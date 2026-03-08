"use client";
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
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  LogIn,
  UserPlus,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";
// Add these imports at the top
import { useDispatch } from "react-redux";
import { authApi } from "@/features/api/authApi";

const PRIMARY_GREEN = "bg-[#4CAF50] hover:bg-[#388E3C]";
const ACTIVE_GREEN =
  "data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white";
const FOCUS_GREEN = "focus:ring-[#4CAF50] focus:border-[#4CAF50]";
const BORDER_COLOR = "border-gray-200";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser] = useLoginUserMutation();
  const [registerUser] = useRegisterUserMutation();

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
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
      await loginUser({
        email: loginData.email,
        password: loginData.password,
      }).unwrap();
      toast.success("Login successful.");
      // ← Force loadUser to refetch so navbar updates immediately
      dispatch(authApi.util.invalidateTags(['Auth']));
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      // ... keep existing error handling unchanged
    } finally {
      setIsLoginLoading(false);
    }
};

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsRegisterLoading(true);
    setRegisterError("");
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
      toast.success("Registration successful.");
      // ← Force loadUser to refetch so navbar updates immediately
      dispatch(authApi.util.invalidateTags(['Auth']));
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      // ... keep existing error handling unchanged
    } finally {
      setIsRegisterLoading(false);
    }
};

  const PasswordToggle = ({ show, onToggle }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
      onClick={onToggle}
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-between p-8 font-poppins overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      {/* Left Side - Graphics and Branding */}
      <div className="relative z-10 flex-1 hidden lg:flex flex-col justify-center items-start pl-12 xl:pl-40 space-y-8">
        {/* Logo/Icon Area */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                {/* <Building2 className="w-10 h-10 text-emerald-400" /> */}
                <img src="./shape.png"/>
              </div>
              {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping" /> */}
              {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full" /> */}
            </div>
            <h1 className="text-4xl font-bold text-white">ChainSaw</h1>
          </div>
          
          <div className="max-w-md space-y-4">
            <h2 className="text-5xl font-bold text-white leading-tight">
              Welcome 
              <span className="block text-emerald-400">Let's onboard.</span>
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
             Seamless experience in optimizing your supply chain.
            </p>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-3 max-w-md">
          {[
            { text: "Inventory Optimization" },
            { text: "Optimize Routes" },
            { text: "Supplier Scoring" },
            { text: "Demand Forecasting" }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <span className="text-xl">{feature.icon}</span>
              <span className="text-sm text-white font-medium">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="absolute left-0 bottom-20 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center space-x-3 opacity-60"
              style={{ animationDelay: `${i * 200}ms` }}
            >
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <div className="w-32 h-1 bg-gradient-to-r from-emerald-400/50 to-transparent rounded-full" />
            </div>
          ))}
        </div>

        {/* Floating Cards Animation */}
        
      </div>

      {/* Right Side - Form */}
      <div className="relative z-10 w-full max-w-md lg:mr-12 xl:mr-40">
        <Tabs defaultValue="register" className="w-full">
          <TabsList
            className={`grid w-full grid-cols-2 mb-4 rounded-xl bg-white/95 backdrop-blur-md border ${BORDER_COLOR} pb-3 shadow-lg`}
          >
            <TabsTrigger
              value="register"
              className={`cursor-pointer rounded-lg ${ACTIVE_GREEN} text-gray-700 data-[state=inactive]:hover:bg-white transition-colors`}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Register
            </TabsTrigger>
            <TabsTrigger
              value="login"
              className={`cursor-pointer rounded-lg ${ACTIVE_GREEN} text-gray-700 data-[state=inactive]:hover:bg-white transition-colors`}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register">
            <Card
              className={`w-full ${BORDER_COLOR} border shadow-2xl bg-white/95 backdrop-blur-md text-gray-900 rounded-2xl transition-shadow hover:shadow-emerald-200/60`}
            >
              <div className="absolute -inset-px rounded-2xl pointer-events-none border border-emerald-200/50" />
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  Create an Account
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Join and manage the journey with confidence.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                  {registerError && (
                    <div className="p-3 bg-red-100 border border-red-500 text-red-700 rounded-lg text-sm">
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
                      className={`h-12 bg-white ${BORDER_COLOR} border ${FOCUS_GREEN} transition-transform focus:-translate-y-0.5`}
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
                      className={`h-12 bg-white ${BORDER_COLOR} border ${FOCUS_GREEN} transition-transform focus:-translate-y-0.5`}
                    />
                    {!isValidEmail(registerData.email) &&
                      registerData.email.length > 0 && (
                        <p className="text-xs text-red-600 mt-1">
                          Use a valid email format.
                        </p>
                      )}
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
                        className={`h-12 bg-white ${BORDER_COLOR} border ${FOCUS_GREEN} pr-10 transition-transform focus:-translate-y-0.5`}
                      />
                      <PasswordToggle
                        show={showRegisterPassword}
                        onToggle={() => setShowRegisterPassword((s) => !s)}
                      />
                    </div>
                    {registerData.password &&
                      !isStrongPassword(registerData.password) && (
                        <p className="text-xs text-amber-600 mt-1">
                          Include upper and lower case letters and a number.
                        </p>
                      )}
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
                        className={`h-12 bg-white ${BORDER_COLOR} border ${FOCUS_GREEN} pr-10 transition-transform focus:-translate-y-0.5`}
                      />
                      <PasswordToggle
                        show={showConfirmPassword}
                        onToggle={() => setShowConfirmPassword((s) => !s)}
                      />
                    </div>
                  </div>
                  <Button
                    className={`w-full h-12 mt-6 rounded-lg text-white ${PRIMARY_GREEN} transition-all active:scale-[0.99]`}
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
                  <p className="text-xs text-center text-gray-500 mt-3">
                    By continuing, acceptance of Terms & Privacy Policy.
                  </p>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="login">
            <Card
              className={`w-full ${BORDER_COLOR} border shadow-2xl bg-white/95 backdrop-blur-md text-gray-900 rounded-2xl transition-shadow hover:shadow-emerald-200/60`}
            >
              <div className="absolute -inset-px rounded-2xl pointer-events-none border border-emerald-200/50" />
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Access the dashboard securely.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                  {loginError && (
                    <div className="p-3 bg-red-100 border border-red-500 text-red-700 rounded-lg text-sm">
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
                      className={`h-12 bg-white ${BORDER_COLOR} border ${FOCUS_GREEN} transition-transform focus:-translate-y-0.5`}
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
                        className={`h-12 bg-white ${BORDER_COLOR} border ${FOCUS_GREEN} pr-10 transition-transform focus:-translate-y-0.5`}
                      />
                      <PasswordToggle
                        show={showLoginPassword}
                        onToggle={() => setShowLoginPassword((s) => !s)}
                      />
                    </div>
                  </div>
                  <Button
                    className={`w-full h-12 mt-6 rounded-lg text-white ${PRIMARY_GREEN} transition-all active:scale-[0.99]`}
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
                  <p className="text-xs text-center text-gray-500 mt-3">
                    Trouble logging in? Reset from the profile service.
                  </p>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
