import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { authClient, guestClient } from "../../../utils/fauna-client";
import { getAuthCookie } from "../../../utils/auth-cookies";

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
    rewards: string[],
    tasks: string[],
    badges: string[],
  }
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
      
      
      const departmentTotalScore:any = [];




      Array.from(new Set(players?.data?.map(x => x?.data?.department))).forEach(x => {
        departmentTotalScore.push(
          players?.data
            ?.filter(y => y?.data?.department === x)
            .reduce((item) => {
              const departmentSum = players?.data
                ?.filter(y => y?.data?.department === x)
                .reduce((a, b) => +a + +b?.data?.score, 0);
              const countDepartment = players?.data?.filter(
                item => item?.data?.department === x,
              ).length;
              const average = Math.ceil(departmentSum / countDepartment);
              const data = {
                department: x,
                average: average
              }
              return data;
            }, {}),
        );
      });

      const departmentRank = [];

      if (departmentTotalScore) {
        for (const key in departmentTotalScore) {
          departmentRank.push(departmentTotalScore[key]);
        }

        departmentRank.sort(function (a, b) {
          return b.average - a.average;
        });

        let rank = 1;
        for (let i = 0; i < departmentRank.length; i++) {
          if (
            i > 0 &&
            departmentRank[i].average < departmentRank[i - 1].average
          ) {
            rank++;
          }
          departmentRank[i].position = rank;
        }
      }

      departmentTotalScore.sort((a:any, b:any) => parseFloat(a.position) - parseFloat(b.position));
      const top3 = departmentTotalScore.slice(0,3)




      // ok
      res.status(200).json(top3);
      //console.log(players.data)
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
};
