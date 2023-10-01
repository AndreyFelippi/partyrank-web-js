'use client'
import { useState } from "react";
import { Globe, Mic2, Monitor, Plus, X } from "lucide-react";
import Link from "next/link";
import { SongFinderForm } from "@/app/components/songfinder/songFinderForm";
import { Table, TableRow } from "../table";

type SongFinderClientPageProps = {
  actions: boolean;
  songsFind: SongWeb[]
  handleSongFinderFormSubmit: (data: SongFinderAction) => Promise<SongWeb[]>
  addSongFromSongFinder?: (song: SongWeb) => void
  populateTableSongsWeb?: (songs: SongWeb[]) => void
}

export default function SongFinderComponent({ handleSongFinderFormSubmit, actions, addSongFromSongFinder, populateTableSongsWeb, songsFind }: SongFinderClientPageProps) {

  return (
    <>
      <SongFinderForm
        handleSongFinderFormSubmit={handleSongFinderFormSubmit}
        populateTableSongsWeb={populateTableSongsWeb}
      />
      <div className="result">
        <Table>
          {
            songsFind.map((song) => {
              return (
                <TableRow>
                  <div className='info'>
                    <span>{`${song.artist} - ${song.title}`}</span>
                    <div className="extraInfo">
                      <span>
                        <Monitor />
                        {song.anime}
                      </span>
                      <span>
                        <Mic2 />
                        {song.type}
                      </span>
                      <span>
                        <Globe />
                        <Link href={song.video?.link!} target="_blank">
                          {song.video?.link}
                        </Link>
                      </span>
                    </div>
                  </div>
                  {
                    (actions && addSongFromSongFinder) &&
                    <div className='actions'>
                      <Plus className="icon" onClick={() => { addSongFromSongFinder(song) }} />
                      <X className="icon" />
                    </div>
                  }
                </TableRow>
              )
            })
          }
        </Table>
      </div>
    </>
  )
}