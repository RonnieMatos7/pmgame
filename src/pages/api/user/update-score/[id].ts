import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { authClient, guestClient } from "../../../../utils/fauna-client";
import { getAuthCookie } from "../../../../utils/auth-cookies";
import { create } from "domain";

type Month = {
  [key: string]:{
    title: string,
    score: number,
    created_at:string
  }
}


type Task ={
  month: string,
  day: string,
  title:string,
  score:number,

}
type Player = {
  ref: {
      id: string;
  }
  data: {
    name: string,
    role: string,
    image_url: string,
    score: number,
    tasks: [],
    badges: [],
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<Player |any >) => {
  const token = getAuthCookie(req);
  
  if (!token) {
    return res.status(401).send('Auth cookie not found');
  }
  
  if(req.method === 'PUT'){

      
    const {query: { id },} = req;
    const { score, month, title, created_at, type } = req.body.task;
    console.log(type)
    
    try {
      const player = await authClient(process.env.FAUNA_GUEST_SECRET).query<Player>(
        q.Get(q.Ref(q.Collection('User'), id))
        );
      

      const newScore = Number(player.data.score) + Number(score)

      if(type === 'badge') {
        const updateUser = await authClient(process.env.FAUNA_GUEST_SECRET).query<Player>(
          q.Update(q.Ref(q.Collection('User'), id), {
            data: {
              score: newScore,
              badges: [
                ...player.data.badges,
                {
                  month,
                  title,
                  created_at,
                  score
                }
              ],
            },
          })
        )
        res.status(200).json(updateUser.data)
      } else {
        const updateUser = await authClient(process.env.FAUNA_GUEST_SECRET).query<Player>(
          q.Update(q.Ref(q.Collection('User'), id), {
            data: {
              score: newScore,
              tasks: [
                ...player.data.tasks,
                {
                  month,
                  title,
                  created_at,
                  score
                }
              ],
            },
          })
          )
          res.status(200).json(updateUser.data)
      }

      
      // ok
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'PUT')
    res.status(405).end('Method not allowed')
}
};