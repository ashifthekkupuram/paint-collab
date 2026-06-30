import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Brush } from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import api, { isAPIError } from "../api/api";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    error: string;
    details?: { name: string; message: string }[];
  } | null>(null);

  const { setUser } = useContext(AuthContext);

  const disabled = !email || !username || !password || loading;

  const navigate = useNavigate();

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/register", {
        email: email.trim().toLowerCase(),
        username,
        password,
      });

      window.__AccessToken__ = data.accessToken;
      setUser(data.user);
      navigate("/");
    } catch (e) {
      if (e instanceof AxiosError && isAPIError(e.response?.data)) {
        setError(e.response.data);
      } else {
        setError({ error: "Something went wrong" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#FAF9EE]">
      <div className="w-full max-w-xs m-auto bg-[#A2AF9B] rounded px-12 py-5">
        <header>
          <Brush
            color="white"
            width={50}
            height={50}
            className="mx-auto mb-5"
          />
        </header>
        <form onSubmit={onSubmit}>
          {error && (
            <span className="text-sm text-[#995F2F]">{error.error}</span>
          )}
          <div>
            <label className="block mb-2 text-[#FAF9EE]" htmlFor="email">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 text-[#FAF9EE] border-b-2 border-[#FAF9EE] outline-none"
              type="email"
              name="email"
              placeholder="write your Email?"
            />
            {error &&
              error.details &&
              error.details.some((d) => d.name === "email") && (
                <span className="text-sm text-[#995F2F]">
                  {error.details[0].message}
                </span>
              )}
          </div>
          <div>
            <label
              className="block mb-2 mt-6 text-[#FAF9EE]"
              htmlFor="username"
            >
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value.trim().toLowerCase())}
              className="w-full p-2 text-[#FAF9EE] border-b-2 border-[#FAF9EE] outline-none"
              type="text"
              name="username"
              placeholder="write your Username?"
            />
            {error &&
              error.details &&
              error.details.some((d) => d.name === "username") && (
                <span className="text-sm text-[#995F2F]">
                  {error.details[0].message}
                </span>
              )}
          </div>
          <div>
            <label
              className="block mb-2 mt-6 text-[#FAF9EE]"
              htmlFor="password"
            >
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-6 text-[#FAF9EE] border-b-2 border-[#FAF9EE] outline-none"
              type="password"
              name="password"
              placeholder="write your Password?"
            />
            {error &&
              error.details &&
              error.details.some((d) => d.name === "password") && (
                <span className="text-sm text-[#995F2F]">
                  {error.details[0].message}
                </span>
              )}
          </div>
          <div>
            <input
              className="w-full bg-[#DCCFC0] hover:bg-[#DCCFC0] text-white font-bold py-2 px-4 mb-6 rounded"
              type="submit"
              disabled={disabled}
              value={loading ? "Loading..." : "Create Account"}
            />
          </div>
        </form>
        <footer>
          <NavLink
            className="text-[#FAF9EE] hover:text-[#DCCFC0] text-sm float-right"
            to="/login"
          >
            Already Have an Account?
          </NavLink>
        </footer>
      </div>
    </div>
  );
};

export default Register;
