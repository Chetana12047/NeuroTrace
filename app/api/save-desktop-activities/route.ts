import { NextResponse } from 'next/server'
console.log(
  'ROUTE HIT'
)

import fs from 'fs'
import path from 'path'

const filePath = path.join(
  process.cwd(),
  'public',
  'activities.json'
)

export async function POST(
  request: Request
) {

  try {

    const activity =
      await request.json()

    let existing = []

    if (
      fs.existsSync(filePath)
    ) {

      const fileData =
        fs.readFileSync(
          filePath,
          'utf-8'
        )

      existing =
        JSON.parse(fileData)

    }

    existing.push(activity)

    fs.writeFileSync(
      filePath,
      JSON.stringify(
        existing,
        null,
        2
      )
    )

    console.log(
      'Desktop activity saved:',
      activity
    )

    return NextResponse.json({
      success: true,
    })

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    )

  }

}