import { NextRequest } from "next/server"; // Import for type safety
import nodemailer from "nodemailer";

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NEXT_GMAIL,
    pass: process.env.NEXT_GMAIL_APP_PASSWORD,
  },
});

// Named export for POST method
export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body from the request
    const data = await request.json();
    console.log("Received values:", data);

    // Define email options
    const mailOptions = {
      from: data.email,
      to: process.env.NEXT_GMAIL,
      subject: `Support request from ${data.firstName} ${data.lastName} -- ${data.messageType}`,
      html: `
      <p><b>First Name:</b> ${data.firstName}</p>
      <p><b>Last Name:</b> ${data.lastName}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Mobile Number:</b> ${data.phoneNumber}</p>
        
        <h5>Message:</h5> 
        <p>${data.message}</p>
      `,
    };

    // Send email and handle the callback with a promise
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          console.log("Email sent:", info.response);
          resolve(info);
        }
      });
    });

    // Return success response
    return new Response(JSON.stringify({ message: "Success!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST /api/help:", error);
    // Return error response
    return new Response(JSON.stringify({ message: "Error sending email" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}