"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { api } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/lib/axios";

interface GoogleAuthResponse {
  auth_url: string;
  [property: string]: any;
}

export function GoogleSignInButton({
  isRegister = false,
  className,
}: {
  isRegister?: boolean;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/google");
      const data = await response.json();

      if (data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        throw new Error("获取登录链接失败");
      }
    } catch (error) {
      toast({
        title: "Google登录失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      className={className}
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.google className="mr-2 h-4 w-4" />
      )}
      Google账号{isRegister ? "注册" : "登录"}
    </Button>
  );
}
