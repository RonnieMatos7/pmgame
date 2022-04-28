import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { authClient, guestClient } from "../../../../utils/fauna-client";
import { getAuthCookie } from "../../../../utils/auth-cookies";


type Player = {
  ref: {
      id: string;
  }
  data: {
    name: string,
    role: string,
    image_url: string,
    score: number,
    score_extract:[]
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<Player |any >) => {
  const token = getAuthCookie(req);
  
  if (!token) {
    return res.status(401).send('Auth cookie not found');
  }
  
  if(req.method === 'PUT'){

      
    const {query: { id },} = req;

    const { title, score, updated_at } = req.body.reward;
    
    try {
      const updateReward = await authClient(process.env.FAUNA_GUEST_SECRET).query<Player>(
        q.Update(
          q.Ref(
            q.Collection('Reward'), id),
              {
                data: {
                  title,
                  score,
                  updated_at
                },
              },
          )
      );

      
      // ok
      res.status(200).json(updateReward.data)
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'PUT')
    res.status(405).end('Method not allowed')
}
};