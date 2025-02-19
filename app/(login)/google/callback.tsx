"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { api } from "@/lib/axios";
import { ApiResponse } from "@/lib/axios";

interface GoogleCallbackResponse {
  success: boolean;
  message?: string;
  token?: string;
}

export function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("正在处理Google登录...");

  useEffect(() => {
    const processGoogleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        setStatus("error");
        setMessage("Google登录失败，请重试");
        setTimeout(() => router.push("/sign-in"), 2000);
        return;
      }

      if (!code) {
        setStatus("error");
        setMessage("无效的请求");
        setTimeout(() => router.push("/sign-in"), 2000);
        return;
      }

      try {
        const response = await api.get<GoogleCallbackResponse>(
          `/api/v1/auth/callback?code=${code}`,
          {
            headers: {
              Accept: "application/json",
            },
            withCredentials: true,
          }
        );

        console.log("Callback response:", response);

        if (response && response.data) {
          const data = response.data;
          if (data.success) {
            setStatus("success");
            setMessage("登录成功，正在跳转...");
            if (data.token) {
              localStorage.setItem("token", data.token);
            }
            setTimeout(() => router.push("/dashboard"), 1000);
          } else {
            throw new Error(data.message || "登录失败");
          }
        } else {
          throw new Error("无效的响应格式");
        }
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "登录失败，请重试");
        setTimeout(() => router.push("/sign-in"), 2000);
      }
    };

    processGoogleCallback();
  }, [router, searchParams]);

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Google 登录</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        {status === "loading" && (
          <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
        )}
        {status === "success" && (
          <Icons.check className="h-8 w-8 text-green-500" />
        )}
        {status === "error" && <Icons.close className="h-8 w-8 text-red-500" />}
        <p className="text-center text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
