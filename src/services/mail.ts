import sendgrid from '@sendgrid/mail'

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

export async function sendEmail(to: string, subject: string, body:string) {

  const text = `
  <div style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-heigth:1.6; color:#222; max-width: 600px">
    ${body}
    
    <br />
    Equipe PMO EAC
  </div>`

  const msg = {
    from: 'Gamificação PMO <game-asgp@wowstudios.com.br>',
    to,
    subject,
    html: text,
  }

  sendgrid.send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })

  

}