"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemas";
import { z } from "zod";

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { register, handleSubmit, formState:{errors} } =
    useForm<FormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: FormData) => {
    console.log(data);
    window.location.href = "/auth/dashboard";
  };

  return (
    <div className="container">
      <h1>Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="label">Email</label>
        <input {...register("email")} placeholder="email" />
        <p className="error">{errors.email?.message}</p>

        <label className="label">Password</label>
        <input type="password" {...register("password")} />
        <p className="error">{errors.password?.message}</p>

        <button type="submit">Login</button>
      </form>

      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
}
