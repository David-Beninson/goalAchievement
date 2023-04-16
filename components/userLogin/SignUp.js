import React, { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { HiAtSymbol, HiFingerPrint, HiOutlineUser } from "react-icons/hi";
import { registerValidate } from "../../lib/validate";
import styles from "../../styles/Form.module.css";
import Layout from "../../layout/layout";
import Link from "next/link";
const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: registerValidate,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    };

    const response = await fetch(
      "http://localhost:3000/api/auth/signup",
      options
    );
    const data = await response.json();
    console.log(data);
    if (data) {
      router.push("http://localhost:3000");
    }
  }

  return (
    <Layout className="">
      <section className="w-full mx-auto flex flex-col gap-9">
        <h1
          className="text-4xl font-serif"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Please register below
        </h1>

        <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
          <div
            className={`${styles.input_group} ${
              formik.errors.username && formik.touched.username
                ? styles.input_group_error
                : ""
            }`}
          >
            <input
              type="text"
              name="username"
              placeholder="Username"
              className={styles.input_text}
              {...formik.getFieldProps("username")}
            />
            <span className="icon flex items-center px-4">
              <HiOutlineUser size={25} />
            </span>
            {formik.errors.username && formik.touched.username && (
              <span className="text-rose-500">{formik.errors.username}</span>
            )}
          </div>

          <div
            className={`${styles.input_group} ${
              formik.errors.email && formik.touched.email
                ? styles.input_group_error
                : ""
            }`}
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input_text}
              {...formik.getFieldProps("email")}
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
                ? styles.input_group_error
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

          <div
            className={`${styles.input_group} ${
              formik.errors.confirmPassword && formik.touched.confirmPassword
                ? styles.input_group_error
                : ""
            }`}
          >
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className={styles.input_text}
              {...formik.getFieldProps("confirmPassword")}
            />
            <span
              className="icon flex items-center px-4"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <HiFingerPrint size={25} />
            </span>
            {formik.errors.confirmPassword &&
              formik.touched.confirmPassword && (
                <span className="text-rose-500">
                  {formik.errors.confirmPassword}
                </span>
              )}
          </div>
          <button type="submit" className={styles.button}>
            Sign Up
          </button>
        </form>
        <div className="text-center text-gray-400 ">
          Have an account?{" "}
          <Link href={"/Login"} className="text-blue-700">
            Sign In
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default SignUp;
