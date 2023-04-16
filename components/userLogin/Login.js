import React, { useState } from "react";
import { signIn } from "next-auth/react";
import styles from "../../styles/Form.module.css";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import login_validate from "../../lib/validate";
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";
import Layout from "../../layout/layout";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: login_validate,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    const { error, status } = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: "/",
    });

    if (error) {
      setErrorMessage(
        "Oops, something went wrong. Please check your email and password and try again."
      );
    } else if (status.ok || status == 200) {
      router.push("/");
    }
  }
  const closeErrorMessege = () => {
    setErrorMessage("");
  };

  return (
    <Layout>
      <section className="w-3/4 mx-auto flex flex-col gap-20">
        <h1
          className="text-3xl font-mono"
          style={{ fontFamily: "'Dancing Script'" }}
        >
          Welcome Back!
        </h1>
        {errorMessage && (
          <div
            className="position-absolute top-50% left-50% transform -translate-x-1/2 -translate-y-1/2 z-50 box-shadow rounded-md p-5 flex items-center"
            style={{ backgroundColor: "rgba(255, 0, 0, 0.8)" }}
          >
            <p className="text-white mr-5">{errorMessage}</p>
            <button className="text-white" onClick={closeErrorMessege}>
              X
            </button>
          </div>
        )}
        <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
          <div
            className={`${styles.input_group} ${
              formik.errors.email && formik.touched.email
                ? "border-rose-600"
                : ""
            }`}
          >
            <input
              name="email"
              type="email"
              placeholder="Email"
              className={styles.input_text}
              {...formik.getFieldProps("email")}
              required
            />
            <span className="icon flex items-center px-4">
              <HiAtSymbol size={25} />
            </span>
            {formik.errors.email && formik.touched.email && (
              <span className="text-rose-500">{formik.errors.email}</span>
            )}
          </div>

          <div
            className={`${styles.input_group} ${
              formik.errors.password && formik.touched.password
                ? "border-rose-600"
                : ""
            }`}
          >
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className={styles.input_text}
              {...formik.getFieldProps("password")}
            />
            <span
              className="icon flex items-center px-4"
              onClick={() => setShowPassword(!showPassword)}
            >
              <HiFingerPrint size={25} />
            </span>
            {formik.errors.password && formik.touched.password && (
              <span className="text-rose-500">{formik.errors.password}</span>
            )}
          </div>
          <div className="input-button">
            <button type="submit" className={styles.button}>
              Login
            </button>
          </div>
        </form>
        <div className="text-center text-gray-400 ">
          Don't have an account yet?{" "}
          <p>
            <a href={"/SignUp"} className="text-blue-700">
              Sign Up Now
            </a>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
