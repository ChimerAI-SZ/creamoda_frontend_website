"use server";

import { signIn } from "next-auth/react";

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: "登录失败，请稍后重试",
    };
  }
}

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}): Promise<LoginResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: "注册失败，请稍后重试",
    };
  }
}

export async function googleAuth(): Promise<LoginResponse> {
  try {
    const result = await signIn("google", {
      callbackUrl: "/dashboard",
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        message: "Google登录失败，请稍后重试",
      };
    }

    return {
      success: true,
      message: "登录成功",
    };
  } catch (error) {
    return {
      success: false,
      message: "Google登录失败，请稍后重试",
    };
  }
}
