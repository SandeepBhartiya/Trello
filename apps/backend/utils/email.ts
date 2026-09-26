import nodemailer from "nodemailer";

export const sendNotification=async(to:string,subject:string,html:string)=>{
    try{
        const transporter=nodemailer.createTransport({
            host:process.env.SMTP_HOST || "smtp.gmail.com",
            port:Number(process.env.SMTP_PORT)||587,    
            secure:false,
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASS
            }
        });
        
        return await transporter.sendMail({
            from:`"Trello App" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
    }catch(err){
        console.error(err);
    }
}

export const sendInviteEmail=async(to:string,orgName:string,inviteLink:string )=>{
    try{
        const subject=`You have been invited to join ${orgName}`;
        const html=`<div style="font-family:sans-serif; max-width:480px">
                    <h2>You've been invited to join ${orgName}</h2>
                    <p>Click the button below to accept the invite</p>
                    <a href="${inviteLink}" style="display:inline-block; padding:10px 20px; background:#111; color:#fff;"> Accept Invite</a>
                    <p style="color:#888; font-size:12px; margin-top:16px">If you didn't request an invite, you can safely ignore this email.</p>
                    </div>`;
        return await sendNotification(to,subject,html);
    }catch(err){
        console.error(err);
    }
}