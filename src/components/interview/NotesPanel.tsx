import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Download } from "lucide-react";

interface NotesPanelProps {
  questionIndex: number;
  onSaveNote?: (index: number, note: string) => void;
  savedNotes?: string[];
}

const NotesPanel = ({
  questionIndex,
  onSaveNote = () => {},
  savedNotes = [],
}: NotesPanelProps) => {
  const [note, setNote] = useState(savedNotes[questionIndex] || "");

  const handleSaveNote = () => {
    onSaveNote(questionIndex, note);
  };

  const handleExportNotes = () => {
    const notesText = savedNotes
      .map((note, index) => {
        return `Question ${index + 1}:\n${note}\n\n`;
      })
      .join("");

    const blob = new Blob([notesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "interview-notes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md">Interview Notes</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportNotes}
              title="Export all notes"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveNote}
              disabled={!note.trim()}
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Take notes for this question..."
          className="min-h-[150px] resize-none"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Your notes are saved automatically when you move to the next question.
        </p>
      </CardContent>
    </Card>
  );
};

export default NotesPanel;
