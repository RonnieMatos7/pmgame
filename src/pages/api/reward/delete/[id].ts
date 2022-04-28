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
  
  if(req.method === 'DELETE'){

      
    const {query: { id },} = req;

    console.log(id)
    
    try {
      const deleteUser = await authClient(process.env.FAUNA_GUEST_SECRET).query<Player>(
        q.Delete(
          q.Ref(
            q.Collection('Reward'), id
          )
        )
      );

      
      // ok
      res.status(200).end()
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'DELETE')
    res.status(405).end('Method not allowed')
}
};