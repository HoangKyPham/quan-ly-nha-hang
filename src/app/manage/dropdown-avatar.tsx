"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAccountQuery } from "@/queries/useAccount";
import { handleErrorApi } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/app-provider";
import Link from "next/link";
import { useLogoutMutation } from "@/queries/useAuth";

export default function DropdownAvatar() {
  const { setIsAuth, isAuth } = useAppContext();
  const { data } = useAccountQuery({
    enabled: isAuth,
  });
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
  const account = data?.payload.data;
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync({
        refreshToken: localStorage.getItem("refreshToken") as string,
      });
      router.push("/");
      setIsAuth(false);
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  if (!account) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarImage src={account.avatar ?? undefined} alt={account.name} />
            <AvatarFallback>
              {account.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{account.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/manage/setting"} className="cursor-pointer">
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
