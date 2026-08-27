import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDatabase } from '../config/database.js'
import { concertSeedData } from '../data/concertSeedData.js'
import { postTtpdSetlist, preTtpdSetlist } from '../data/regularSetlists.js'
import Concert from '../models/Concert.js'
import Song from '../models/Song.js'

const ttpdPremiereDate = '2024-05-09'
const invisibleStringException = '2023-05-06'
const floridaDates = new Set([
  '2024-08-20',
  '2024-10-18',
  '2024-10-19',
  '2024-10-20'
])

const normalizeTitle = (title) => title.trim().toLocaleLowerCase('en')

const getTourLeg = (country) => {
  if (['United States', 'Mexico', 'Canada'].includes(country)) {
    return 'North America'
  }

  if (['Argentina', 'Brazil'].includes(country)) return 'South America'
  if (['Japan', 'Singapore'].includes(country)) return 'Asia'
  if (country === 'Australia') return 'Oceania'
  return 'Europe'
}

const insertAfter = (titles, reference, title) => {
  const index = titles.indexOf(reference)
  titles.splice(index + 1, 0, title)
}

const insertBefore = (titles, reference, title) => {
  const index = titles.indexOf(reference)
  titles.splice(index, 0, title)
}

const getRegularSetlist = ({ date, openingActs }) => {
  if (date >= ttpdPremiereDate) {
    const titles = [...postTtpdSetlist]

    if (floridaDates.has(date)) {
      insertBefore(titles, "Who's Afraid of Little Old Me?", 'Florida!!!')
    }

    return titles
  }

  const titles = [...preTtpdSetlist]

  if (date >= '2023-03-31' && date !== invisibleStringException) {
    titles[titles.indexOf('invisible string')] = 'the 1'
  }

  if (openingActs.includes('Phoebe Bridgers')) {
    insertBefore(titles, 'All Too Well (10 Minute Version)', 'Nothing New')
  }

  if (date >= '2023-07-07') {
    insertAfter(titles, 'Enchanted', 'Long Live')
  }

  if (openingActs.includes('Haim')) {
    titles[titles.indexOf("'tis the damn season")] = 'no body, no crime'
  }

  return titles
}

const resolveSongIds = (titles, songsByTitle) =>
  titles.map((title) => {
    const songId = songsByTitle.get(normalizeTitle(title))

    if (!songId) throw new Error(`Song not found in catalog: ${title}`)
    return songId
  })

const buildConcert = (concert, index, songsByTitle) => ({
  city: concert.city,
  country: concert.country,
  venue: concert.venue,
  date: new Date(`${concert.date}T00:00:00.000Z`),
  tourLeg: getTourLeg(concert.country),
  openingActs: concert.openingActs,
  showNumber: index + 1,
  setlistVersion: concert.date >= ttpdPremiereDate ? 'post-ttpd' : 'pre-ttpd',
  regularSongs: resolveSongIds(getRegularSetlist(concert), songsByTitle),
  surprisePerformances: concert.surprisePerformances.map((performance) => ({
    order: performance.order,
    instrument: performance.instrument,
    songs: resolveSongIds(performance.songTitles, songsByTitle),
    guests: performance.guests,
    notes: performance.notes
  })),
  sources: concert.sources.map((source) => ({
    ...source,
    accessedAt: new Date(source.accessedAt)
  })),
  notes: null
})

const validateConcertData = (concerts) => {
  if (concerts.length !== 149) throw new Error('The seed must contain 149 shows')

  const uniqueDates = new Set(concerts.map(({ date }) => date.toISOString()))
  if (uniqueDates.size !== concerts.length) {
    throw new Error('The concert seed contains duplicate dates')
  }

  if (
    concerts[0].date.toISOString().slice(0, 10) !== '2023-03-17' ||
    concerts.at(-1).date.toISOString().slice(0, 10) !== '2024-12-08'
  ) {
    throw new Error('The first or last tour date is incorrect')
  }
}

const seedConcerts = async () => {
  try {
    await connectDatabase()

    const songs = await Song.find({}, '_id title').lean()
    const songsByTitle = new Map(
      songs.map((song) => [normalizeTitle(song.title), song._id])
    )
    const concerts = concertSeedData.map((concert, index) =>
      buildConcert(concert, index, songsByTitle)
    )

    validateConcertData(concerts)
    await Promise.all(concerts.map((concert) => new Concert(concert).validate()))

    const operations = concerts.map((concert) => ({
      updateOne: {
        filter: { date: concert.date },
        update: {
          $set: concert,
          $setOnInsert: { image: null }
        },
        upsert: true,
        timestamps: false
      }
    }))
    const result = await Concert.bulkWrite(operations)

    console.log(`Concert seed checked: ${concerts.length}`)
    console.log(`Concerts created: ${result.upsertedCount}`)
    console.log(`Concerts updated: ${result.modifiedCount}`)
  } catch (error) {
    console.error('Concert seed failed:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedConcerts()
