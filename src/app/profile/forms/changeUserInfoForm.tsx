'use client'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/button/Button";
import { Input } from "@/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeUserInfoSchema } from "./validations/profileValidations";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoadingComponent } from "@/components/loading-component";
import { handleUpdateUserInfoForm } from "@/handlers/user.handlers";
import { translate } from "@/translate/pt_BR";

type ChangeAnimeListFormProps = {
  user: User;
}

export type ChangeUserInfoFormSchema = {
  username: string;
  animelist: string;
}

type fields = "username" | "animelist"

export function ChangeUserInfoForm({ user }: ChangeAnimeListFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ChangeUserInfoFormSchema>({
    resolver: zodResolver(changeUserInfoSchema)
  });
  const [userInput, setUserInput] = useState<ChangeUserInfoFormSchema>({ username: user.username, animelist: user.animeList })
  const [isLoading, setIsLoadind] = useState<boolean>(false);

  const { data: session, update } = useSession();

  const route = useRouter();

  if (!session) return;

  async function onSubmitFormUserInfo(data: ChangeUserInfoFormSchema) {
    try {
      setIsLoadind(true);
      const response = await handleUpdateUserInfoForm({
        animelist: data.animelist,
        username: data.username
      }, user.id)

      if (response) {
        await update({
          ...session,
          user: {
            ...session?.user,
            animeList: data.animelist,
            username: data.username
          }
        })
        toast.success("User info updated successfully")
        route.refresh()
      }

    } catch (error) {
      toast.error("Username already in use")
    } finally {
      setIsLoadind(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const key: fields = e.target.name as fields
    setValue(key, e.target.value)
    setUserInput({
      ...userInput,
      [key]: e.target.value
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmitFormUserInfo)} className="formAnimeList">
      {isLoading && <LoadingComponent />}
      <div className="inputs">
        <Input
          displayName={translate.username}
          placeholder="xxSuperNarutoxx"
          {...register("username")}
          value={userInput.username}
          onChange={onInputChange}
          errorMessage={errors.username?.message}
        />
        <Input
          displayName={translate.animelist}
          placeholder="https://myanimelist.net/profile/elonmusk"
          {...register("animelist")}
          value={userInput.animelist}
          onChange={onInputChange}
          errorMessage={errors.animelist?.message}
        />
      </div>
      <Button
        name="Update"
        className="updateAnimeListButton"
      />
    </form>
  )
}