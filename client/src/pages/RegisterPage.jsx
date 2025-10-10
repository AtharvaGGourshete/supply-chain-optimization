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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";

const PRIMARY_GREEN = "bg-[#4CAF50] hover:bg-[#388E3C]";
const ACTIVE_GREEN =
  "data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white";
const FOCUS_GREEN = "focus:ring-[#4CAF50] focus:border-[#4CAF50]";
const BORDER_COLOR = "border-gray-200";

export default function RegisterPage() {
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
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      let errorMessage = "Login failed. Please check your credentials.";
      if (err?.data?.errors && Array.isArray(err.data.errors)) {
        const combinedErrors = err.data.errors.map((e) => e.msg).join(" | ");
        toast.error(combinedErrors, { duration: 5000 });
        setLoginError(err.data.errors[0].msg);
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
        toast.error(errorMessage);
        setLoginError(errorMessage);
      } else {
        toast.error(errorMessage);
        setLoginError(errorMessage);
      }
      setLoginData((prev) => ({ ...prev, password: "" }));
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
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      let errorMessage = "Registration failed. Please try again.";
      if (err?.data?.errors && Array.isArray(err.data.errors)) {
        const combinedErrors = err.data.errors.map((e) => e.msg).join(" | ");
        toast.error("Validation failed. Check below for details.", {
          description: combinedErrors,
          duration: 5000,
        });
        setRegisterError(err.data.errors[0].msg);
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
        toast.error(errorMessage);
        setRegisterError(errorMessage);
      } else {
        toast.error(errorMessage);
        setRegisterError(errorMessage);
      }
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
    <div className="relative min-h-screen flex items-center justify-center p-4 font-poppins overflow-hidden bg-[#f6fbf7]">
      {/* Ensure parent is relative and content has z-10 */}
      {/* BG Layer A: animated radial gradients (visible) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/4 -left-1/4 w-[80vw] h-[80vw] rounded-full bg-emerald-200/50 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-1/3 -right-1/4 w-[70vw] h:[70vw] rounded-full bg-emerald-300/40 blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
      </div>

      {/* BG Layer B: isometric grid via safe utility (no inline style) */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-10 [background-image:linear-gradient(120deg,rgba(16,185,129,.25)_1px,transparent_1px),linear-gradient(60deg,rgba(16,185,129,.18)_1px,transparent_1px),linear-gradient(0deg,rgba(16,185,129,.10)_1px,transparent_1px)] [background-size:24px_24px] [background-position:0_0]" />

      {/* BG Layer C: SVG blobs (now inside absolutely-positioned wrappers with z-index) */}
      <div className="pointer-events-none absolute -z-10 top-[-80px] left-[-80px] w-[520px] h-[520px] opacity-30">
        <svg
          viewBox="0 0 600 600"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <radialGradient id="gradA">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          <g transform="translate(300,300)">
            <path
              d="M120,-150C160,-120,190,-80,200,-35C210,10,200,60,175,105C150,150,110,190,60,210C10,230,-50,230,-95,205C-140,180,-170,130,-190,80C-210,30,-220,-20,-205,-70C-190,-120,-150,-170,-105,-195C-60,-220,-10,-220,35,-210C80,-200,120,-180,120,-150Z"
              fill="url(#gradA)"
            />
          </g>
        </svg>
      </div>

      <div className="pointer-events-none absolute -z-10 bottom-[-100px] right-[-120px] w-[560px] h-[560px] opacity-25 rotate-12">
        <svg
          viewBox="0 0 600 600"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="gradB" x1="0" x2="1">
              <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <g transform="translate(300,300)">
            <path
              d="M130,-160C180,-130,220,-90,235,-40C250,10,240,70,210,120C180,170,130,210,75,230C20,250,-40,250,-90,225C-140,200,-180,150,-200,95C-220,40,-220,-20,-200,-75C-180,-130,-140,-180,-90,-205C-40,-230,20,-230,70,-215C120,-200,160,-170,130,-160Z"
              fill="url(#gradB)"
            />
          </g>
        </svg>
      </div>

      {/* BG Layer D: noise (escaped data URI in class to keep JIT) */}
      <div className="pointer-events-none absolute inset-0 -z-10 mix-blend-soft-light opacity-[0.06] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.35%22/></svg>')] [background-size:200px_200px]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md space-y-4">
        <Tabs defaultValue="register" className="w-full">
          <TabsList
            className={`grid w-full grid-cols-2 mb-4 rounded-xl bg-white/80 backdrop-blur border ${BORDER_COLOR} p-1 shadow-sm`}
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
              className={`w-full ${BORDER_COLOR} border shadow-xl bg-white/90 backdrop-blur-sm text-gray-900 rounded-2xl transition-shadow hover:shadow-emerald-200/60`}
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
              className={`w-full ${BORDER_COLOR} border shadow-xl bg-white/90 backdrop-blur-sm text-gray-900 rounded-2xl transition-shadow hover:shadow-emerald-200/60`}
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
    </div>
  );
}
