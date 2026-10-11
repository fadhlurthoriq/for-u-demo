const QuestionData = [
  {
    type: "emoji",
    question: "Neyy, do u still love me",
    mochiDialog: { emotion: "shy", message: "jawab jujur ya, aku beneran mau tau 🙈" },
    options: [
      { id: 1, emoji: "😐", label: "NOO NOO" },
      { id: 2, emoji: "🤔", label: "Little" },
      { id: 3, emoji: "🙂", label: "I think yes" },
      { id: 4, emoji: "😊", label: "Yeah" },
      { id: 5, emoji: "🥰", label: "OF COURSE YESS" }
    ]
  },
  {
    type: "yesno",
    question: "Maafin aku ya sayaang buat semua kesalahanku. Mau lanjut atau berhenti, aku terima pilihan kamu..",
    mochiDialog: { emotion: "hopeful", message: "maaf yaa sedikit kuusilin hehe.." },
    options: {
      yes: "Iya kumaafin, tapi jgn gitu lagi",
      no: "Gak kumaafin"
    }
  }
];