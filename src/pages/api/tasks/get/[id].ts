import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { authClient, guestClient } from "../../../../utils/fauna-client";
import { getAuthCookie } from "../../../../utils/auth-cookies";


type Badge = {
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

export default async (req: NextApiRequest, res: NextApiResponse<Badge |any >) => {
  const token = getAuthCookie(req);
  
  if (!token) {
    return res.status(401).send('Auth cookie not found');
  }
  
  if(req.method === 'GET'){

      
    const {query: { id },} = req;

    
    
    try {
      const getTask = await authClient(process.env.FAUNA_GUEST_SECRET).query<Badge>(
        q.Get(
          q.Ref(
            q.Collection('Task'), id
          )
        )
      );

      
      // ok
      res.status(200).json(getTask.data)
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method not allowed')
}
};