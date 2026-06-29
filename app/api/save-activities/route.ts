import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const filePath = path.join(
  process.cwd(),
  'public',
  'activities.json'
)

export async function POST(
  req: Request
) {

  try {

    const newActivities =
      await req.json()

    let existing = []

    // READ OLD FILE

    if (
      fs.existsSync(filePath)
    ) {

      const fileData =
        fs.readFileSync(
          filePath,
          'utf-8'
        )

      existing =
        JSON.parse(
          fileData || '[]'
        )

    }

    // MERGE OLD + NEW

    const merged = [

      ...newActivities,

      ...existing,

    ]

    // REMOVE DUPLICATES

    const unique =
      merged.filter(
        (
          item,
          index,
          self
        ) =>

          index ===
          self.findIndex(
            (a) =>

              a.date === item.date &&

              a.title === item.title
          )
      )

    // SAVE FINAL

    fs.writeFileSync(

      filePath,

      JSON.stringify(
        unique,
        null,
        2
      )

    )

    return NextResponse.json({
      success: true
    })

  } catch (error) {

    console.log(error)

    return NextResponse.json({

      success: false

    })

  }

}