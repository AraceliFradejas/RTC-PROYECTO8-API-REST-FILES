import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDatabase } from '../config/database.js'
import { songSeedData } from '../data/songSeedData.js'
import { surpriseSongSeedData } from '../data/surpriseSongSeedData.js'
import Song from '../models/Song.js'

const allSongSeedData = [...songSeedData, ...surpriseSongSeedData].map(
  (song) => ({
    ...song,
    ...buildStreamingLinks(song),
    sources: song.sources.map((source) => ({
      ...source,
      accessedAt: new Date(source.accessedAt)
    }))
  })
)

function buildStreamingLinks({ title, artist, album }) {
  const query = encodeURIComponent(`${title} ${artist} ${album}`)

  return {
    spotifyUrl: `https://open.spotify.com/search/${query}`,
    appleMusicUrl: `https://music.apple.com/es/search?term=${query}`,
    amazonMusicUrl: `https://music.amazon.com/search/${query}`
  }
}

const validateSeedData = async () => {
  const normalizedTitles = allSongSeedData.map((song) =>
    song.title.trim().toLocaleLowerCase('en')
  )
  const duplicateTitles = normalizedTitles.filter(
    (title, index) => normalizedTitles.indexOf(title) !== index
  )

  if (duplicateTitles.length > 0) {
    throw new Error(
      `Duplicate song titles in seed: ${[...new Set(duplicateTitles)].join(', ')}`
    )
  }

  await Promise.all(allSongSeedData.map((song) => new Song(song).validate()))
}

const seedSongs = async () => {
  try {
    await validateSeedData()
    await connectDatabase()

    const operations = allSongSeedData.map((song) => ({
      updateOne: {
        filter: { title: song.title },
        update: {
          $set: {
            artist: song.artist,
            album: song.album,
            era: song.era,
            releaseYear: song.releaseYear,
            spotifyUrl: song.spotifyUrl,
            appleMusicUrl: song.appleMusicUrl,
            amazonMusicUrl: song.amazonMusicUrl,
            sources: song.sources
          },
          $setOnInsert: {
            title: song.title,
            image: null
          }
        },
        upsert: true,
        timestamps: false
      }
    }))

    const result = await Song.bulkWrite(operations)

    console.log(`Song seed checked: ${allSongSeedData.length}`)
    console.log(`Songs created: ${result.upsertedCount}`)
    console.log(`Songs updated: ${result.modifiedCount}`)
  } catch (error) {
    console.error('Song seed failed:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedSongs()
