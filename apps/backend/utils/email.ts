import {Resend } from "resend";

const resend=new Resend(process.env.RESEND_API_KEY);

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
export const sendNotification=async(to:string,subject:string,html:string)=>{
    try{
        return await resend.emails.send({
            from:'Trello App <onboarding@resend.dev>',
            to,
            subject,
            html,
        });
    }catch(err){
        console.error(err);
    }
}