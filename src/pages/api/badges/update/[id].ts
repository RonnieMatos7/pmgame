import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { authClient, guestClient } from "../../../../utils/fauna-client";
import { getAuthCookie } from "../../../../utils/auth-cookies";


type Badge = {
  ref: {
      id: string;
  }
  data: {
    title: string,
    score: number,
    icon: number,
    score_extract:[]
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<Badge |any >) => {
  const token = getAuthCookie(req);
  
  if (!token) {
    return res.status(401).send('Auth cookie not found');
  }
  
  if(req.method === 'PUT'){

      
    const {query: { id },} = req;

    const { title, score, description, updated_at } = req.body.badge;
    
    try {
      const updateBadge = await authClient(process.env.FAUNA_GUEST_SECRET).query<Badge | any>(
        q.Update(
          q.Ref(
            q.Collection('Badge'), id),
              {
                data: {
                  title,
                  score,
                  description,
                  updated_at
                },
              },
          )
      );

      
      // ok
      res.status(200).json(updateBadge.data)
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'PUT')
    res.status(405).end('Method not allowed')
}
};