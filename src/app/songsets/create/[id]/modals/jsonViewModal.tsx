'use client'

import { Button } from "@/app/components/button/Button"
import Modal from "@/app/components/modal"
import { Textarea } from "@/app/components/textarea"
import { useState } from "react"
import toast from "react-hot-toast"

type JsonViewModalProps = {
  songSetId: number;
  closeModal: (isModalOpen: boolean) => void;
  handleGetSongSet: (id: number, generateJson: boolean) => Promise<SongSet | null>
}

type JsonResult = {
  video: string;
  images: string;
  description: string;
}

export function JsonViewModal({ songSetId, closeModal, handleGetSongSet }: JsonViewModalProps) {
  const [jsonsResult, setJsonsResult] = useState<JsonResult>({
    video: '',
    images: '',
    description: ''
  });

  async function getSongSetWithJson() {
    try {
      const response = await handleGetSongSet(songSetId, true);
      let videoJson = '';


      response?.generateVideoObject?.map((v) => {
        videoJson += JSON.stringify(v, undefined, 2)
      })

      let imageJson = JSON.stringify(response?.generateImageObject, undefined, 2)
      
      setJsonsResult({
        description: '',
        video: videoJson,
        images: imageJson
      })
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong!")
    }
  }

  return (
    <Modal
      title="Results"
      className="modalResult lg"
      closeModal={closeModal}
    >
      <div className="textAreasJson">
        <Textarea
          displayName="JSON Images"
          name="jsonimages"
          content={jsonsResult.images}
          className="textImage"
        />

        <Textarea
          displayName="JSON Video"
          name="jsonvideo"
          content={jsonsResult.video}
          className="textVideo">
        </Textarea>

        <Textarea
          displayName="JSON Description"
          name="jsondescription"
          content={jsonsResult.description}
          className="textDesc">
        </Textarea>
      </div>
      <Button
        name="Generate Json"
        className="generateButton"
        onClick={getSongSetWithJson}
      />
    </Modal>
  )
}