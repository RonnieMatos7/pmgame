import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { authClient, guestClient } from "../../../../utils/fauna-client";
import { getAuthCookie } from "../../../../utils/auth-cookies";

type PlayerRank = {
  data: {
    name: string,
    role: string,
    email: string,
    department: string,
    image_url: string ,
    created_at: string,
    position: number,
    score: number,
    old_position: number ,
    rewards: string[],
    tasks: string[],
    badges: string[],
  }
}
type Player = {
  ref: {
      id: string;
  }
  data: {
    name: string,
    role: string,
    email: string,
    department: string,
    image_url: string ,
    created_at: string,
    position: number,
    score: number,
    old_position: number ,
    position_log: {},
    rewards: string[],
    tasks: string[],
    badges: string[],
  }
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
}

export default async (req: NextApiRequest, res: NextApiResponse<Player[] | any >) => {
  const token = getAuthCookie(req);
  
  if (!token) {
    return res.status(401).send('Auth cookie not found');
  }

    try {
      const players = await guestClient.query<Player[] | any>(
        q.Map(
          q.Paginate(
            q.Match(
              q.Index('all_players'),
              'Jogador'
            )
          ),
          q.Lambda("X",
          q.Get(
            q.Var("X")
          ))
        )
      );


      
      const updatedPlayerPosition = players?.data.map(async item =>{
        const updateUserOldposition = await authClient(process.env.FAUNA_GUEST_SECRET).query<Player>(
          q.Update(q.Ref(q.Collection('User'), item.ref.id), {
            data: {
              old_position: item.data.position,
            },
          })
          )
      })


      let playersRank:Player[] = []

      for (let key in players?.data) {
        playersRank.push(players?.data[key]);
      }

      playersRank.sort(function (a:Player, b:Player) {
        return b.data.score - a.data.score;
      });

      let rank= 1
      for (let i = 0; i < playersRank.length; i++) {
        if (i > 0 && playersRank[i].data.score < playersRank[i - 1].data.score) {
          rank++;
        }
        playersRank[i].data.position = rank;
        
      }

      let finalRank = []

      

      const updatedPlayerRank = playersRank.map(async item =>{
        finalRank.push(`${item.data.position}: ${item.data.name}`)
        const today = formatDate(new Date())
        const newPositionLog = item.data.position
        const updateUserNewposition = await authClient(process.env.FAUNA_GUEST_SECRET).query<Player>(
          q.Update(q.Ref(q.Collection('User'), item.ref.id), {
            data: {
              position: item.data.position,
              position_log: {
                ...players?.data?.position_log, [today]:newPositionLog
                
              }
            },
          })
          )
      })




      // ok
      res.status(200).json(finalRank);
      //console.log(players.data)
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
};
