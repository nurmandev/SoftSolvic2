import { supabase, isSupabaseConfigured } from "./supabase";

// Interface for email data
interface EmailData {
  to: string;
  subject: string;
  body: string;
  attachments?: any[];
}

// Function to send interview reminder emails
export async function sendInterviewReminder(
  userId: string,
  interviewId: string,
): Promise<boolean> {
  try {
    if (!isSupabaseConfigured()) {
      console.log("Supabase not configured, skipping email reminder");
      return true; // Pretend success in development
    }

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from("user_profiles")
      .select("email, full_name, email_notifications")
      .eq("user_id", userId)
      .single();

    if (userError || !userData || !userData.email_notifications) {
      console.error(
        "Error fetching user data or notifications disabled:",
        userError,
      );
      return false;
    }

    // Get interview data
    const { data: interviewData, error: interviewError } = await supabase
      .from("scheduled_interviews")
      .select("*")
      .eq("id", interviewId)
      .single();

    if (interviewError || !interviewData) {
      console.error("Error fetching interview data:", interviewError);
      return false;
    }

    // Format date and time
    const interviewDate = new Date(interviewData.scheduled_at);
    const formattedDate = interviewDate.toLocaleDateString();
    const formattedTime = interviewDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Prepare email data
    const emailData: EmailData = {
      to: userData.email,
      subject: `Reminder: Your Interview Session - ${interviewData.title}`,
      body: `
        <html>
          <body>
            <h2>Interview Reminder</h2>
            <p>Hello ${userData.full_name},</p>
            <p>This is a reminder about your upcoming interview session:</p>
            <ul>
              <li><strong>Title:</strong> ${interviewData.title}</li>
              <li><strong>Date:</strong> ${formattedDate}</li>
              <li><strong>Time:</strong> ${formattedTime}</li>
              <li><strong>Duration:</strong> ${interviewData.duration_minutes} minutes</li>
            </ul>
            <p>Please make sure you're prepared and in a quiet environment for your session.</p>
            <p>Good luck!</p>
            <p>AI Interview Coach Team</p>
          </body>
        </html>
      `,
    };

    // In a real implementation, you would send the email here
    // For now, we'll just log it and update the reminder_sent flag
    console.log("Sending email reminder:", emailData);

    // Update the reminder_sent flag
    const { error: updateError } = await supabase
      .from("scheduled_interviews")
      .update({ reminder_sent: true })
      .eq("id", interviewId);

    if (updateError) {
      console.error("Error updating reminder status:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending interview reminder:", error);
    return false;
  }
}

// Function to send interview results email
export async function sendInterviewResults(
  userId: string,
  resultId: string,
): Promise<boolean> {
  try {
    if (!isSupabaseConfigured()) {
      console.log("Supabase not configured, skipping results email");
      return true; // Pretend success in development
    }

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from("user_profiles")
      .select("email, full_name, email_notifications")
      .eq("user_id", userId)
      .single();

    if (userError || !userData || !userData.email_notifications) {
      console.error(
        "Error fetching user data or notifications disabled:",
        userError,
      );
      return false;
    }

    // Get result data
    const { data: resultData, error: resultError } = await supabase
      .from("interview_results")
      .select("*, interview_sessions(role)")
      .eq("id", resultId)
      .single();

    if (resultError || !resultData) {
      console.error("Error fetching result data:", resultError);
      return false;
    }

    // Generate PDF report (in a real implementation)
    // const pdfAttachment = await generatePDFReport(resultData);

    // Prepare email data
    const emailData: EmailData = {
      to: userData.email,
      subject: `Your Interview Results - ${resultData.interview_sessions?.role || "Interview"} Analysis`,
      body: `
        <html>
          <body>
            <h2>Interview Results</h2>
            <p>Hello ${userData.full_name},</p>
            <p>Your recent interview session has been analyzed. Here's a summary of your performance:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              <p><strong>Overall Score:</strong> ${resultData.overall_score}%</p>
              <p><strong>Questions Answered:</strong> ${resultData.questions?.length || 0}</p>
              <p><strong>Completed:</strong> ${new Date(resultData.completed_at).toLocaleString()}</p>
            </div>
            <p>For a detailed analysis, please log in to your account and view the full report.</p>
            <p>Keep practicing to improve your interview skills!</p>
            <p>AI Interview Coach Team</p>
          </body>
        </html>
      `,
      // attachments: [pdfAttachment] // In a real implementation
    };

    // In a real implementation, you would send the email here
    console.log("Sending results email:", emailData);

    // Update the email_sent flag (you would need to add this column)
    const { error: updateError } = await supabase
      .from("interview_results")
      .update({ email_sent: true })
      .eq("id", resultId);

    if (updateError) {
      console.error("Error updating email status:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending interview results:", error);
    return false;
  }
}

// Function to generate PDF report (placeholder)
export async function generateAnalysisReport(
  resultId: string,
): Promise<Blob | null> {
  try {
    if (!isSupabaseConfigured()) {
      console.log("Supabase not configured, skipping report generation");
      return null;
    }

    // Get result data with all related information
    const { data: resultData, error: resultError } = await supabase
      .from("interview_results")
      .select(
        `
        *,
        interview_sessions(role, industry, difficulty),
        user_profiles:user_id(full_name, email)
      `,
      )
      .eq("id", resultId)
      .single();

    if (resultError || !resultData) {
      console.error("Error fetching result data for report:", resultError);
      return null;
    }

    // In a real implementation, you would generate a PDF here
    // For now, we'll just return a mock blob
    const mockPdfContent = `
      Interview Analysis Report
      -----------------------
      Name: ${resultData.user_profiles?.full_name}
      Role: ${resultData.interview_sessions?.role}
      Date: ${new Date(resultData.completed_at).toLocaleDateString()}
      
      Overall Score: ${resultData.overall_score}%
      
      Question Analysis:
      ${resultData.questions
        ?.map(
          (q: string, i: number) =>
            `Question ${i + 1}: ${q}\n` +
            `Answer: ${resultData.answers?.[i] || "No answer provided"}\n` +
            `Score: ${resultData.detailed_analysis?.[i]?.metrics?.clarity || "N/A"}%\n`,
        )
        .join("\n")}
      
      Personality Insights:
      ${resultData.personality_traits?.join(", ") || "No personality insights available"}
    `;

    // Create a blob that would represent a PDF
    const blob = new Blob([mockPdfContent], { type: "application/pdf" });
    return blob;
  } catch (error) {
    console.error("Error generating analysis report:", error);
    return null;
  }
}
