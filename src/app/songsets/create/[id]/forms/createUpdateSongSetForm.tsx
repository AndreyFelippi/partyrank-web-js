'use client'
import { Button } from "@/app/components/button/Button";
import { Input } from "@/app/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSongSetSchema } from "../../../validations/songSetValidations";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import { LoadingComponent } from "@/app/components/loading-component";

type createUpdateSongSetFormProps = {
  songSet: SongSet;
  updateSetSongSet: (name: string, id: number) => void;
  handleCreateFormSubmit: ({ }: SongSetPostData) => Promise<number | boolean>;
  buttonName: string;
}

export function CreateUpdateSongSetForm({ songSet, handleCreateFormSubmit, updateSetSongSet, buttonName }: createUpdateSongSetFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<SongSetPostData>({
    resolver: zodResolver(createSongSetSchema)
  });
  const [isLoading, setIsLoadind] = useState<boolean>(false);

  async function onSubmitHandleCreateSongSet(data: SongSetPostData) {
    try {
      setIsLoadind(true);
      data.id = songSet.id;
      const id = await handleCreateFormSubmit(data)

      const newOrUp = data.id == 0 ? "created" : "updated"
      if (id) {
        updateSetSongSet(songSet.name, Number(id))
        toast.success(`Song set ${newOrUp} successfully`)
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoadind(false);
    }
  }

  function onNameInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateSetSongSet(e.target.value, songSet.id)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandleCreateSongSet)} className="formSongSet">
      {isLoading && <LoadingComponent />}
      <Input
        displayName="Name"
        placeholder="All Mawaru Penguindrum songs..."
        errorMessage={errors.name?.message}
        {...register("name")}
        defaultValue={songSet.name}
        value={songSet.name}
        onChange={onNameInputChange}
      />
      <Button
        name={buttonName}
        type="submit"
      />
    </form>
  )
}