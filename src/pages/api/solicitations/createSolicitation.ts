import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { sendEmail } from "../../../services/mail";
import { authClient } from "../../../utils/fauna-client";

type Solicitation = {
  ref: {
      id: string;
  },
  ts: string,
  data: {
    title: string,
    player: {
      id: string,
      name: string,
      image_url: string
    },
    score: string,
    month: string,
    description: string;
    status: string
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<Solicitation[] | any >) => {
  if(req.method === 'POST'){
    const { player, title, score, month, description, pmo_list, created_at, type } = req.body.solicitation.item;

    
    try {
      const solicitation = await authClient(process.env.FAUNA_GUEST_SECRET).query<Solicitation>(
        q.Create(q.Collection('Solicitation'), {
          data: {
            player,
            title,
            score,
            type,
            month,
            status: 'Aguardando aprovação',
            created_at
          },
        })
      );

      const {name, email} = player
      const date = new Date().toLocaleDateString("pt-BR")

      const emailSubject = `Nova solicitação de pontuação está aguardando aprovação`
      const emailBody = `<strong>Olá, PMO</strong>
      
      <p>${name} solicitou em ${date} o registro da pontuação para a seguinte entrega: </p>
      <p>
        <strong>Entrega: </strong> ${title} <br />
        <strong>Pontuação: </strong> ${score} <br />
        <strong>Mês de Referência: </strong> ${month} <br />

        <a href="https://game-asgp.vercel.app/solicitations/pending" >Clique aqui para visualizar</a>
        <br />
      </p>`

      sendEmail(
        'project.office@energisa.com.br',
        emailSubject,
        emailBody
      )
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