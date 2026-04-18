import { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function GET(request: NextRequest) {
const tag = request.nextUrl.searchParams.get('tag')
if (!tag) {
return Response.json({ revalidated: false, message: 'Missing tag' }, { status: 400 })
}

revalidateTag(tag, 'max')
return Response.json({ revalidated: true, now: Date.now(), tag })
}