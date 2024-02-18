
import React from 'react'
type EmailTemplateProps = {
    name: string;
};

const EmailTemplate: React.FC<EmailTemplateProps> = ({ name }) => {
    console.log("inside email template check current name ->", name)
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
            <h1 style={{ color: '#4A90E2' }}>Hello {name},</h1>
            <p>Hope you're having a great day!</p>
            <p>We believe that keeping track of your daily mood can bring valuable insights into your life. It helps in understanding your emotional patterns and triggers, which is a step towards better mental health and wellbeing.</p>
            <p>We noticed you haven't logged today's mood yet. It only takes a minute, and the insights you'll gain are invaluable. Let's do it now!</p>
            <a href="http://localhost:3000/" style={{ display: 'inline-block', background: '#4A90E2', color: '#ffffff', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Log Your Mood</a>
            <p>If you have any questions or need assistance, feel free to reach out to us anytime.</p>
            <p>Stay positive and take care!</p>
            <p><strong>Your Mood Tracker Team</strong></p>
        </div>
    )
}

export default EmailTemplate
