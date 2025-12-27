"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register, handleSubmit, formState:{errors} } =
    useForm<FormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (data: FormData) => {
    console.log(data);
    window.location.href = "/login";
  };

  return (
    <div className="container">
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="label">Name</label>
        <input {...register("name")} />
        <p className="error">{errors.name?.message}</p>

        <label className="label">Email</label>
        <input {...register("email")} />
        <p className="error">{errors.email?.message}</p>

        <label className="label">Password</label>
        <input type="password" {...register("password")} />
        <p className="error">{errors.password?.message}</p>

        <button type="submit">Register</button>
      </form>

      <p>Already have account? <a href="/login">Login</a></p>
    </div>
  );
}
