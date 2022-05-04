import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { authClient, guestClient } from "../../../utils/fauna-client";
import { getAuthCookie } from "../../../utils/auth-cookies";


type Badge = {

  title: string,
  score: number,
  stars: number,
  description: string,
  created_at: Date
  
}

export default async (req: NextApiRequest, res: NextApiResponse<Badge[] | any >) => {
  const token = getAuthCookie(req);
  
  if (!token) {
    return res.status(401).send('Auth cookie not found');
  }
  
  if(req.method === 'POST'){

    
    const { title, description, score, frequency, created_at } = req.body.task;
    
    
    try {
      const createBadge = await authClient(process.env.FAUNA_GUEST_SECRET).query<Badge>(
        q.Create(q.Collection('Task'), {
          data: {
            title,
            score,
            frequency,
            description,
            created_at,
          },
        })
      );

      
      // ok
      res.status(200).end();
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
}
};