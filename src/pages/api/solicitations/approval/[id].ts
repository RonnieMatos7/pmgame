import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { sendEmail } from "../../../../services/mail";
import { authClient } from "../../../../utils/fauna-client";

type Solicitation = {
  ref: {
      id: string;
  }
  data: {
    player: {
      email: string,
      role: string,
      name: string,
      image_url: string,
      id:string,
    }
    title: string,
    player_id: string,
    score: string,
    month: string,
    status: string
    approval_data: {
      approvedBy:string,
      approvedDate:string,
    }
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<Solicitation[] | any >) => {
  if(req.method === 'PUT'){
    const {
      query: { id },
    } = req;
  
    const { status, approval_data } = req.body;
    

    
    try {
      const solicitationChangeApprovalStatus = await authClient(process.env.FAUNA_GUEST_SECRET).query<Solicitation>(
        q.Update(q.Ref(q.Collection('Solicitation'), id), {
          data: {
            status,
            approval_data,
          },
        })
      );

      const {name, email} = solicitationChangeApprovalStatus.data.player
      const {title, score, month} = solicitationChangeApprovalStatus.data
      const {approvedBy, approvedDate} = solicitationChangeApprovalStatus.data.approval_data

      const emailSubject = `A sua solicitação de pontuação foi ${status === 'Aprovado' ? 'aprovada!' : 'reprovada!'}`
      const emailBody = `<strong>Olá, ${name}</strong>
      <p>A sua solicitação de registro de pontuação abaixo foi ${status === 'Aprovado' ? 'aprovada!' : 'reprovada!'} por ${approvedBy}:</p>
      <p>
        <strong>Entrega: </strong> ${title} <br />
        <strong>Pontuação: </strong> ${score} <br />
        <strong>Mês de Referência: </strong> ${month} <br />
        <br />
      </p>`

      /* sendEmail(
        email,
        emailSubject,
        emailBody
      ) */

      res.status(200).end();
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'PUT')
    res.status(405).end('Method not allowed')
}
};